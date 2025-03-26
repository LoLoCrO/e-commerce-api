import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}

    async createCategory(categoryDto: { name: string }): Promise<any> {
        const { name } = categoryDto;

        const newCategory = await this.prisma.category.create({
            data: { name },
        });

        return newCategory;
    }

    async getAllCategories(): Promise<any> {
        return await this.prisma.category.findMany();
    }

    async getCategoryById(categoryId: number): Promise<any> {
        return await this.prisma.category.findUnique({ where: { id: categoryId } });
    }

    async updateCategory(categoryId: number, categoryDto: { name: string }): Promise<any> {
        const { name } = categoryDto;

        const updatedCategory = await this.prisma.category.update({
            where: { id: categoryId },
            data: { name },
        });

        return updatedCategory;
    }

    async deleteCategory(categoryId: number): Promise<any> {
        return await this.prisma.category.delete({ where: { id: categoryId } });
    }
}
