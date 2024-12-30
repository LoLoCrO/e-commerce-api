import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {

    //
    // TODO: Add cart items to order for visibility
    //

    constructor(private readonly orderService: OrderService) {}

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
        @Body() orderDto: { orderId: number, userId: number }
    ): Promise<any> {
        const { orderId, userId } = orderDto;

        if (!orderId || !userId) {
            return new BadRequestException('Invalid parameters');
        }

        return await this.orderService.update(orderId, { userId });
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
