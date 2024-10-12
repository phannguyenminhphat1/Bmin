import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteCartItemDto {
  @IsNotEmpty({ message: 'Cart item id is not null' })
  @IsNumber({}, { message: 'Cart item id must be number' })
  cartItemId: number;
}
