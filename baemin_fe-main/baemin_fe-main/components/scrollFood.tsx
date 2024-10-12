'use client'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { IStoreFood } from '@/interfaces/interface'

interface ScrollBarProps {
  items: {
    title: string
    items: IStoreFood[]
  }
}

export default function ScrollBar({ items }: ScrollBarProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleNavigate = (id: number) => {
    const url = `/detailfood/${id}`
    router.push(url)
  }

  const handleNext = () => {
    if (containerRef.current && currentIndex < items.items.length - 1) {
      setCurrentIndex(currentIndex + 1)
      containerRef.current.scrollBy({ left: 180, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (containerRef.current && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      containerRef.current.scrollBy({ left: -180, behavior: 'smooth' })
    }
  }

  return (
    <div className='w-full rounded-2xl bg-white' style={{ height: '300px' }}>
      <div className='flex h-full w-full flex-col px-4 pb-2 pt-4' style={{ height: '300px' }}>
        <div className='relative mb-2 ml-3 text-xl font-bold'>{items.title}</div>
        <div className='relative h-full w-full'>
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className='absolute top-20 z-20 h-8 w-8 rounded-full bg-white hover:bg-slate-50 hover:text-beamin'
            >
              <LeftOutlined />
            </button>
          )}
          <div ref={containerRef} className='scroll-container flex h-full w-full flex-row gap-3'>
            {items.items.map((item, index) => (
              <div
                key={index}
                onClick={() => handleNavigate(item.store_foods_id)}
                className='group h-full w-48 cursor-pointer'
              >
                <div className='h-2/3 w-full'>
                  <div
                    className='group-hover:brightness-75'
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <Image layout='fill' objectFit='cover' src={item.foods.image_url} alt={item.foods.food_name} />
                  </div>
                </div>
                <div className='flex h-1/3 w-full flex-col border-2 border-solid border-beamin-50 pl-2 pr-2 group-hover:bg-slate-50'>
                  <div className='w-full truncate text-base'>
                    <span>{item.foods.food_name}</span>
                  </div>
                  <div className='w-full truncate text-sm' style={{ color: '#959595' }}>
                    <span>{item.stores.address}</span>
                  </div>
                  <div className='mt-2 w-full border-t border-beamin-50 text-sm'>
                    <span className='mt-2'>{item.stores.store_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {currentIndex < items.items.length - 1 && (
            <button
              onClick={handleNext}
              className='absolute right-1 top-20 z-20 h-8 w-8 rounded-full bg-white hover:bg-slate-50 hover:text-beamin'
            >
              <RightOutlined />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
