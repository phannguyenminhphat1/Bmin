// checkout - detail checkout
// checkout - page
export interface IItem {
  name: string
  img: string
  description: string
  price: number
  quantity: number
  totalprice: number
}

// cart - page
export interface IItemCart {
  id?: string
  namefood: string
  description: string
  img?: string
  price: number
  quantity: number
  totalprice: number
}

export interface IDetailsCart {
  name: string
  quandoitac?: boolean
  items: IItemCart[]
}

// search - result

export interface IItemResult {
  id: string
  name: string
  img: string
  address: string
  kind: string
}

// statusOrder - status
export interface IStatusItem {
  id: string
  number: number
  name: string
  st: boolean
}
// statusOrder - page
export interface IDetailItem {
  name: string
  description: string
  price: number
  quantity: number
  totalprice: number
  img: string
}

// componnents - scrollBar
export interface IItemScrollBar {
  url: string
}

// type Category
export interface ICategory {
  category_id: number
  category_name: string
  description: string
  image_url: string
}

export interface IFood {
  food_id: number // ID của món ăn
  food_name: string // Tên món ăn
  description: string // Mô tả món ăn
  category_id: number // ID của danh mục
  image_url: string // URL hình ảnh của món ăn
  created_at: string // Thời gian tạo món ăn (ISO 8601)
  updated_at: string
}
export interface IStore {
  store_id: number
  store_name: string
  address: string
  phone_number: string
  created_at: string
  updated_at: string
}

export interface IStoreFood {
  store_foods_id: number
  store_id: number
  food_id: number
  stock_quantity: number
  price: string
  stores: IStore
  foods: IFood
}
