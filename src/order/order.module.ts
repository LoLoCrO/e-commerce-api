import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    controllers: [OrderController],
    providers: [PrismaService, OrderService],
})
export class OrderModule {}
