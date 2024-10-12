import { QueryConfig } from '@/app/search/page'
import { createSearchParams } from '@/app/utils/createSearchParams'
import classNames from 'classnames'
import Link from 'next/link'
import React from 'react'
interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
const RANGE = 2

export default function Pagination({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='mx-2 rounded border bg-white px-3 py-2 text-black shadow-sm'>
            ...
          </span>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='mx-1 rounded border bg-white px-3 py-2 text-black shadow-sm'>
            ...
          </span>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <Link
            href={{
              pathname: '/search',
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber
              })
            }}
            key={index}
            className={classNames('mx-1 rounded bg-gray-100 p-2 px-3 py-2 text-black shadow-sm hover:opacity-85', {
              'border border-black bg-primary-color text-white': pageNumber === page,
              'border bg-white text-black': pageNumber !== page
            })}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <div className='mt-5 flex flex-wrap items-center justify-center text-sm'>
      {page === 1 ? (
        <span className='mx-1 cursor-not-allowed rounded border bg-gray-100 p-2 px-3 py-2 text-black shadow-sm hover:opacity-85'>
          Prev
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
          className='mx-1 rounded border bg-gray-100 p-2 px-3 py-2 text-black shadow-sm hover:opacity-85'
        >
          Prev
        </Link>
      )}

      {renderPagination()}

      {page === pageSize ? (
        <span className='mx-1 cursor-not-allowed rounded border bg-gray-100 p-2 px-3 py-2 text-black shadow-sm hover:opacity-85'>
          Next
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
          className='mx-2 rounded border bg-gray-100 p-2 px-3 py-2 text-black shadow-sm hover:opacity-85'
        >
          Next
        </Link>
      )}
    </div>
  )
}
