import { foods } from '@prisma/client';
import { PaymentMethodEnum, PaymentStatusEnum } from 'src/constants/enum';

export interface CartResponse {
  cart_id: number;
  user_id: number;
  total_amount: number;
  total_quantity: number;
  created_at: Date;
  updated_at: Date;
  cart_items: {
    cart_item_id: number;
    cart_id: number;
    store_foods_id: number;
    quantity: number;
    price: number;
    total_price: number;
  }[];
}

export class PaymentResponse {
  payment_id: number;
  cart_id: number;
  payment_method: PaymentMethodEnum;
  payment_status: PaymentStatusEnum;
  discount: number;
  payment_amount: number;
  created_at: Date;
  updated_at: Date;
}

export interface GetFoods extends ResponsePagination {
  foods: foods[];
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface ResponsePagination {
  current_page: number;
  total_items: number;
  total_pages: number;
  limit: number;
}
