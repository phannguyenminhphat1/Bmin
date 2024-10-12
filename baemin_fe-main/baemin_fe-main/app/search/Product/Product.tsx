/* eslint-disable @next/next/no-img-element */
'use client'
import { Product as ProductType } from '@/app/types/product.type'
import { formatCurrency } from '@/app/utils/utils'
import Link from 'next/link'
import React from 'react'

type Props = {
  product: ProductType
}
export default function Product({ product }: Props) {
  return (
    <Link href={`/detailfood/${product.store_foods_id}`}>
      <div className='overflow-hidden rounded-sm bg-gray-200/20 shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            src={product.foods.image_url}
            alt='khongco'
            className='absolute left-0 top-0 h-full w-full bg-white object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[1rem] text-sm font-semibold text-black'>{product.foods.food_name}</div>

          <div className='my-2 flex items-center'>
            <div className='max-w-[60%] truncate'>
              <span className='text-xs'>{product.stores.address}</span>
            </div>
            <span>-</span>
            <div className='ml-1 truncate font-semibold text-black'>
              <span className='mr-[2px] text-xs'>₫</span>
              <span className='text-xs'>{formatCurrency(Number(product.price))}</span>
            </div>
          </div>
          <div className='line-clamp-2 min-h-[2rem] border-t border-beamin-50 text-sm text-primary-color'>
            {product.stores.store_name}
          </div>
        </div>
      </div>
    </Link>
  )
}
