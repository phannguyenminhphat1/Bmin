'use client'

import React, { useContext, useEffect } from 'react'
import { AppContext } from '../contexts/app.context'
import { redirect } from 'next/navigation'

function Profile() {
  const { isAuthenticated } = useContext(AppContext)
  // const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login')
    }
  }, [isAuthenticated])
  return <div className='relative flex h-screen w-full items-center justify-center'>Profile</div>
}

export default Profile
