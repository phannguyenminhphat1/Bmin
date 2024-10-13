'use client'
/* eslint-disable @next/next/no-img-element */

import { Button } from 'antd'
import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Popover from './Popover'
import { useContext } from 'react'
import { AppContext } from '@/app/contexts/app.context'
import { useMutation, useQuery } from '@tanstack/react-query'
import authApi from '@/app/apis/auth.api'
import { clearLS } from '@/app/utils/auth'
import { toast } from 'react-toastify'
import useQueryConfig from '@/app/hooks/useQueryConfig'
import { useForm } from 'react-hook-form'
import { schema, Schema } from '@/app/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import purchaseApi from '@/app/apis/purchase.api'
import { purchaseStatus } from '@/app/constants/purchase'
import { formatCurrency } from '@/app/utils/utils'
import { queryClient } from '@/app/ReactQueryClientProvider'

type FormData = Pick<Schema, 'food_name'>
const nameSchema = schema.pick(['food_name'])
const MAX_PURCHASE = 5
export default function HeaderNav() {
  const queryConfig = useQueryConfig()
  const router = useRouter()
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext)

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      food_name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const navigation = () => {
    router.push('/dashboard')
  }
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logoutApi(),
    onSuccess: (result) => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchaseStatus.InCart }] })

      toast.success(result.data.message)
      clearLS()
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.InCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.InCart }),
    enabled: isAuthenticated
  })

  const onSubmit = handleSubmit((data) => {
    const searchParams = new URLSearchParams(
      omit(
        {
          ...queryConfig,
          food_name: data.food_name
        },
        ['order', 'category', 'sort_by', 'price_min', 'price_max']
      )
    )
    return router.push(`/search?${searchParams.toString()}`)
  })
  return (
    <div className='h-fix fixed z-50 flex w-full flex-row justify-center justify-items-center gap-4 bg-white py-3'>
      <div onClick={navigation} className='ml-10 h-full w-fit flex-none cursor-pointer'>
        <svg xmlns='http://www.w3.org/2000/svg' width='131' height='50' viewBox='0 0 131 27'>
          <g fill='#3AC5C9' fillRule='evenodd'>
            <path d='M45 0v27h18v-5.21H50.054v-5.685h8.837v-5.21h-8.837V5.21H63V0zM90 0v5.21h6.948v16.58H90V27h19v-5.21h-6.95V5.21H109V0zM11.86 11.132H5.046V5.21h6.64c1.895 0 2.824 1.162 2.824 2.961 0 1.8-.752 2.96-2.648 2.96m-.177 10.659H5.045V15.869h6.816c1.896 0 2.648 1.161 2.648 2.96 0 1.8-.929 2.96-2.825 2.96M19 8.645v-.947C19 3.434 15.77 0 11.76 0H0v27H11.76C15.769 27 19 23.566 19 19.303v-.947A6.287 6.287 0 0 0 16.74 13.5 6.285 6.285 0 0 0 19 8.644M119.319 0l6.25 16.536c.078.206.375.148.375-.072V0H131v27h-6.32l-6.247-16.526c-.079-.208-.379-.15-.379.073V27H113V0h6.319zM80.506 10.465l-1.702 6.255c-.647 2.379-3.96 2.378-4.606 0l-1.706-6.272c-.059-.216-.372-.173-.372.052V27H67V0h6.282l3.033 11.008c.053.192.32.192.372 0L79.72 0H86v27h-5.118V10.517c0-.228-.317-.271-.376-.052M28.572 16.715l2.742-11.59c.048-.2.326-.2.373 0l2.742 11.59h-5.857zm8.064-12.546a5.257 5.257 0 0 0-1.864-3C33.808.39 32.718 0 31.502 0c-1.244 0-2.342.39-3.293 1.169-.95.779-1.565 1.779-1.844 3L21 27h5.136l1.218-5.143h8.293L36.865 27H42L36.636 4.17z' />
          </g>
        </svg>
      </div>
      <form onSubmit={onSubmit} className='ml-5 flex w-full items-center rounded-md bg-slate-50 px-2'>
        <div className='flex flex-grow'>
          <input
            className='flex-grow rounded-bl-sm rounded-tl-sm px-3 text-gray-400 outline-none'
            placeholder='Tìm kiếm'
            {...register('food_name')}
          />
          <button className='h-10 flex-shrink-0 rounded-br-md rounded-tr-md bg-[#3ac5c9] px-6 py-2 text-white hover:opacity-90'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
              />
            </svg>
          </button>
        </div>
      </form>

      <div className='flex w-1/4 flex-none flex-row items-center py-2'>
        <Button
          href='/dashboard'
          className='btn-home font-normal leading-5'
          style={{
            fontSize: '18px',
            height: '100%',
            color: 'rgb(128, 128, 137)'
          }}
          type='text'
          icon={<HomeOutlined />}
        >
          Trang Chủ
        </Button>
        <div className='mr-8 flex h-full cursor-pointer'>
          {isAuthenticated && (
            <Popover
              className='flex items-center text-[18px] font-normal leading-5 text-gray-500 hover:text-gray-700'
              renderPopover={
                <div className='relative rounded-sm border border-gray-200 bg-white pl-1 pr-16 text-left shadow-md'>
                  {/* <Link href={'/profile'} className='block w-full bg-white px-4 py-3 text-left hover:text-cyan-500'>
                    Tài khoản của tôi
                  </Link> */}
                  <Link href={'/checkout'} className='block w-full bg-white px-4 py-3 text-left hover:text-cyan-500'>
                    Đơn mua
                  </Link>
                  <button
                    className='block w-full bg-white px-4 py-3 text-left hover:text-cyan-500'
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              }
            >
              <div className='flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='mr-2 h-5 w-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                  />
                </svg>
                <span>{profile?.username}</span>
              </div>
            </Popover>
          )}

          {!isAuthenticated && (
            <div className='flex items-center text-[18px] font-normal leading-5 text-gray-500 hover:text-gray-700'>
              <HomeOutlined />
              <Link href={'/login'} className='ml-2'>
                Đăng nhập
              </Link>
            </div>
          )}
        </div>

        <div className='col-span-1 justify-self-end'>
          <Popover
            renderPopover={
              <div className='relative max-w-[400px] rounded-sm border border-gray-200 bg-white text-sm shadow-md'>
                {purchasesInCartData?.data.data ? (
                  <div className='px-3'>
                    <div className='pt-3 text-center font-semibold capitalize text-gray-400'>Sản phẩm mới thêm</div>
                    <div className='mt-5'>
                      {purchasesInCartData.data.data.purchases.slice(0, MAX_PURCHASE).map((purchase) => {
                        return (
                          <div className='mt-4 flex hover:bg-gray-100' key={purchase.purchases_id}>
                            <div className='flex-shrink-0'>
                              <img
                                src={purchase.store_foods.foods.image_url}
                                alt='anh'
                                className='h-11 w-11 object-cover'
                              />
                            </div>
                            <div className='ml-2 flex-grow flex-col overflow-hidden'>
                              <div className='truncate'>{purchase.store_foods.foods.food_name}</div>
                              <div className='truncate text-xs text-gray-400'>
                                {purchase.store_foods.stores.store_name}
                              </div>
                            </div>
                            <div className='ml-2 flex-shrink-0'>
                              <span className='text-primaryColor'>
                                ₫{formatCurrency(Number(purchase.store_foods.price))}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className='mt-6 flex items-center justify-between py-3'>
                      <div className='mr-4 text-xs capitalize text-gray-500'>
                        {purchasesInCartData.data.data.purchases.length > MAX_PURCHASE
                          ? purchasesInCartData.data.data.purchases.length - MAX_PURCHASE
                          : ''}{' '}
                        Thêm hàng vào giỏ
                      </div>
                      <Link
                        href={'/cart'}
                        className='rounded-sm bg-primary-color px-4 py-2 capitalize text-white hover:bg-opacity-90'
                      >
                        Xem giỏ hàng
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className='p-2'>
                    <img
                      className='m-auto flex h-40 w-40 object-cover'
                      src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/c44984f18d2d2211.png'
                      alt='chuacosanpham'
                    />
                    <p className='mt-3 text-center'>Chưa có sản phẩm nào</p>
                  </div>
                )}
              </div>
            }
            placement='bottom-end'
          >
            <Button
              href='/cart'
              type='text'
              style={{
                fontSize: '20px',
                width: '40px',
                height: '100%',
                color: '#3AC5C9'
              }}
              icon={<ShoppingCartOutlined />}
            ></Button>
          </Popover>
        </div>

        {purchasesInCartData && (
          <span
            className='relative bottom-3 right-4 w-full rounded bg-red-600 text-center text-xs text-white'
            style={{ width: '15px', borderRadius: '50px' }}
          >
            {purchasesInCartData?.data.data.purchases.length > 0 ? purchasesInCartData?.data.data.purchases.length : ''}
          </span>
        )}
      </div>
    </div>
  )
}
