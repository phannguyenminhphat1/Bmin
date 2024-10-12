export const purchaseStatus = {
  InCart: -1, // Sản phẩm đang trong giỏ hàng
  AllProducts: 0, // Tất cả sản phẩm
  WaitingForConfirmation: 1, // Sản phẩm đang đợi xác nhận từ chủ shop
  Picking: 2, // Sản phẩm đang được lấy hàng
  Shipping: 3, // Sản phẩm đang vận chuyển
  Delivered: 4, // Sản phẩm đã được giao
  Canceled: 5 // Sản phẩm đã bị hủy
} as const
