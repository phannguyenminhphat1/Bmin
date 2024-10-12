export interface Food {
  food_id: number
  food_name: string
  description: string
  category_id: number
  image_url: string
  created_at: string // Sử dụng Date nếu bạn muốn xử lý thời gian kiểu Date
  updated_at: string
}

export interface Store {
  store_id: number
  store_name: string
  address: string
  phone_number: string
  created_at: string // Sử dụng Date nếu bạn muốn xử lý thời gian kiểu Date
  updated_at: string
}

export interface Product {
  store_foods_id: number
  store_id: number
  food_id: number
  stock_quantity: number
  price: string // Nếu `price` cần xử lý dưới dạng số, có thể thay đổi thành number
  foods: Food
  stores: Store
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

export interface ProductListConfig {
  page?: number | string
  limit?: number | string
  food_name?: string
  price_min?: number | string
  price_max?: number | string
  category?: number | string
  order?: 'asc' | 'desc'
  sort_by?: 'price' | 'stock'
}
