import { Injectable, NotFoundException } from '@nestjs/common';
import { food_categories } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async findCategory(category_id: number): Promise<food_categories> {
    const category = await this.prismaService.food_categories.findUnique({
      where: { category_id },
    });
    if (!category) throw new NotFoundException('Không tìm thấy danh mục này');
    return category;
  }

  // Lấy danh sách danh mục
  async getCategories() {
    const categories = await this.prismaService.food_categories.findMany();
    return {
      message: 'Lấy danh mục thành công',
      data: {
        categories,
      },
    };
  }
}
