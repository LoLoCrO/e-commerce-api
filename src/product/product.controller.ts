import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    async createProduct(
        @Body() productDto: {
            name: string,
            price: number,
            description: string,
            stock: number,
        }): Promise<any> {
        if (Object.keys(productDto).length !== 4) {
            throw new BadRequestException('Invalid parameters');
        }

        return await this.productService.createProduct(productDto);
    }

    @Get('all')
    async getAllProducts(
        @Query('skip') skip?: number,
        @Query('take') take?: number,
    ): Promise<any> {
        return await this.productService.getAllProducts(+skip, +take);
    }

    @Get(':id')
    async getProductById(@Param('productId') productId: number): Promise<any> {
        if (!productId) {
            throw new BadRequestException('Invalid parameters');
        }

        return await this.productService.getProductById(productId);
    }

    @Post('update')
    async updateProduct(productId: number, productDto: {
        name?: string;
        price?: number;
        description?: string;
        stock?: number
    }): Promise<any> {
        if (!Object.keys(productDto).length) {
            throw new BadRequestException('Invalid parameters');
        }

        return await this.productService.updateProduct(productId, productDto);
    }

    @Post('delete')
    async deleteProduct(productId: number): Promise<any> {
        if (!productId) {
            throw new BadRequestException('Invalid parameters');
        }

        return await this.productService.deleteProduct(productId);
    }

    @Get('category/:id')
    async getProductsByCategory(
        @Param('id') categoryId: number,
        @Query('skip') skip?: number,
        @Query('take') take?: number,
    ): Promise<any> {
        if (!categoryId) {
            throw new BadRequestException('Invalid parameters');
        }

        return await this.productService.getProductsByCategory(categoryId, skip, take);
    }

    @Get('priceRange')
    async getProductsByPriceRange(
        @Query('minPrice') minPrice: number,
        @Query('maxPrice') maxPrice: number,
    ): Promise<any> {
        if (!minPrice || !maxPrice) {
            throw new BadRequestException('Invalid parameters');
        }

        return await this.productService.getProductsByPriceRange(minPrice, maxPrice);
    }

    @Get('search')
    async getProductsBySearchTerm(
        @Query('searchTerm') searchTerm: string,
        @Query('skip') skip?: number,
        @Query('take') take?: number,
    ): Promise<any> {
        if (!searchTerm) {
            throw new BadRequestException('Invalid parameters');
        }

        return await this.productService.getProductsBySearchTerm(searchTerm, skip, take);
    }

    @Get('category/:id/priceRange')
    async getProductsByCategoryAndPriceRange(
        @Param('id') categoryId: number,
        @Query('minPrice') minPrice: number,
        @Query('maxPrice') maxPrice: number,
        @Query('skip') skip?: number,
        @Query('take') take?: number,
    ): Promise<any> {
        if (!categoryId || !minPrice || !maxPrice) {
            throw new BadRequestException('Invalid parameters');
        }

        return await this.productService.getProductsByCategoryAndPriceRange(
            categoryId,
            minPrice,
            maxPrice,
            skip,
            take
        );
    }

    @Get('category/:id/search')
    async getProductsByCategoryAndSearchTerm(
        @Param('id') categoryId: number,
        @Query('searchTerm') searchTerm: string,
        @Query('skip') skip?: number,
        @Query('take') take?: number,
    ): Promise<any> {
        if (!categoryId) {
            throw new BadRequestException('Invalid parameters');
        }

        return await this.productService.getProductsByCategoryAndSearchTerm(
            categoryId,
            searchTerm,
            skip,
            take
        );
    }

    @Get('priceRange/search')
    async getProductsByPriceRangeAndSearchTerm(
        @Query('minPrice') minPrice: number,
        @Query('maxPrice') maxPrice: number,
        @Query('searchTerm') searchTerm: string,
        @Query('skip') skip?: number,
        @Query('take') take?: number,
    ): Promise<any> {
        if (!minPrice || !maxPrice) {
            throw new BadRequestException('Invalid parameters');
        }

        return await this.productService.getProductsByPriceRangeAndSearchTerm(
            minPrice,
            maxPrice,
            searchTerm,
            skip,
            take
        );
    }

    @Get('category/:id/priceRange/search')
    async getProductsByCategoryAndPriceRangeAndSearchTerm(
        @Param('id') categoryId: number,
        @Query('minPrice') minPrice: number,
        @Query('maxPrice') maxPrice: number,
        @Query('searchTerm') searchTerm: string,
        @Query('skip') skip?: number,
        @Query('take') take?: number,
    ): Promise<any> {
        if (!categoryId || !minPrice || !maxPrice) {
            throw new BadRequestException('Invalid parameters');
        }

        return await this.productService.getProductsByCategoryAndPriceRangeAndSearchTerm(
            categoryId,
            minPrice,
            maxPrice,
            searchTerm,
            skip,
            take
        );
    }
}
