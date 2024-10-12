'use client'
import React from 'react'

import AsideFilter from './AsideFilter'
import SortProductList from './SortProductList'
import Product from './Product'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import productApi from '../apis/product.api'
import Pagination from '@/components/Pagination'
import { ProductListConfig } from '../types/product.type'
import categoryApi from '../apis/category.api'
import useQueryConfig from '../hooks/useQueryConfig'

const Page: React.FC = () => {
  const queryConfig = useQueryConfig()
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getFoods(queryConfig as ProductListConfig)
    },
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div className='bg-white py-6'>
      <div className='container'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter categories={categoriesData?.data.data.categories || []} queryConfig={queryConfig} />
            </div>
            <div className='col-span-9'>
              <div className='w-full'>
                <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              </div>
              <div className='mt-6 grid grid-cols-2 gap-7 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.data.foods.map((product) => {
                  return (
                    <div className='col-span-1' key={product.store_foods_id}>
                      <Product product={product} />
                    </div>
                  )
                })}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Page
