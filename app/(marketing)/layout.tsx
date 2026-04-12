import { Footer } from "@/components/footer";
import { Header } from "@/components/header"; 
import React from 'react'


export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
       <Header />
     {/* <Navbar /> */}
        {children}
        <div>
			<Footer />
		</div>
    </div> 
  )
}