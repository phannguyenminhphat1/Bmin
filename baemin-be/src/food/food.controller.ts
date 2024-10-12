import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { foods, store_foods } from '@prisma/client';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { GetFoods } from 'src/utils/common';
import { USERS_MESSAGES } from 'src/constants/messages';
import { QueryFoodDto } from './dto/query-food.dto';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('get-foods')
  async getFoods() {
    const data = await this.foodService.getFoods();
    return {
      message: 'Lấy danh sách món ăn thành công',
      data,
    };
  }

  @UsePipes(ValidationPipe)
  @Get('get-stores-foods')
  async getStoresFoods(): Promise<store_foods[]> {
    return await this.foodService.getStoresFoods();
  }

  @UsePipes(ValidationPipe)
  @Get('get-food/:store_foods_id')
  async getFood(@Param('store_foods_id', ParseIntPipe) store_foods_id: number) {
    return await this.foodService.getFood(store_foods_id);
  }

  @UsePipes(ValidationPipe)
  @Get('get-store-food/:store_foods_id')
  async getStoreFoodById(
    @Param('store_foods_id', ParseIntPipe) store_foods_id: number,
  ): Promise<store_foods> {
    return await this.foodService.getStoreFoodById(store_foods_id);
  }

  @UsePipes(ValidationPipe)
  @Get('get-all-foods')
  async getAllFoods(@Query() queryFoodDto: QueryFoodDto) {
    const data = await this.foodService.getAllFoods(queryFoodDto);
    return data;
  }
}
