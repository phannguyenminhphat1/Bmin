'use client'
import { useEffect, useState } from 'react'
import { User } from '../types/user.type'

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const result = localStorage.getItem('profile')
      setProfile(result ? JSON.parse(result) : null)
    }
  }, [])

  return profile
}
