'use client'
import Link from 'next/link'
import React from 'react'
import classNames from 'classnames'
import Button from '@/components/Button'
import { Category } from '@/app/types/category.type'
import { createSearchParams } from '@/app/utils/createSearchParams'
import { omit } from 'lodash'
import InputNumber from '@/components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import { Schema, schema } from '@/app/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { NoUndefinedField } from '@/app/types/utils.type'
import { QueryConfig } from '@/app/hooks/useQueryConfig'

interface Props {
  categories: Category[]
  queryConfig: QueryConfig
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>

const priceSchema = schema.pick(['price_min', 'price_max'])
export default function AsideFilter({ categories, queryConfig }: Props) {
  const { category } = queryConfig
  const router = useRouter()
  const {
    control,
    formState: { errors },
    trigger,
    handleSubmit
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })

  const onSubmit = handleSubmit((data) => {
    const searchParams = new URLSearchParams(
      omit(
        {
          ...queryConfig,
          price_max: data.price_max,
          price_min: data.price_min
        },
        ['order']
      )
    )
    return router.push(`/search?${searchParams.toString()}`)
  })

  const handleRemoveAllFilter = () => {
    const searchParams = new URLSearchParams(
      omit(
        {
          ...queryConfig
        },
        ['order', 'category', 'sort_by', 'price_min', 'price_max', 'food_name']
      )
    )
    return router.push(`/search?${searchParams.toString()}`)
  }
  return (
    <div className='py-4'>
      <Link
        href={'/search'}
        className={classNames('flex items-center font-bold', {
          'text-primary-color': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='my-2 h-[1px] bg-gray-300' />
      <ul>
        {categories.map((categoryItem) => {
          const isActive = Number(category as string) === categoryItem.category_id
          return (
            <li key={categoryItem.category_id} className='py-2 pl-2'>
              <Link
                href={{
                  pathname: '/search',
                  search: createSearchParams(
                    omit(
                      {
                        ...queryConfig,
                        category: categoryItem.category_id
                      },
                      ['order', 'price_max', 'price_min', 'sort_by']
                    )
                  )
                }}
                className={classNames('relative px-2 text-black hover:text-primary-color/80', {
                  'font-semibold text-primary-color': isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='absolute left-[-10px] top-[8px] h-2 w-2 fill-primary-color'>
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}

                {categoryItem.category_name}
              </Link>
            </li>
          )
        })}
      </ul>
      <Link href={'/search'} className='mt-4 flex items-center font-bold'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className='my-2 h-[1px] bg-gray-300' />
      <div className='my-3'>
        <div>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => (
                <InputNumber
                  type='text'
                  className='grow'
                  placeholder='₫ TỪ'
                  classNameInput='p-1 text-sm w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  classNameError='hidden'
                  {...field}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e)
                    trigger('price_max')
                  }}
                />
              )}
            />

            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => (
                <InputNumber
                  type='text'
                  className='grow'
                  placeholder='₫ ĐẾN'
                  classNameInput='p-1 text-sm w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  classNameError='hidden'
                  {...field}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e)
                    trigger('price_min')
                  }}
                />
              )}
            />
          </div>
          <div className='mt-1 min-h-[1.25rem] text-center text-sm text-red-600'>{errors.price_min?.message}</div>
          <Button className='mt-3 flex w-full items-center justify-center bg-primary-color p-2 text-sm uppercase text-white outline-none hover:bg-primary-color/80'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='my-2 h-[1px] bg-gray-300' />
      <Button
        onClick={handleRemoveAllFilter}
        className='mt-3 flex w-full items-center justify-center bg-primary-color p-2 text-sm uppercase text-white outline-none hover:bg-primary-color/80'
      >
        Xóa tất cả lựa chọn
      </Button>
    </div>
  )
}
