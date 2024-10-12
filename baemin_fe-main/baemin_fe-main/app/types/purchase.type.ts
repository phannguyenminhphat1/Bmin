import { Product } from './product.type'
export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5
export type PurchaseListStatus = 0 | PurchaseStatus

export interface Purchase {
  purchases_id: number
  user_id: number
  store_foods_id: number
  total_price: string
  buy_count: number
  status: PurchaseStatus
  created_at: string
  updated_at: string
  store_foods: Product
}

export interface PurchaseList {
  purchases: Purchase[]
  pagination: {
    total: number
    page: number
    limit: number
    page_size: number
  }
}

export interface ProductList {
  foods: Product[]
  pagination: {
    total: number
    page: number
    limit: number
    page_size: number
  }
}
