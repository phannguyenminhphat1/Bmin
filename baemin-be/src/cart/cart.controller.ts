import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/utils/decorators/user.decorator';
import { users } from '@prisma/client';
import { AddToCartDto } from './dto/AddToCart.dto';
import { DeleteCartItemDto } from './dto/DeleteCartItem.dto';
import { ERROR } from 'src/constants/error';
import { UpdateCartItemDto } from './dto/UpdateCartItem.dto';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('get-cart')
  @UseGuards(JwtAuthGuard)
  async getCart(@User() user: users) {
    return await this.cartService.getCart(user);
  }

  @Post('add-to-cart')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ERROR.UNPROCESSABLE_ENTITY_EXCEPTION)
  async addToCart(@User() user: users, @Body() addToCartDto: AddToCartDto) {
    return await this.cartService.addToCart(user, addToCartDto);
  }

  @Delete('delete-cart-item')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ERROR.UNPROCESSABLE_ENTITY_EXCEPTION)
  async deleteCartItem(
    @User() user: users,
    @Body() deleteCartItemDto: DeleteCartItemDto,
  ) {
    return await this.cartService.deleteCartItem(user, deleteCartItemDto);
  }

  @Patch('update-cart-item')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ERROR.UNPROCESSABLE_ENTITY_EXCEPTION)
  async updateCartItem(
    @User() user: users,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return await this.cartService.updateCartItem(user, updateCartItemDto);
  }
}
