import React, { ReactNode } from 'react'

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <section className='relative top-24 mb-5 w-full px-10'>{children}</section>
    </>
  )
}

export default Layout
