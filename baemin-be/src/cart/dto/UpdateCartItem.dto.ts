import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartItemDto {
  @IsNotEmpty({ message: 'Quantity is not null' })
  @IsNumber({}, { message: 'Quantity must be number' })
  newQuantity: number;

  @IsNotEmpty({ message: 'Cart item id is not null' })
  @IsNumber({}, { message: 'Cart item id must be number' })
  cartItemId: number;
}
