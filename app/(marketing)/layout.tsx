import { Footer } from "@/components/footer";
import { Header } from "@/components/header"; 
import React from 'react'


export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-[radial-gradient(20%_80%_at_20%_0%,--theme(--color-primary/.2),transparent)]">
       <Header />
     {/* <Navbar /> */}
        {children}
        <div>
			<Footer />
		</div>
    </div> 
  )
}