import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private readonly prismaService: PrismaService) {}

    async createCart(cartDto: { userId: number }): Promise<any> {
        const { userId } = cartDto;

        const newCart = await this.prismaService.cart.create({
            data: { userId },
        });

        return newCart;
    }

    async getCartById(cartId: number): Promise<any> {
        return await this.prismaService.cart.findUnique({ where: { id: cartId } });
    }

    async getCartByUserId(userId: number): Promise<any> {
        return await this.prismaService.cart.findFirst({ where: { userId } });
    }

    async updateCart(cartId: number, cartDto: { userId: number }): Promise<any> {
        const { userId } = cartDto;

        const updatedCart = await this.prismaService.cart.update({
            where: { id: cartId },
            data: { userId },
        });

        return updatedCart;
    }

    async deleteCart(cartId: number): Promise<any> {
        return await this.prismaService.cart.delete({ where: { id: cartId } });
    }

    async addItemToCart(cartId: number, productId: number, quantity: number): Promise<any> {
        const cart = await this.prismaService.cart.findUnique({
            where: { id: cartId },
            include: { items: true },
        });

        const product = await this.prismaService.product.findUnique({
            where: { id: productId },
        });

        if (!cart || !product) {
            return null;
        }

        const existingProduct = cart.items.find((product) => product.productId === productId);

        if (existingProduct) {
            const updatedProduct = await this.prismaService.cartItem.update({
                where: { id: existingProduct.id },
                data: { quantity: existingProduct.quantity + quantity },
            });

            return updatedProduct;
        }

        const newProduct = await this.prismaService.cartItem.create({
            data: {
                cartId,
                productId,
                quantity,
            },
        });

        return newProduct;
    }

    async removeItemFromCart(cartId: number, productId: number): Promise<any> {
        return this.prismaService.cartItem.deleteMany({
            where: { cartId, productId },
        });
    }

    async updateItemQuantity(cartId: number, productId: number, quantity: number): Promise<any> {
        if (quantity <= 0) {
            return this.removeItemFromCart(cartId, productId);
        }

        const cart = await this.prismaService.cart.findUnique({
            where: { id: cartId },
            include: { items: true },
        });

        if (!cart) {
            return null;
        }

        const existingProduct = cart.items.find((product) => product.productId === productId);

        if (!existingProduct) {
            return null;
        }

        const updatedProduct = await this.prismaService.cartItem.update({
            where: { id: existingProduct.id },
            data: { quantity },
        });

        return updatedProduct;
    }

    async getCartItems(cartId: number): Promise<any> {
        return await this.prismaService.cartItem.findMany({
            where: { cartId },
            include: { product: true },
        });
    }

    async clearCart(cartId: number): Promise<any> {
        return await this.prismaService.cartItem.deleteMany({ where: { cartId } });
    }

    async checkoutCart(cartId: number): Promise<any> {
        return await this.prismaService.$transaction(async (prisma) => {
            const cart = await prisma.cart.findUnique({ where: { id: cartId } });
            const cartItems = await prisma.cartItem.findMany({
                where: { cartId },
                include: { product: true },
            });

            if (!cart) {
                throw new Error('Cart not found');
            }

            if (!cart.userId) {
                throw new Error('Cart does not have a user');
            }

            if (cartItems.length === 0) {
                throw new Error('Cart is empty');
            }

            if (cartItems.some((item) => item.quantity <= 0)) {
                throw new Error('Invalid quantity in cart');
            }

            const total = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

            const order = await prisma.order.create({
                data: {
                    userId: cart.userId,
                    totalPrice: total,
                    items: {
                        create: cartItems.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price,
                        })),
                    },
                },
            });

            await Promise.all(
                cartItems.map((item) => {
                    const newStock = item.product.stock - item.quantity;
                    if (newStock < 0) {
                        throw new Error(`Not enough stock for product ${item.product.name}`);
                    }

                    return prisma.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }),
            );

            await prisma.cartItem.deleteMany({ where: { cartId } });

            return order;
        });
    }
}
