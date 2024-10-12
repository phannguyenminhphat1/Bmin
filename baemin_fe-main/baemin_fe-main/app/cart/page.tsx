/* eslint-disable @next/next/no-img-element */
'use client'

import { ShoppingCartOutlined } from '@ant-design/icons'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'antd'
import { redirect } from 'next/navigation'
import { AppContext } from '../contexts/app.context'
import { useQuery } from '@tanstack/react-query'
import purchaseApi from '../apis/purchase.api'
import { purchaseStatus } from '../constants/purchase'
import { formatCurrency } from '../utils/utils'
import QuantityController from '@/components/QuantityController'
import { Purchase } from '../types/purchase.type'
import * as Immer from 'immer'

interface ExtendedPurchase extends Purchase {
  disabled: boolean
  checked: boolean
}

export default function Cart() {
  const { isAuthenticated } = useContext(AppContext)
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>([])
  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login')
    }
  }, [isAuthenticated])
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.InCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.InCart }),
    enabled: isAuthenticated
  })
  const purchasesInCart = purchasesInCartData?.data.data.purchases
  const isAllChecked = extendedPurchases.every((purchase) => purchase.checked)
  useEffect(() => {
    setExtendedPurchases(
      purchasesInCart?.map((purchase) => ({
        ...purchase,
        disabled: false,
        checked: false
      })) || []
    )
  }, [purchasesInCart])

  const handleCheck = (productIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      Immer.produce((draft) => {
        draft[productIndex].checked = event.target.checked
      })
    )
  }
  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }
  return (
    <>
      <div className='flex h-20 w-full flex-row bg-white'>
        <div className='flex h-full w-1/2 flex-row items-center gap-3'>
          <div className='ml-10 text-4xl font-bold text-beamin'>
            <ShoppingCartOutlined />
          </div>
          <div className='text-2xl text-beamin'>|</div>
          <div className='text-3xl font-bold text-beamin'>Giỏ hàng</div>
        </div>
        <div className='flex h-full w-1/2 items-center gap-3'></div>
      </div>
      <div className='mt-4 flex flex-col gap-4 rounded-md px-16 pb-16'>
        <div className='grid h-16 w-full grid-cols-12 bg-white'>
          <div className='col-span-4 flex flex-row items-center gap-5 pl-8'>
            <input
              id='default-checkbox'
              type='checkbox'
              value=''
              className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 dark:ring-offset-gray-800'
              checked={isAllChecked}
              onChange={handleCheckAll}
            />
            <span className='text-base font-normal'> Món Ăn</span>
          </div>
          <div className='col-span-2 flex flex-row items-center justify-center gap-3'>
            <span className='text-base font-normal text-gray-600'>Đơn giá</span>
          </div>
          <div className='col-span-2 flex flex-row items-center justify-center gap-3'>
            <span className='text-base font-normal text-gray-600'>Số lượng</span>
          </div>
          <div className='col-span-2 flex flex-row items-center justify-center gap-3'>
            <span className='text-base font-normal text-gray-600'>Số tiền</span>
          </div>
          <div className='col-span-2 flex flex-row items-center justify-center gap-3'>
            <span className='text-base font-normal text-gray-600'>Thao tác</span>
          </div>
        </div>
        {purchasesInCartData &&
          extendedPurchases.map((purchase, index) => {
            return (
              <div key={purchase.purchases_id} className='w-full border-b border-t border-solid bg-white py-3'>
                <div className='grid w-full grid-cols-12 border-b border-solid border-x-gray-300'>
                  <div className='col-span-4 flex flex-row items-center gap-3 pl-8'>
                    <input
                      id='default-checkbox'
                      type='checkbox'
                      value=''
                      className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 dark:ring-offset-gray-800'
                      checked={purchase.checked}
                      onChange={handleCheck(index)}
                    />
                    <div className='relative h-36 w-36'>
                      <img
                        src={purchase.store_foods.foods.image_url}
                        alt={purchase.store_foods.foods.image_url}
                        className='h-full w-full border object-cover'
                      />
                    </div>
                    <div className='flex flex-col gap-3'>
                      <span className='text-base'>{purchase.store_foods.foods.food_name}</span>
                      <span className='text-sm text-gray-600'>{purchase.store_foods.stores.store_name}</span>
                    </div>
                  </div>
                  <div className='col-span-2 flex flex-row items-center justify-center gap-3'>
                    ₫{formatCurrency(Number(purchase.store_foods.price))}
                  </div>
                  <div className='col-span-2 flex flex-row items-center justify-center gap-3'>
                    <QuantityController value={purchase.buy_count} max={purchase.store_foods.stock_quantity} />
                  </div>
                  <div className='col-span-2 flex flex-row items-center justify-center gap-3'>
                    ₫{formatCurrency(Number(purchase.total_price))}
                  </div>
                  <button className='col-span-2 flex items-center justify-center gap-3'>
                    <span className='cursor-pointer hover:text-red-600'>Xóa</span>
                  </button>
                </div>
              </div>
            )
          })}

        <div className='fixed bottom-0 mr-16 flex h-16 w-[90.6%] flex-row items-center bg-white'>
          <div className='ml-8 flex h-full w-1/2 flex-row items-center gap-6'>
            <div className='col-span-4 flex flex-row items-center gap-5'>
              <input
                id='default-checkbox'
                type='checkbox'
                value=''
                className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 dark:ring-offset-gray-800'
                checked={isAllChecked}
                onChange={handleCheckAll}
              />
              <span className='text-base font-normal' onClick={handleCheckAll}>
                Chọn tất cả ({extendedPurchases.length})
              </span>
            </div>
            <div className='cursor-pointer hover:text-red-600'>Xóa</div>
          </div>
          <div className='flex h-full w-1/2 flex-row items-center justify-end gap-2 pr-2'>
            <div className=''> Tổng thanh toán (0 Sản phẩm):</div>
            <div className='text-red-600'>₫0</div>
            <div>
              <Button
                href='/checkout'
                style={{ background: '#3AC5C9', color: 'white' }}
                className='h-10 w-40 rounded-md bg-beamin text-white hover:brightness-105'
              >
                Thanh toán
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
