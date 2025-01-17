import { PurchaseList, PurchaseListStatus } from '../types/purchase.type'
import { ResponseSuccessApi } from '../types/utils.type'
import http from '../utils/http'

const purchaseApi = {
  addToCart: (body: { store_foods_id: number; buy_count: number }) =>
    http.post<ResponseSuccessApi<{ buy_count: number; store_foods_id: number }>>('/purchase/add-to-cart', body),

  getPurchases: (params: { status: PurchaseListStatus }) =>
    http.get<ResponseSuccessApi<PurchaseList>>('/purchase/get-purchases', { params }),

  buyProducts: (body: { purchases_id: number[] }) =>
    http.post<ResponseSuccessApi<{ purchases_id: number[] }>>('/purchase/buy-products', body),

  updatePurchase: (body: { purchases_id: number; new_buy_count: number }) =>
    http.put<ResponseSuccessApi<{ purchases_id: number; new_buy_count: number }>>('/purchase/update-purchase', body),

  deletePurchases: (body: { purchases_id: number[] }) =>
    http.delete<ResponseSuccessApi<{ purchases_id: number[] }>>('/purchase/delete-purchases', {
      data: body
    })
}

export default purchaseApi
