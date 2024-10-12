import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from 'prisma/prisma.service';
import { CartModule } from 'src/cart/cart.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService],
  imports: [CartModule],
})
export class PaymentModule {}
