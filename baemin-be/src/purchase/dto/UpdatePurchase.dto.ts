import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdatePurchaseDto {
  @IsNotEmpty({ message: 'Mã đơn hàng không được rỗng' })
  @IsNumber({}, { message: 'Mã phải là số !' })
  purchases_id: number;

  @IsNotEmpty({ message: 'Số lượng không được rỗng' })
  @IsNumber({}, { message: 'Số lượng phải là số !' })
  @IsPositive({ message: 'Số lượng không được bé hơn 0' })
  new_buy_count: number;
}
