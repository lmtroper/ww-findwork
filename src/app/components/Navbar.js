"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
    const pathname = usePathname();

  return (
    <div className={`${pathname === '/' ? 'hidden' : 'flex'} ml-10 mt-10 w-fit flex-col items-center`}>
        <div className='logo'>
            <Link href="/">
                <img src="/logo.png" className='min-w-[80px] max-w-[80px] mx-[15px]'/>
            </Link>
        </div>
        <div className={`w-full mt-10 ${pathname !== '/joblist' ? 'active-tab': ''} p-[10px]`}>
            <Link href='/questionnaire1' className='flex flex-col  items-center w-full h-full cursor-pointer'>
                <img src="/questionnaire.png" className='min-w-[40px] max-w-[40px]' />
                <div className='items-center font-medium mt-2'>Questionnaire</div>
            </Link>
        </div>
        <div className={`w-full mt-10 ${pathname === '/joblist' ? 'active-tab': ''} p-[10px]`}>
            <Link href='/joblist' className='flex flex-col items-center cursor-pointer'>
                <img src="/results.png" className='min-w-[40px] max-w-[40px]' />
                <div className='items-center font-medium mt-2'>Results</div>
            </Link>
        </div>
    </div>
  )
}

export default Navbar
