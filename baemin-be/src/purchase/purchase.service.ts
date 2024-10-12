import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AddToCartDto } from './dto/AddToCart.dto';
import { FoodService } from 'src/food/food.service';
import { users } from '@prisma/client';
import { Status } from 'src/constants/enum';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { GetCartQueryDto } from './dto/GetCartQuery.dto';
import { BuyProductDto } from './dto/BuyProduct.dto';
import { UpdatePurchaseDto } from './dto/UpdatePurchase.dto';
import { DeletePurchaseDto } from './dto/DeletePurchase.dto';

@Injectable()
export class PurchaseService {
  constructor(
    private prismaService: PrismaService,
    private foodService: FoodService,
  ) {}

  async addToCart(user: users, addToCartDto: AddToCartDto) {
    const { buy_count, store_foods_id } = addToCartDto;

    // Lấy và check xem store_foods_id khi người dùng click có tồn tại không
    const foodStore = await this.foodService.getStoreFoodById(store_foods_id);

    // Lấy ra số lượng tồn kho còn lại của thức ăn của cửa hàng đó
    const stockQuantity = foodStore.stock_quantity;
    if (buy_count > stockQuantity)
      throw new UnprocessableEntityException(
        'Số lượng còn lại của cửa hàng không đủ bằng số lượng bạn chọn',
      );

    // Kiểm tra xem món ăn đã có trong giỏ hàng chưa

    const existingPurchases = await this.prismaService.purchases.findFirst({
      where: {
        user_id: user.user_id,
        store_foods_id,
      },
    });
    if (!existingPurchases) {
      await this.prismaService.purchases.create({
        data: {
          user_id: user.user_id,
          store_foods_id,
          buy_count,
          total_price: buy_count * Number(foodStore.price),
          status: Status.InCart,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    } else {
      const newBuyCount = existingPurchases.buy_count + buy_count;
      const newTotalPrice = Number(foodStore.price) * newBuyCount;
      await this.prismaService.purchases.update({
        where: { purchases_id: existingPurchases.purchases_id },
        data: {
          buy_count: newBuyCount,
          total_price: newTotalPrice,
          updated_at: new Date(),
        },
      });
    }
    return {
      message: 'Thêm sản phẩm vào giỏ hàng thành công',
      data: {
        store_foods_id,
        buy_count,
      },
    };
  }

  async getPurchases(user: users, getCartQueryDto: GetCartQueryDto) {
    if (!getCartQueryDto.status) {
      throw new BadRequestException({ message: 'Status không được trống' });
    }
    const limit = getCartQueryDto.limit ? Number(getCartQueryDto.limit) : 10;
    const page = getCartQueryDto.page ? Number(getCartQueryDto.page) : 1;
    const [getPurchases, total] = await Promise.all([
      this.prismaService.purchases.findMany({
        where: {
          user_id: user.user_id,
          status: Number(getCartQueryDto.status),
        },
        include: {
          store_foods: {
            include: { foods: true, stores: true },
          },
        },
        skip: limit * (page - 1),
        take: limit,
      }),
      this.prismaService.purchases.count({
        where: {
          user_id: user.user_id,
          status: Number(getCartQueryDto.status),
        },
      }),
    ]);
    return {
      message: 'Lấy giỏ hàng thành công',
      data: {
        purchases: getPurchases,
        pagination: {
          total,
          page,
          limit,
          page_size: Math.ceil(total / limit),
        },
      },
    };
  }

  // Mua ngay
  async buyProductImmediately(user: users) {}

  // Mua hàng
  async buyProducts(user: users, buyProductDto: BuyProductDto) {
    const { purchase_id } = buyProductDto;

    await this.prismaService.$transaction(async (prisma) => {
      for (const id of purchase_id) {
        const purchase = await prisma.purchases.findUnique({
          where: { purchases_id: id },
          include: {
            store_foods: { include: { foods: true, stores: true } },
          },
        });

        if (!purchase || purchase.user_id !== user.user_id) {
          throw new BadRequestException({
            message: `Mã mua hàng ${id} không hợp lệ hoặc không thuộc về người dùng.`,
          });
        }

        if (purchase.status !== Status.InCart) {
          throw new UnprocessableEntityException({
            message: `Mã mua hàng ${id} không nằm trong giỏ hàng.`,
          });
        }

        if (purchase.store_foods.stock_quantity < purchase.buy_count) {
          throw new UnprocessableEntityException({
            message: `Số lượng tồn kho của sản phẩm ${purchase.store_foods.foods.food_name} không đủ để hoàn thành đơn hàng.`,
          });
        }

        // Cập nhật stock quantity cho store_foods
        await prisma.store_foods.update({
          where: { store_foods_id: purchase.store_foods_id },
          data: {
            stock_quantity: {
              decrement: purchase.buy_count,
            },
          },
        });
      }

      // Sau khi kiểm tra và cập nhật tồn kho, cập nhật trạng thái purchases
      await prisma.purchases.updateMany({
        where: {
          purchases_id: { in: purchase_id },
          user_id: user.user_id,
          status: Status.InCart,
        },
        data: {
          status: Status.WaitingForConfirmation,
          updated_at: new Date(),
        },
      });
    });

    return {
      message: 'Mua hàng thành công',
      data: {
        purchase_id,
      },
    };
  }

  async updatePurchase(user: users, updatePurchaseDto: UpdatePurchaseDto) {
    const { new_buy_count, purchases_id } = updatePurchaseDto;
    // Tìm purchase của user với status là InCart
    const purchase = await this.prismaService.purchases.findUnique({
      where: { purchases_id },
      include: { store_foods: true },
    });

    // Kiểm tra purchase có hợp lệ và thuộc về user
    if (!purchase || purchase.user_id !== user.user_id) {
      throw new BadRequestException(
        'Mã mua hàng không hợp lệ hoặc không thuộc về người dùng.',
      );
    }

    // Kiểm tra status của purchase
    if (purchase.status !== Status.InCart) {
      throw new UnprocessableEntityException(
        'Chỉ có thể cập nhật các sản phẩm trong giỏ hàng.',
      );
    }

    // Kiểm tra stock_quantity còn lại
    const availableStock = purchase.store_foods.stock_quantity;
    const currentBuyCount = purchase.buy_count;
    const difference = new_buy_count - currentBuyCount;

    if (availableStock < difference) {
      throw new UnprocessableEntityException(
        'Số lượng tồn kho không đủ để cập nhật đơn hàng.',
      );
    }

    // Cập nhật số lượng mới trong purchases và điều chỉnh stock_quantity
    await this.prismaService.purchases.update({
      where: { purchases_id },
      data: {
        buy_count: new_buy_count,
        total_price: new_buy_count * Number(purchase.store_foods.price),
        updated_at: new Date(),
      },
    });

    await this.prismaService.store_foods.update({
      where: { store_foods_id: purchase.store_foods_id },
      data: {
        stock_quantity: {
          decrement: difference,
        },
      },
    });

    return {
      message: 'Cập nhật giỏ hàng thành công.',
      data: {
        purchases_id,
        new_buy_count,
      },
    };
  }

  async deletePurchases(user: users, deletePurchaseDto: DeletePurchaseDto) {
    const { purchases_id } = deletePurchaseDto;

    // Lặp qua từng purchases_id và kiểm tra điều kiện trước khi xóa
    for (const id of purchases_id) {
      const purchase = await this.prismaService.purchases.findUnique({
        where: { purchases_id: id },
      });

      // Kiểm tra quyền sở hữu và trạng thái của từng purchase
      if (!purchase || purchase.user_id !== user.user_id) {
        throw new BadRequestException({
          message: `Mã mua hàng ${id} không hợp lệ hoặc không thuộc về người dùng.`,
        });
      }

      if (purchase.status !== Status.InCart) {
        throw new UnprocessableEntityException({
          message: `Chỉ có thể xóa các sản phẩm trong giỏ hàng. Mã mua hàng ${id} có trạng thái không hợp lệ.`,
        });
      }
    }

    // Xóa các purchases sau khi đã xác thực
    await this.prismaService.purchases.deleteMany({
      where: {
        purchases_id: { in: purchases_id },
        user_id: user.user_id,
        status: Status.InCart,
      },
    });

    return {
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công.',
      data: {
        purchases_id,
      },
    };
  }
}
