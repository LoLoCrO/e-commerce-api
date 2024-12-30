import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }

    async createProduct(productDto: {
        name: string,
        price: number,
        description: string,
        stock: number
    }): Promise<any> {
        const { name, price, description, stock } = productDto;

        const newProduct = await this.prisma.product.create({
            data: { name, price, description, stock },
        });

        return newProduct;
    }

    async getAllProducts(skip?: number, take?: number): Promise<any> {
        return await this.prisma.product.findMany({
            skip: skip ?? 0,
            take: take ?? 10,
        });
    }

    async getProductById(productId: number): Promise<any> {
        return await this.prisma.product.findUnique({ where: { id: productId } });
    }

    async updateProduct(productId: number,
        productDto: {
            name?: string,
            price?: number,
            description?: string,
            stock?: number
        }): Promise<any> {
        const { name, price, description, stock } = productDto;

        await this.prisma.$transaction(async (prisma) => {
            const updatedProduct = await prisma.product.update({
                where: { id: productId },
                data: { name, price, description, stock },
            });

            return updatedProduct;
        });
    }

    async deleteProduct(productId: number): Promise<any> {
        return await this.prisma.$transaction(async (prisma) => {
            return await prisma.product.delete({ where: { id: productId } });
        });
    }

    async getProductsByCategory(
        categoryId: number,
        skip?: number,
        take?: number
    ): Promise<any> {
        return await this.prisma.product.findMany({
            where: { categoryId },
            skip: skip ?? 0,
            take: take ?? 10,
        });
    }

    async getProductsByPriceRange(
        minPrice: number,
        maxPrice: number,
        skip?: number,
        take?: number
    ): Promise<any> {
        return await this.prisma.product.findMany({
            where: { price: { gte: minPrice, lte: maxPrice } },
            skip: skip ?? 0,
            take: take ?? 10,
        });
    }

    async getProductsBySearchTerm(
        searchTerm: string,
        skip?: number,
        take?: number
    ): Promise<any> {
        return await this.prisma.product.findMany({
            where: { name: { contains: searchTerm } },
            skip: skip ?? 0,
            take: take ?? 10,
        });
    }

    async getProductsByCategoryAndPriceRange(
        categoryId: number,
        minPrice: number,
        maxPrice: number,
        skip?: number,
        take?: number
    ): Promise<any> {
        return await this.prisma.product.findMany({
            where: {
                categoryId,
                price: { gte: minPrice, lte: maxPrice },
            },
            skip: skip ?? 0,
            take: take ?? 10,
        });
    }

    async getProductsByCategoryAndSearchTerm(
        categoryId: number,
        searchTerm: string,
        skip?: number,
        take?: number
    ): Promise<any> {
        return await this.prisma.product.findMany({
            where: {
                categoryId,
                name: { contains: searchTerm },
            },
            skip: skip ?? 0,
            take: take ?? 10,
        });
    }

    async getProductsByPriceRangeAndSearchTerm(
        minPrice: number,
        maxPrice: number,
        searchTerm: string,
        skip?: number,
        take?: number
    ): Promise<any> {
        return await this.prisma.product.findMany({
            where: {
                price: { gte: minPrice, lte: maxPrice },
                name: { contains: searchTerm },
            },
            skip: skip ?? 0,
            take: take ?? 10,
        });
    }

    async getProductsByCategoryAndPriceRangeAndSearchTerm(
        categoryId: number,
        minPrice: number,
        maxPrice: number,
        searchTerm: string,
        skip?: number,
        take?: number,
    ): Promise<any> {
        return await this.prisma.product.findMany({
            where: {
                categoryId,
                price: { gte: minPrice, lte: maxPrice },
                name: { contains: searchTerm },
            },
            skip: skip ?? 0,
            take: take ?? 10,
        });
    }
}
