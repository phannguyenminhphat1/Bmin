import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty({ message: 'Mã cửa hàng thức ăn không được rỗng' })
  @IsNumber({}, { message: 'Mã phải là số !' })
  store_foods_id: number;

  @IsNotEmpty({ message: 'Số lượng không được rỗng' })
  @IsNumber({}, { message: 'Số lượng phải là số !' })
  @IsPositive({ message: 'Số lượng không được bé hơn 0' })
  buy_count: number;
}
