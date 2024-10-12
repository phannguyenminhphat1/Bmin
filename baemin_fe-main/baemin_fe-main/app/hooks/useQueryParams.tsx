'use client'
import { useSearchParams } from 'next/navigation'

export default function useQueryParams() {
  const searchParams = useSearchParams()
  if (!searchParams) {
    return {}
  }
  return Object.fromEntries(searchParams.entries())
}
