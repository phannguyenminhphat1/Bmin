import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { PrismaService } from 'prisma/prisma.service';
import { FoodModule } from 'src/food/food.module';

@Module({
  controllers: [PurchaseController],
  providers: [PurchaseService, PrismaService],
  imports: [FoodModule],
})
export class PurchaseModule {}
