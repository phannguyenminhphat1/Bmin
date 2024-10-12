import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AddToCartDto } from './dto/AddToCart.dto';
import { cart, users } from '@prisma/client';
import { FoodService } from 'src/food/food.service';
import { DeleteCartItemDto } from './dto/DeleteCartItem.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { CartResponse } from 'src/utils/common';
import { UpdateCartItemDto } from './dto/UpdateCartItem.dto';

@Injectable()
export class CartService {
  constructor(
    private prismaService: PrismaService,
    private foodService: FoodService,
  ) {}

  async addToCart(user: users, addToCartDto: AddToCartDto) {
    const { user_id } = user;
    const { quantity = 1, store_foods_id } = addToCartDto;

    // Lấy và check xem food_id và store_id khi người dùng click có tồn tại không
    const foodStore = await this.foodService.getStoreFoodById(store_foods_id);

    // Lấy ra số lượng tồn kho còn lại của thức ăn của cửa hàng đó
    const getStockQuantity = foodStore.stock_quantity;
    if (quantity > getStockQuantity)
      throw new UnprocessableEntityException(
        'Số lượng còn lại của cửa hàng không đủ bằng số lượng bạn chọn',
      );

    // Kiểm tra giỏ hàng
    let cart = await this.prismaService.cart.findFirst({
      where: { user_id, is_completed: false },
    });
    if (!cart) {
      // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng cho người dùng
      cart = await this.prismaService.cart.create({
        data: {
          user_id,
          total_amount: 0,
          total_quantity: 0,
          created_at: new Date(),
          updated_at: new Date(),
          is_completed: false,
        },
      });
    }

    // Kiểm tra xem món ăn đã có trong giỏ hàng chưa
    const existingCartItem = await this.prismaService.cart_items.findFirst({
      where: {
        cart_id: cart.cart_id,
        store_foods_id: foodStore.store_foods_id,
      },
    });

    if (existingCartItem) {
      // Nếu món ăn đã tồn tại trong giỏ hàng, cập nhật số lượng
      const newQuantity = existingCartItem.quantity + quantity;
      const newTotalPrice = Number(foodStore.price) * newQuantity;
      await this.prismaService.cart_items.update({
        where: {
          cart_item_id: existingCartItem.cart_item_id,
          cart_id: cart.cart_id,
        },
        data: {
          quantity: newQuantity,
          price: foodStore.price,
          total_price: newTotalPrice,
        },
      });
    } else {
      // Nếu món ăn chưa có trong giỏ hàng, thêm mới
      const newTotalPrice = Number(foodStore.price) * quantity;

      await this.prismaService.cart_items.create({
        data: {
          cart_id: cart.cart_id,
          store_foods_id: foodStore.store_foods_id,
          quantity,
          price: foodStore.price,
          total_price: newTotalPrice,
        },
      });
    }

    // Cập nhật tổng số lượng và tổng tiền của giỏ hàng
    const updatedTotalQuantity = cart.total_quantity + quantity;
    const updatedTotalAmount =
      Number(cart.total_amount) + quantity * Number(foodStore.price);

    await this.prismaService.cart.update({
      where: {
        cart_id: cart.cart_id,
      },
      data: {
        total_quantity: updatedTotalQuantity,
        total_amount: updatedTotalAmount,
        updated_at: new Date(),
        is_completed: false,
      },
    });

    return {
      message: 'Add to cart successfully',
    };
  }

  async getCart(user: users): Promise<CartResponse> {
    const { user_id } = user;
    let findCart = await this.prismaService.cart.findFirst({
      where: { user_id, is_completed: false },
      include: { cart_items: true },
    });
    if (!findCart) {
      // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng cho người dùng
      findCart = await this.prismaService.cart.create({
        data: {
          user_id,
          total_amount: 0,
          total_quantity: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        include: {
          cart_items: true,
        },
      });
    }
    const cart = {
      ...findCart,
      total_amount:
        findCart.total_amount instanceof Decimal
          ? findCart.total_amount.toNumber()
          : findCart.total_amount,
      cart_items: findCart.cart_items.map((item) => ({
        ...item,
        price:
          item.price instanceof Decimal ? item.price.toNumber() : item.price,
        total_price:
          item.total_price instanceof Decimal
            ? item.total_price.toNumber()
            : item.total_price,
      })),
    };
    return cart;
  }

  async deleteCartItem(user: users, deleteCartItemDto: DeleteCartItemDto) {
    const { cartItemId } = deleteCartItemDto;
    const { user_id } = user;
    let cart = await this.prismaService.cart.findFirst({
      where: { user_id, is_completed: false },
      include: { cart_items: true },
    });
    if (!cart)
      throw new NotFoundException('Yours cart is empty, not things to delete');
    const cartItem = await this.prismaService.cart_items.findUnique({
      where: {
        cart_id: cart.cart_id,
        cart_item_id: cartItemId,
      },
    });
    if (!cartItem) throw new NotFoundException('Cart item not found !');
    const quantity = cartItem.quantity;
    const totalPrice = Number(cartItem.total_price);
    await Promise.all([
      this.prismaService.cart_items.delete({
        where: {
          cart_id: cart.cart_id,
          cart_item_id: cartItem.cart_item_id,
        },
      }),
      this.prismaService.cart.update({
        where: {
          cart_id: cart.cart_id,
          user_id,
        },
        data: {
          total_amount: Number(cart.total_amount) - totalPrice,
          total_quantity: cart.total_quantity - quantity,
          updated_at: new Date(),
        },
      }),
    ]);
    return {
      message: 'Delete cart item successfully',
    };
  }

  async updateCartItem(user: users, updateCartItemDto: UpdateCartItemDto) {
    const { cartItemId, newQuantity } = updateCartItemDto;
    const { user_id } = user;
    let cart = await this.prismaService.cart.findFirst({
      where: { user_id, is_completed: false },
      include: { cart_items: true },
    });
    if (!cart)
      throw new NotFoundException('Yours cart is empty, not things to update');
    const cartItem = await this.prismaService.cart_items.findUnique({
      where: {
        cart_id: cart.cart_id,
        cart_item_id: cartItemId,
      },
    });
    if (!cartItem) throw new NotFoundException('Cart item not found !');
    if (newQuantity <= 0)
      throw new UnprocessableEntityException('Quantity must be positive');

    // Tính toán số tiền trước và sau khi cập nhật
    const oldTotalPrice = Number(cartItem.total_price);
    const newTotalPrice = Number(cartItem.price) * newQuantity;

    // Cập nhật lại cart_item với số lượng mới và tổng tiền mới
    await this.prismaService.cart_items.update({
      where: { cart_item_id: cartItem.cart_item_id },
      data: {
        quantity: newQuantity,
        total_price: newTotalPrice,
      },
    });

    // Cập nhật lại tổng số tiền và số lượng mới của giỏ hàng
    const updatedTotalAmount =
      Number(cart.total_amount) - oldTotalPrice + newTotalPrice;
    const updatedTotalQuantity =
      cart.total_quantity - cartItem.quantity + newQuantity;

    // Cập nhật lại tổng số tiền và số lượng của giỏ hàng
    await this.prismaService.cart.update({
      where: { cart_id: cart.cart_id },
      data: {
        total_amount: updatedTotalAmount,
        total_quantity: updatedTotalQuantity,
        updated_at: new Date(),
        is_completed: false,
      },
    });
    return {
      message: 'Cart item updated successfully',
    };
  }
}
