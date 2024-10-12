import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { User } from 'src/utils/decorators/user.decorator';
import { users } from '@prisma/client';
import { AddToCartDto } from './dto/AddToCart.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCartQueryDto } from './dto/GetCartQuery.dto';
import { BuyProductDto } from './dto/BuyProduct.dto';
import { UpdatePurchaseDto } from './dto/UpdatePurchase.dto';
import { DeletePurchaseDto } from './dto/DeletePurchase.dto';

@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard)
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post('add-to-cart')
  async addToCart(@User() user: users, @Body() addToCartDto: AddToCartDto) {
    return this.purchaseService.addToCart(user, addToCartDto);
  }

  @Get('get-purchases')
  async getPurchases(
    @User() user: users,
    @Query() getCartQueryDto: GetCartQueryDto,
  ) {
    return this.purchaseService.getPurchases(user, getCartQueryDto);
  }

  @Put('update-purchase')
  async updatePurchase(
    @User() user: users,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchaseService.updatePurchase(user, updatePurchaseDto);
  }

  @Delete('delete-purchases')
  async deletePurchase(
    @User() user: users,
    @Body() deletePurchaseDto: DeletePurchaseDto,
  ) {
    return this.purchaseService.deletePurchases(user, deletePurchaseDto);
  }
}
