import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { users } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { PaymentDto } from './dto/Payment.dto';
import { CartService } from 'src/cart/cart.service';
import { PaymentStatusEnum } from 'src/constants/enum';

@Injectable()
export class PaymentService {
  constructor(
    private prismaService: PrismaService,
    private cartService: CartService,
  ) {}

  async processingPayment(user: users, paymentDto: PaymentDto) {
    const { payment_method } = paymentDto;

    const cart = await this.cartService.getCart(user);
    if (cart.cart_items.length <= 0)
      throw new UnprocessableEntityException(
        'Yours cart is empty, payment cannot be made',
      );

    // Giả sử là có liên kết với bên thứ 3 để thanh toán xong rồi PAYMENT_STATUS = completed nhé
    await this.prismaService.payments.create({
      data: {
        cart_id: cart.cart_id,
        payment_amount: Number(cart.total_amount),
        discount: 0,
        payment_method,
        payment_status: PaymentStatusEnum.COMPLETED,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Cập nhật lại cái cart is_completed = true
    await this.prismaService.cart.update({
      where: { cart_id: cart.cart_id },
      data: { is_completed: true },
    });

    // Cập nhật lại stock_quantity cho từng store_food_id
    await Promise.all(
      cart.cart_items.map(async (item) => {
        const storeFoodCartQuantity = item.quantity;
        const storeFood = await this.prismaService.store_foods.findUnique({
          where: { store_foods_id: item.store_foods_id },
          include: {
            foods: true,
          },
        });
        if (storeFoodCartQuantity > storeFood.stock_quantity)
          throw new BadRequestException(
            `Not enough inventory for the product ${storeFood.foods.food_name}`,
          );
        await this.prismaService.store_foods.update({
          where: { store_foods_id: storeFood.store_foods_id },
          data: {
            stock_quantity: storeFood.stock_quantity - storeFoodCartQuantity,
          },
        });
      }),
    );

    return {
      message: 'Payment & Order successfully, please keep track of your order',
    };
  }
}
