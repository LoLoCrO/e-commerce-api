import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: any) {
        return this.prismaService.order.create({
            data,
        });
    }

    async findAll(take?: number, skip?: number) {
        return this.prismaService.order.findMany({
            take: take ?? 10,
            skip: skip ?? 0,
        });
    }

    async findOne(id: number) {
        return this.prismaService.order.findUnique({
            where: { id },
        });
    }

    async update(id: number, data: any) {
        return this.prismaService.order.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        return this.prismaService.order.delete({
            where: { id },
        });
    }

    async getOrderByUserId(userId: number) {
        return this.prismaService.order.findMany({
            where: { userId },
        });
    }
}
