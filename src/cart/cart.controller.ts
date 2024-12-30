import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post()
    async createCart(@Body() cartDto: { userId: number }): Promise<any> {
        const { userId } = cartDto;

        if (!userId) {
            return new BadRequestException('Invalid parameters');
        }

        return await this.cartService.createCart({ userId });
    }

    @Post('update')
    async updateCart(
        @Body() cartDto: { cartId: number, userId: number }
    ): Promise<any> {
        const { cartId, userId } = cartDto;

        if (!cartId || !userId) {
            return new BadRequestException('Invalid parameters');
        }

        return await this.cartService.updateCart(cartId, { userId });
    }

    @Post('delete')
    async deleteCart(@Body() cartDto: { cartId: number }): Promise<any> {
        const { cartId } = cartDto;

        if (!cartId) {
            return new BadRequestException('Invalid parameters');
        }

        return await this.cartService.deleteCart(cartId);
    }

    @Post('add-item')
    async addItemToCart(
        @Body() cartItemDto: { cartId: number, productId: number, quantity: number }
    ): Promise<any> {
        const { cartId, productId, quantity } = cartItemDto;

        if (!cartId || !productId || !quantity) {
            return new BadRequestException('Invalid parameters');
        }

        return await this.cartService.addItemToCart(cartId, productId, quantity);
    }

    @Post('remove-item')
    async removeItemFromCart(
        @Body() cartItemDto: { cartId: number, productId: number }
    ): Promise<any> {
        const { cartId, productId } = cartItemDto;

        if (!cartId || !productId) {
            return new BadRequestException('Invalid parameters');
        }

        return await this.cartService.removeItemFromCart(cartId, productId);
    }
}
