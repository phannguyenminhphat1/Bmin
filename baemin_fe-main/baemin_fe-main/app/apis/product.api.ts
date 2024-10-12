import { Product, ProductList, ProductListConfig } from '../types/product.type'
import { ResponseSuccessApi } from '../types/utils.type'
import http from '../utils/http'

const productApi = {
  getFoods: (params: ProductListConfig) =>
    http.get<ResponseSuccessApi<ProductList>>('/food/get-all-foods', {
      params
    }),
  getFoodDetails: (id: number) => http.get<ResponseSuccessApi<Product>>(`/food/get-food/${id}`)
}

export default productApi
