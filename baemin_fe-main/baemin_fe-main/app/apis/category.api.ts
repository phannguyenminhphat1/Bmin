import { Categories, Category } from '../types/category.type'
import { ResponseSuccessApi } from '../types/utils.type'
import http from '../utils/http'

const categoryApi = {
  getCategories: () => http.get<ResponseSuccessApi<Categories>>('/category/get-categories')
}

export default categoryApi
