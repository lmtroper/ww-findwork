import React from 'react'
import Link from 'next/link'
import { Bakbak_One } from "next/font/google";
const bakbakOne = Bakbak_One({ subsets: ["latin"], weight: "400" });


const page = () => {
  return (
    <div className='w-full absolute top-[150px] flex flex-col items-center justify-center'>
        <div>
            <Link href="/" className='flex mb-10 underline cursor-pointer font-medium text-[#063C5C]'>Go back to login</Link>
            <div className={`${bakbakOne.className} text-center font-bold text-3xl mb-8`}>Welcome to FindWork on WaterlooWorks!</div>
            <div className='mb-16 font-light text-sm'>To get started, create an account with your name and email. Once it is authenticated, we can get started.</div>
        </div>
        <div className='flex mb-5'>
            <input className="login-input mr-5 w-[300px]" type="text" placeholder="Enter your first name here" />
            <input className="login-input ml-5 w-[300px]" type="text" placeholder="Enter your last name here" />
        </div>
        <input className="login-input mb-5 w-[640px]" type="text" placeholder="Enter your email address here" />
        <input className="login-input mb-5 w-[640px]" type="password" placeholder="Password" />
        <input className="login-input mb-5 w-[640px]" type="password" placeholder="Confirm Password" />
        <Link href="questionnaire1">
            <button className='signin-button w-[640px]'>Sign up</button>
        </Link>
    </div>
  )
}

export default page
