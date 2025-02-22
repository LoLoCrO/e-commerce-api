import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async createUser(userDto: {
        email: string;
        username: string,
        password: string,
        role: string,
    }): Promise<any> {
        const newUser = await this.prismaService.user.create({ data: userDto });

        return newUser;
    }

    async getUserByEmail(email: string): Promise<any> {
        return await this.prismaService.user.findUnique({ where: { email } });
    }

    async getUserById(userId: number): Promise<any> {
        return await this.prismaService.user.findUnique({ where: { id: userId } });
    }

    async updateUser(userId: number, userDto: { email: string; password: string }): Promise<any> {
        const { email, password } = userDto;

        const updatedUser = await this.prismaService.user.update({
            where: { id: userId },
            data: { email, password },
        });

        return updatedUser;
    }

    async deleteUser(userId: number): Promise<any> {
        return await this.prismaService.user.delete({ where: { id: userId } });
    }

    async getUserCart(userId: number): Promise<any> {
        return await this.prismaService.user.findUnique({
            where: { id: userId },
            include: { cart: true },
        });
    }

    async getUserOrders(userId: number): Promise<any> {
        return await this.prismaService.user.findUnique({
            where: { id: userId },
            include: { orders: true },
        });
    }
}
