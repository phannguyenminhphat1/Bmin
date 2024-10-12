'use client'
/* eslint-disable @next/next/no-img-element */
import productApi from '@/app/apis/product.api'
import purchaseApi from '@/app/apis/purchase.api'
import { purchaseStatus } from '@/app/constants/purchase'
import { queryClient } from '@/app/ReactQueryClientProvider'
import Product from '@/app/search/Product'
import { ProductListConfig } from '@/app/types/product.type'
// import useQueryConfig from '@/app/hooks/useQueryConfig'
import QuantityController from '@/components/QuantityController'
import { ClockCircleTwoTone, DollarTwoTone } from '@ant-design/icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

export default function DetailFood() {
  const params = useParams()
  const id = params?.id
  // const queryConfig = useQueryConfig()
  const [buyCount, setBuyCount] = useState(1)

  const { data: productDetailsData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getFoodDetails(Number(id as string))
  })
  const queryConfig: ProductListConfig = {
    page: '1',
    limit: '10',
    category: String(productDetailsData?.data.data.foods.category_id)
  }

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getFoods(queryConfig as ProductListConfig)
    },
    staleTime: 3 * 60 * 1000,
    enabled: Boolean(productDetailsData)
  })
  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCartMutation = useMutation({
    mutationFn: (body: { store_foods_id: number; buy_count: number }) => purchaseApi.addToCart(body)
  })

  const addToCart = () => {
    addToCartMutation.mutate(
      {
        buy_count: buyCount,
        store_foods_id: productDetailsData?.data.data.store_foods_id as number
      },
      {
        onSuccess: (result) => {
          toast.success(result.data.message)
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchaseStatus.InCart }] })
        }
      }
    )
  }

  return (
    <>
      {productDetailsData && (
        <div className='flex h-auto w-full flex-col'>
          <div className='flex h-80 w-full bg-white'>
            <div className='w-[45%] overflow-hidden px-10 py-4'>
              <div className='relative w-full pt-[45%]'>
                <img
                  src={productDetailsData.data.data.foods.image_url}
                  alt='khongco'
                  className='absolute left-0 top-0 h-full w-full bg-white'
                />
              </div>
            </div>
            <div className='relative h-full w-[55%]'>
              <div className='absolute left-0 top-0 px-8 py-4'>
                <div className='mt-3 flex flex-row items-center justify-start text-[11px]'>
                  <span className='text-[#959595]'>
                    CỬA HÀNG - <span className='text-[#0288D1]'>{productDetailsData.data.data.stores.store_name}</span>
                  </span>
                </div>
                <div className='mt-2 text-[22px] font-bold'>{productDetailsData.data.data.foods.food_name}</div>
                <div className='mt-1 text-[13px]'>Địa chỉ: {productDetailsData.data.data.stores.address}</div>

                <div className='my-1 flex flex-row items-center justify-start gap-4 text-[15px]'>
                  <div className='flex flex-row items-center justify-start gap-1 text-[#6CC942]'>
                    <div className='h-2 w-2 rounded-full bg-[#6CC942]'></div>
                    <span>Mở cửa</span>
                  </div>
                  <div className='flex flex-row items-center justify-start gap-1'>
                    <ClockCircleTwoTone twoToneColor={'#3AC5C9'} />
                    <span>06:00 - 22:59</span>
                  </div>
                </div>
                <div className='flex flex-row items-center justify-start gap-1 text-[15px] text-[#959595]'>
                  <DollarTwoTone twoToneColor={'#c0c0c0'} className='text-[16px]' />
                  <span>
                    {Number(productDetailsData.data.data.price).toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    })}
                  </span>
                </div>
                <div className='mt-3 flex items-center gap-3'>
                  <div className='text-sm capitalize text-gray-500'>Số lượng:</div>
                  <QuantityController
                    onDecrease={handleBuyCount}
                    onIncrease={handleBuyCount}
                    onType={handleBuyCount}
                    value={buyCount}
                    max={productDetailsData.data.data.stock_quantity}
                  />
                  <div className='ml-6 text-sm text-gray-500'>
                    {productDetailsData.data.data.stock_quantity} sản phẩm có sẵn
                  </div>
                </div>
              </div>

              <div className='absolute bottom-0 left-0 mb-4 flex w-full flex-col px-8 text-[13px] text-[#959595]'>
                <div className='border-t-[1px]'></div>
                <div className='mt-3 flex items-center justify-start py-[10px]'>
                  <button
                    onClick={addToCart}
                    className='flex h-12 items-center justify-center rounded-sm border border-primary-color bg-primary-color px-5 text-sm capitalize text-white shadow-sm hover:bg-primary-color/80'
                  >
                    <svg
                      enableBackground='new 0 0 15 15'
                      viewBox='0 0 15 15'
                      x={0}
                      y={0}
                      className='mr-[10px] h-5 w-5 fill-current stroke-white text-white'
                    >
                      <g>
                        <g>
                          <polyline
                            fill='none'
                            points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeMiterlimit={10}
                          />
                          <circle cx={6} cy='13.5' r={1} stroke='none' />
                          <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                        </g>
                        <line
                          fill='none'
                          strokeLinecap='round'
                          strokeMiterlimit={10}
                          x1='7.5'
                          x2='10.5'
                          y1={7}
                          y2={7}
                        />
                        <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                      </g>
                    </svg>
                    Thêm vào giỏ hàng
                  </button>
                  <button className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm border px-5 text-sm capitalize text-black shadow outline-none hover:bg-gray-100'>
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='container'>
            <div className='w-full'>
              <div className='px-[26px] py-[13px] text-lg font-bold text-beamin'>SẢN PHẨM LIÊN QUAN</div>
              {productsData && (
                <div className='mt-6 grid grid-cols-2 gap-7 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                  {productsData.data.data.foods.map((product) => {
                    return (
                      <div className='col-span-1' key={product.store_foods_id}>
                        <Product product={product} />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
