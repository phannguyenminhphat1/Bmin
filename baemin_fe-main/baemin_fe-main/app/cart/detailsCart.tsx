'use client'
import Image from 'next/image'
import { IDetailsCart } from '../../interfaces/interface'
// Use the defined types

export default function DetailsCart({ Details }: { Details: IDetailsCart[] }) {
  return (
    <>
      {Details.map((items, index) => (
        <div key={index} className='flex w-full flex-col rounded-md bg-white'>
          <div className='w-full border-b border-t border-solid border-gray-600 py-3'>
            {items.items.map((item, index) => (
              <div
                key={item.id || index}
                className={
                  index === items.items.length - 1
                    ? 'grid w-full grid-cols-12'
                    : 'grid w-full grid-cols-12 border-b border-solid border-x-gray-300'
                }
              >
                <div className='col-span-4 flex flex-row items-center gap-3 pl-8'>
                  <input
                    id='default-checkbox'
                    type='checkbox'
                    value=''
                    className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 dark:ring-offset-gray-800'
                  />
                  {item.img && (
                    <div className='relative h-36 w-36'>
                      <Image layout='fill' objectFit='cover' src={item.img} alt={item.namefood} />
                    </div>
                  )}
                  <div className='flex flex-col gap-3'>
                    <span className='text-base'>{item.namefood}</span>
                    <span className='text-sm text-gray-600'>{item.description}</span>
                  </div>
                </div>
                <div className='col-span-2 flex flex-row items-center justify-center gap-3'>₫{item.price}</div>
                <div className='col-span-2 flex flex-row items-center justify-center gap-3'>
                  <input
                    type='number'
                    id='quantity'
                    className='w-16 rounded border border-gray-300 text-center'
                    defaultValue={item.quantity}
                    min='1'
                    max='100'
                  />
                </div>
                <div className='col-span-2 flex flex-row items-center justify-center gap-3'>₫{item.totalprice}</div>
                <div className='col-span-2 flex flex-row items-center justify-center gap-3'>
                  <span className='cursor-pointer hover:text-red-600'>Xóa</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
