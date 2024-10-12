'use client'
//import HeaderNav from "@/components/headerNav";
import ScrollBar from '@/components/scrollBar'
import ScrollFood from '@/components/scrollFood'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { getStoresFoodsApi } from '../apis/food.api'
import { IStoreFood } from '@/interfaces/interface'
import { useQuery } from '@tanstack/react-query'
import categoryApi from '../apis/category.api'
import Link from 'next/link'
import { createSearchParams } from '../utils/createSearchParams'
import { omit } from 'lodash'

type ScrollFoodProps = {
  title: string
  items: IStoreFood[]
}

export default function DashBoard() {
  const [dataFoods, setDataFoods] = useState<IStoreFood[]>([])

  // useEffect lấy danh sách Thức ăn
  useEffect(() => {
    getStoresFoodsApi()
      .then((result) => {
        setDataFoods(result)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  const banneritems = [
    {
      id: '1',
      name: 'anh 1',
      url: '/images/map1.png'
    },
    {
      id: '2',
      name: 'anh 2',
      url: '/images/map2.png'
    },
    {
      id: '3',
      name: 'anh 32',
      url: '/images/map3.png'
    },
    {
      id: '3',
      name: 'anh 32',
      url: '/images/map4.png'
    }
  ]

  const TodayFood: ScrollFoodProps = {
    title: 'Hôm Nay ăn gì',
    items: dataFoods
  }
  return (
    <>
      <div className='grid grid-cols-12 gap-4'>
        <div className='z-40 col-span-3 pl-8 pr-8 pt-3'>
          <div className='fixed flex w-64 flex-col gap-3 rounded-2xl bg-white pb-5 pl-3 pt-2'>
            <span>Thực đơn </span>
            {(categoriesData?.data.data.categories || []).map((categoryItem, index) => (
              <Link
                href={{
                  pathname: '/search',
                  search: createSearchParams(
                    omit(
                      {
                        category: categoryItem.category_id
                      },
                      ['order', 'sort_by']
                    )
                  )
                }}
                key={index}
                className='flex cursor-pointer flex-col gap-3 hover:bg-slate-100'
              >
                <div className='flex flex-row items-center gap-1'>
                  <Image src={categoryItem.image_url} width={30} height={30} alt={categoryItem.description} />
                  <span>{categoryItem.category_name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className='col-span-9 flex w-full flex-col gap-3 pr-8 pt-3'>
          <ScrollBar items={banneritems}></ScrollBar>
          <ScrollFood items={TodayFood}></ScrollFood>
        </div>
      </div>
    </>
  )
}
