import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get('all')
    async getAllOrders(
        @Query('skip') skip?: number,
        @Query('take') take?: number
    ): Promise<any> {
        if (!skip || !take) {
            return new BadRequestException('Invalid parameters');
        }

        return await this.orderService.findAll(+skip, +take);
    }

    @Get(':id')
    async getOrderById(@Query('orderId') orderId: number): Promise<any> {
        if (!orderId) {
            return new BadRequestException('Invalid parameters');
        }

        return await this.orderService.findOne(orderId);
    }

    @Post()
    async createOrder(@Body() orderDto: { userId: number }): Promise<any> {
        const { userId } = orderDto;

        if (!userId) {
            return new BadRequestException('Invalid parameters');
        }

        return await this.orderService.create({ userId });
    }

    @Post('update')
    async updateOrder(
        @Body() orderDto: {
            orderId: number,
            userId?: number,
            status?: string,
            totalPrice?: number,
            paymentId?: string,
        }): Promise<any> {
        if (!orderDto.orderId) {
            return new BadRequestException('Invalid parameters');
        }

        const keys = Object.keys(orderDto).filter(key => key !== 'orderId');
        if (keys.length === 0) {
            throw new BadRequestException('No properties to update');
        }

        return await this.orderService.update(orderDto.orderId, orderDto);
    }

    @Post('delete')
    async deleteOrder(@Body() orderDto: { orderId: number }): Promise<any> {
        const { orderId } = orderDto;

        if (!orderId) {
            return new BadRequestException('Invalid parameters');
        }

        return await this.orderService.remove(orderId);
    }
}
