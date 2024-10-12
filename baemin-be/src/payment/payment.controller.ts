import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { User } from 'src/utils/decorators/user.decorator';
import { users } from '@prisma/client';
import { PaymentDto } from './dto/Payment.dto';
import { ERROR } from 'src/constants/error';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(ERROR.UNPROCESSABLE_ENTITY_EXCEPTION)
  @Post()
  async processingPayment(@User() user: users, @Body() paymentDto: PaymentDto) {
    return await this.paymentService.processingPayment(user, paymentDto);
  }
}
