/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true // Đặt là false nếu bạn muốn điều hướng tạm thời (HTTP 302)
      }
    ]
  },
  images: {
    domains: [
      'giadinh.mediacdn.vn',
      'afamilycdn.com',
      'example.com',
      'i.pinimg.com',
      'i.ndtvimg.com',
      'deo.shopeemobile.com'
    ] // Thêm các hostname cần thiết
  }
}

export default nextConfig
