// src/cart/dto/add-to-cart.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { PaymentMethodEnum, PaymentStatusEnum } from 'src/constants/enum';

export class PaymentDto {
  // @IsNotEmpty({ message: 'Cart id is not null' })
  // @IsNumber({}, { message: 'Cart id must be number' })
  // cartId: number;

  @IsNotEmpty({ message: 'Payment method is not null' })
  @IsEnum(PaymentMethodEnum, { message: 'Payment method invalid' })
  payment_method: PaymentMethodEnum;

  // @IsNotEmpty({ message: 'Payment status is not null' })
  // @IsEnum(PaymentStatusEnum, { message: 'Payment status invalid' })
  // payment_status: PaymentStatusEnum;
}
