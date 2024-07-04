"use client"
import React, { useState } from 'react'
import Image from "next/image"
import Link from 'next/link'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className='flex flex-col'>
            <div className='mt-10 mb-20 w-full flex justify-center'>
                <Image src="/full-logo.png" alt="logo" width={300} height={300} />
            </div>
            <input className='login-input mb-7 w-[400px] h-[55px]' type="text" placeholder="Email Address" value={email} />
            <input className='login-input mb-7 w-[400px] h-[55px]' type="password" placeholder="Password" value={password} />
            <Link href="/job-list">
                <button className='signin-button mb-5 w-[400px] h-[55px]'>
                        Sign in with credentials
                </button>
            </Link>
            <h4 className='w-full flex justify-center underline font-medium mb-24 cursor-pointer'>Reset account</h4>
            <Link href="/sign-up">
                <button className="signup-btn w-[400px] h-[55px]">
                    Sign up now
                </button>
            </Link>
        </div>
    )
}

export default Login
