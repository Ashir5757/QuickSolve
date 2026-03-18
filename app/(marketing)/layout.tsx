import React from 'react'
import { Navbar } from '@/components/custom/nav-bar'

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='min-h-screen w-full px-3'>
     <Navbar />
        {children}
    </div> 
  )
}