import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    async createCategory(@Body() categoryDto: { name: string }): Promise<any> {
        if (!categoryDto.name) {
            return new BadRequestException('Invalid parameters');
        }

        return await this.categoryService.createCategory(categoryDto);
    }

    @Get('all')
    async getAllCategories(): Promise<any> {
        return await this.categoryService.getAllCategories();
    }

    @Get(':id')
    async getCategoryById(@Param('categoryId') categoryId: number): Promise<any> {
        if (!categoryId) {
            return new BadRequestException('Invalid parameters');
        }

        return await this.categoryService.getCategoryById(categoryId);
    }

    @Post('update')
    async updateCategory(categoryId: number, categoryDto: { name: string }): Promise<any> {
        if (!categoryDto.name) {
            return new BadRequestException('Invalid parameters');
        }

        return await this.categoryService.updateCategory(categoryId, categoryDto);
    }
}
