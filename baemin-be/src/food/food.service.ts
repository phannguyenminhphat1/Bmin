import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { foods, store_foods } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CategoryService } from 'src/category/category.service';
import { StoreService } from 'src/store/store.service';
import { GetFoods } from 'src/utils/common';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { QueryFoodDto } from './dto/query-food.dto';
import { SortBy } from 'src/constants/enum';

@Injectable()
export class FoodService {
  constructor(
    private prismaService: PrismaService,
    private categoryService: CategoryService,
    private storeService: StoreService,
  ) {}

  // Lấy danh sách thức ăn
  async getFoods() {
    const foodStore = await this.prismaService.store_foods.findMany({
      include: { foods: true, stores: true },
    });
    const data = foodStore.map((item) => {
      return;
    });
    return foodStore;
    // return {
    //   foods,
    //   current_page: page,
    //   total_items: totalItems,
    //   total_pages: Math.ceil(totalItems / limit),
    //   limit: limit,
    // };
  }

  //   Lấy danh sách thức ăn theo cửa hàng
  async getFoodsByStore(store_id: number): Promise<store_foods[]> {
    const store = await this.storeService.getStoreById(store_id);
    const foods = await this.prismaService.store_foods.findMany({
      where: { store_id: store.store_id },
      include: {
        foods: true,
      },
    });
    return foods;
  }

  //   Lấy danh sách thức ăn theo loại
  async getFoodsByCategories(category_id: number): Promise<foods[]> {
    const category = await this.categoryService.findCategory(category_id);
    const foods = await this.prismaService.foods.findMany({
      where: { category_id: category.category_id },
    });
    return foods;
  }

  //   Lấy chi tiết thức ăn
  async getFood(store_foods_id: number) {
    const data = await this.prismaService.store_foods.findUnique({
      where: { store_foods_id },
      include: {
        foods: true,
        stores: true,
      },
    });
    if (!data)
      throw new NotFoundException({
        message: 'Không tìm thấy thức ăn',
      });
    return {
      message: 'Lấy thức ăn thành công',
      data,
    };
  }

  async getStoresFoods(): Promise<store_foods[]> {
    const storesFoods = await this.prismaService.store_foods.findMany({
      include: {
        stores: true,
        foods: true,
      },
    });
    const mixRandom = storesFoods.sort(() => Math.random() - 0.5);
    return mixRandom;
  }

  // Lấy store food id
  async getStoreFoodById(store_foods_id: number): Promise<store_foods> {
    const storeFood = await this.prismaService.store_foods.findUnique({
      where: {
        store_foods_id,
      },
      include: {
        stores: true,
        foods: true,
      },
    });
    if (!storeFood)
      throw new NotFoundException({
        message: 'Không tìm thấy thức ăn',
      });
    return storeFood;
  }

  // Tìm kiếm thức ăn
  async searchFoods(
    paginationDto: PaginationDto,
    foodName: string,
  ): Promise<GetFoods> {
    const limit = paginationDto.limit ? Number(paginationDto.limit) : 10;
    const page = paginationDto.page ? Number(paginationDto.page) : 1;

    const [foods, totalItems] = await Promise.all([
      this.prismaService.foods.findMany({
        where: {
          food_name: {
            contains: foodName,
            mode: 'insensitive',
          },
        },
        include: { food_categories: true },
        skip: limit * (page - 1),
        take: limit,
      }),
      this.prismaService.foods.count({
        where: {
          food_name: {
            contains: foodName,
            mode: 'insensitive',
          },
        },
      }),
    ]);
    return {
      foods,
      current_page: page,
      total_items: totalItems,
      total_pages: Math.ceil(totalItems / limit),
      limit: limit,
    };
  }

  async getAllFoods(queryFoodDto: QueryFoodDto) {
    const { sort_by, order, food_name, category, price_min, price_max } =
      queryFoodDto;
    const limit = queryFoodDto.limit ? Number(queryFoodDto.limit) : 10;
    const page = queryFoodDto.page ? Number(queryFoodDto.page) : 1;
    const sortOrder = order === 'desc' ? 'desc' : 'asc';
    if (price_min) {
      if (isNaN(price_min)) {
        throw new BadRequestException('price_min phải là số');
      }
    }
    if (price_max) {
      if (isNaN(price_max)) {
        throw new BadRequestException('price_max phải là số');
      }
    }
    if (price_min && price_max) {
      if (price_min > price_max) {
        throw new UnprocessableEntityException({
          message: 'Giá min không thể lớn hơn giá max',
        });
      }
    }
    if (category) {
      await this.categoryService.findCategory(Number(queryFoodDto.category));
    }

    const orderBy: any = {};
    if (sort_by === SortBy.PRICE) {
      orderBy.price = sortOrder; // Sắp xếp theo giá
    } else if (sort_by === SortBy.STOCK) {
      orderBy.stock_quantity = sortOrder; // Sắp xếp theo tồn kho
    }

    // Truy vấn danh sách món ăn
    const [foods, total] = await Promise.all([
      this.prismaService.store_foods.findMany({
        where: {
          ...(price_min ? { price: { gte: price_min } } : {}),
          ...(price_max ? { price: { lte: price_max } } : {}),
          ...(food_name || category
            ? {
                foods: {
                  ...(food_name
                    ? {
                        food_name: { contains: food_name, mode: 'insensitive' },
                      }
                    : {}),
                  ...(category ? { category_id: Number(category) } : {}),
                },
              }
            : {}),
        },
        include: {
          foods: true,
          stores: true,
        },
        skip: limit * (page - 1),
        take: limit,
        orderBy: Object.keys(orderBy).length ? orderBy : undefined,
      }),
      this.prismaService.store_foods.count({
        where: {
          ...(price_min ? { price: { gte: price_min } } : {}),
          ...(price_max ? { price: { lte: price_max } } : {}),
          ...(food_name || category
            ? {
                foods: {
                  ...(food_name
                    ? {
                        food_name: { contains: food_name, mode: 'insensitive' },
                      }
                    : {}),
                  ...(category ? { category_id: Number(category) } : {}),
                },
              }
            : {}),
        },
      }),
    ]);

    // Truy vấn tổng số lượng món ăn phù hợp điều kiện

    return {
      message: 'Lấy danh sách món ăn thành công',
      data: {
        foods,
        pagination: {
          total,
          page,
          limit,
          page_size: Math.ceil(total / limit),
        },
      },
    };
  }
}
