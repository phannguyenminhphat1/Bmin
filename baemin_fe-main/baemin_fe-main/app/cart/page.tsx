/* eslint-disable @next/next/no-img-element */
'use client'

import { ShoppingCartOutlined } from '@ant-design/icons'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'antd'
import { redirect } from 'next/navigation'
import { AppContext } from '../contexts/app.context'
import { useMutation, useQuery } from '@tanstack/react-query'
import purchaseApi from '../apis/purchase.api'
import { purchaseStatus } from '../constants/purchase'
import { formatCurrency } from '../utils/utils'
import QuantityController from '@/components/QuantityController'
import { Purchase } from '../types/purchase.type'
import * as Immer from 'immer'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'

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

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.InCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.InCart }),
    enabled: isAuthenticated
  })
  const purchasesInCart = purchasesInCartData?.data.data.purchases
  const isAllChecked = extendedPurchases.every((purchase) => purchase.checked)
  const checkedPurchases = extendedPurchases.filter((purchase) => purchase.checked)
  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchasePrice = checkedPurchases.reduce((result, current) => {
    return result + Number(current.store_foods.price) * current.buy_count
  }, 0)
  // const totalCheckedPurchaseSavingPrice = checkedPurchases.reduce((result, current) => {
  //   return result + (current.product.price_before_discount - current.product.price) * current.buy_count
  // }, 0)

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (result) => {
      refetch()
      toast.success(result.data.message)
    }
  })
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchases,
    onSuccess: () => {
      refetch()
    }
  })

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, 'purchases_id')
      return (
        purchasesInCart?.map((purchase) => ({
          ...purchase,
          disabled: false,
          checked: Boolean(extendedPurchasesObject[purchase.purchases_id]?.checked)
        })) || []
      )
    })
  }, [purchasesInCart])

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      Immer.produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
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

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      Immer.produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        Immer.produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ purchases_id: purchase.purchases_id, new_buy_count: value })
    }
  }

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex].purchases_id
    deletePurchasesMutation.mutate(
      { purchases_id: [purchaseId] },
      {
        onSuccess: (result) => {
          toast.success(result.data.message)
        }
      }
    )
  }
  const handleDeleteManyPurchases = () => {
    const purchasesIds = checkedPurchases.map((purchase) => purchase.purchases_id)
    deletePurchasesMutation.mutate({ purchases_id: purchasesIds })
  }

  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => purchase.purchases_id)
      buyProductsMutation.mutate({ purchases_id: body })
    }
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
        {extendedPurchases.length > 0 &&
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
                    <QuantityController
                      value={purchase.buy_count}
                      max={purchase.store_foods.stock_quantity}
                      onIncrease={(value) => handleQuantity(index, value, value <= purchase.store_foods.stock_quantity)}
                      onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                      onType={handleTypeQuantity(index)}
                      onFocusOut={(value) =>
                        handleQuantity(
                          index,
                          value,
                          value >= 1 &&
                            value <= purchase.store_foods.stock_quantity &&
                            value !== (purchasesInCart as Purchase[])[index].buy_count
                        )
                      }
                      disabled={purchase.disabled}
                    />
                  </div>
                  <div className='col-spans-2 flex flex-row items-center justify-center gap-3'>
                    ₫{formatCurrency(Number(purchase.total_price))}
                  </div>
                  <button onClick={handleDelete(index)} className='col-span-2 flex items-center justify-center gap-3'>
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
            <div className='cursor-pointer hover:text-red-600' onClick={handleDeleteManyPurchases}>
              Xóa
            </div>
          </div>
          <div className='flex h-full w-1/2 flex-row items-center justify-end gap-2 pr-2'>
            <div className=''> Tổng thanh toán ({checkedPurchasesCount} Sản phẩm):</div>
            <div className='text-red-600'>₫{formatCurrency(totalCheckedPurchasePrice)}</div>
            <div>
              <Button
                // href='/checkout'
                style={{ background: '#3AC5C9', color: 'white' }}
                className='h-10 w-40 rounded-md bg-beamin text-white hover:brightness-105'
                onClick={handleBuyPurchases}
                disabled={buyProductsMutation.isPending}
              >
                Mua hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
