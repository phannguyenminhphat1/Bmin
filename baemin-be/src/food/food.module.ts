import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { PrismaService } from 'prisma/prisma.service';
import { CategoryModule } from 'src/category/category.module';
import { StoreModule } from 'src/store/store.module';

@Module({
  controllers: [FoodController],
  providers: [FoodService, PrismaService],
  imports: [CategoryModule, StoreModule],
  exports: [FoodService],
})
export class FoodModule {}
