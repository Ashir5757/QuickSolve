import React from 'react'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
        {children}
    </div> 
  )
}