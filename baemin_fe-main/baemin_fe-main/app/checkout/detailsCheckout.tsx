import Image from 'next/image'
import { Purchase } from '../types/purchase.type'
import { formatCurrency } from '../utils/utils'

interface DetailsCheckoutProps {
  items: Purchase[]
}

export default function DetailsCheckout({ items }: DetailsCheckoutProps) {
  return (
    <>
      <div className='ml-10 mt-3 grid grid-cols-12'>
        <div className='col-span-6'>Món Ăn</div>
        <div className='col-span-2'>Đơn giá</div>
        <div className='col-span-2'>Số Lượng</div>
        <div className='col-span-2'>Thành tiền</div>
      </div>

      {items.map((item, index) => (
        <div key={index} className='ml-10 mt-4 grid grid-cols-12'>
          <div className='col-span-6 flex flex-row items-center gap-3'>
            <div className='relative h-16 w-16'>
              <Image
                layout='fill'
                objectFit='cover'
                src={item.store_foods.foods.image_url}
                alt={item.store_foods.foods.image_url}
                // Ensure the parent div of Image has defined dimensions
              />
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-base'>{item.store_foods.foods.food_name}</span>
              <span className='text-sm text-gray-600'>{item.store_foods.stores.store_name}</span>
            </div>
          </div>
          <div className='col-span-2 ml-1 flex items-center'>{formatCurrency(Number(item.store_foods.price))}</div>
          <div className='col-span-2 ml-5 flex items-center'>{item.buy_count}</div>
          <div className='col-span-2 ml-5 flex items-center'>{formatCurrency(Number(item.total_price))}</div>
        </div>
      ))}
    </>
  )
}
