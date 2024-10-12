import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Order, SortBy } from 'src/constants/enum';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

export class QueryFoodDto extends PaginationDto {
  @IsOptional()
  @IsEnum(SortBy)
  sort_by?: SortBy;

  @IsOptional()
  @IsEnum(Order)
  order?: Order;

  @IsOptional()
  @IsPositive({
    message: 'Giá phải lớn hơn 0',
  })
  @IsNumber({}, { message: 'Giá phải là số' })
  price_min?: number;

  @IsOptional()
  @IsPositive({
    message: 'Giá phải lớn hơn 0',
  })
  @IsNumber({}, { message: 'Giá phải là số' })
  price_max?: number;

  @IsOptional()
  @IsString({
    message: 'Tên thức ăn phải là chuỗi',
  })
  food_name?: string;

  @IsOptional()
  @Type(() => Number)
  category?: number; // categoryId
}
