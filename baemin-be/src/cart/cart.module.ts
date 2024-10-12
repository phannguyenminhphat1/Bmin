import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'prisma/prisma.service';
import { FoodModule } from 'src/food/food.module';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService],
  imports: [FoodModule],
  exports: [CartService],
})
export class CartModule {}
