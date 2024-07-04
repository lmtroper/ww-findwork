"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = ({ signup }) => {
    const pathname = usePathname();

  return (
    <div className='ml-10 mt-10 w-fit flex flex-col items-center'>
        <div className='logo'>
            <Link href="/">
                <img src="/logo.png" className='min-w-[80px] max-w-[80px] mx-[15px]'/>
            </Link>
        </div>
        <div className={`${ signup ? 'hidden' : 'flex' } w-full flex-col items-center mt-10 ${pathname !== '/job-list' ? 'active-tab': ''}`}>
            <img src="/questionnaire.png" className='min-w-[40px] max-w-[40px]' />
            <div className='items-center font-medium mt-2'>Questionnaire</div>
        </div>
        <div className={`${ signup ? 'hidden' : 'flex' } w-full flex-col items-center mt-10 ${pathname === '/job-list' ? 'active-tab': ''}`}>
            <img src="/results.png" className='min-w-[40px] max-w-[40px]' />
            <div className='items-center font-medium mt-2'>Results</div>
        </div>
    </div>
  )
}

export default Navbar
