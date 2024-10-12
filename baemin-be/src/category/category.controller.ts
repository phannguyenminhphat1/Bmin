import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { food_categories } from '@prisma/client';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('get-categories')
  async getCategories() {
    return await this.categoryService.getCategories();
  }
}
