'use client'
import { sortBy, order as orderConstant } from '@/app/constants/product'
import { QueryConfig } from '@/app/hooks/useQueryConfig'
import { ProductListConfig } from '@/app/types/product.type'
import { createSearchParams } from '@/app/utils/createSearchParams'
import classNames from 'classnames'
import { omit } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
export default function SortProductList({ queryConfig, pageSize }: Props) {
  const { sort_by = sortBy.stock, order } = queryConfig
  const router = useRouter()
  const page = Number(queryConfig.page)
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    const searchParams = new URLSearchParams(
      omit(
        {
          ...queryConfig,
          sort_by: sortByValue
        },
        ['order']
      )
    )
    return router.push(`/search?${searchParams.toString()}`)
  }

  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    const searchParams = new URLSearchParams({
      ...queryConfig,
      sort_by: sortBy.price,
      order: orderValue
    })
    return router.push(`/search?${searchParams.toString()}`)
  }
  return (
    <div className='bg-gray-200/20 px-3 py-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-4'>
          <div className='text-sm font-semibold'>Sắp xếp theo:</div>
          <button
            className={classNames(
              'h-8 px-4 text-center text-sm capitalize hover:bg-primary-color/80 hover:text-white',
              { 'bg-primary-color text-white': isActiveSortBy(sortBy.stock) },
              { 'bg-white/95 text-black': !isActiveSortBy(sortBy.stock) }
            )}
            onClick={() => handleSort(sortBy.stock)}
          >
            Hot
          </button>
          <select
            className={classNames(
              'h-8 px-4 text-center text-sm capitalize outline-none hover:bg-primary-color/80 hover:text-white',
              { 'bg-primary-color text-white': isActiveSortBy(sortBy.price) },
              { 'bg-white/95 text-black': !isActiveSortBy(sortBy.price) }
            )}
            value={order || ''}
            onChange={(e) => handlePriceOrder(e.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option value='' disabled className='bg-white text-black'>
              Giá
            </option>
            <option value={orderConstant.asc} className='bg-white text-black'>
              Giá: Thấp đến cao
            </option>
            <option value={orderConstant.desc} className='bg-white text-black'>
              Giá: Cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div className='mr-2 text-sm'>
            <span className='font-semibold text-primary-color'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2 flex'>
            {page === 1 ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-bl-sm rounded-tl-sm bg-white shadow hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                href={{
                  pathname: '/search',
                  search: createSearchParams({
                    ...queryConfig,
                    page: page - 1
                  })
                }}
                className='flex h-8 w-9 items-center justify-center rounded-bl-sm rounded-tl-sm bg-white shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}

            {page === pageSize ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-bl-sm rounded-tl-sm bg-white shadow hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                href={{
                  pathname: '/search',
                  search: createSearchParams({
                    ...queryConfig,
                    page: page + 1
                  })
                }}
                className='flex h-8 w-9 items-center justify-center rounded-bl-sm rounded-tl-sm bg-white shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
