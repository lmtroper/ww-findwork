"use client"
import React, { useState } from 'react'
import Image from "next/image"
import Link from 'next/link'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className='flex flex-col'>
            <div className='mb-10 w-full flex justify-center'>
                <Image src="/full-logo.png" alt="logo" width={300} height={300} />
            </div>
            <Link href="/questionnaire1">
                <button className='signin-button mb-5 w-[400px] h-[55px]'>
                    Sign in with credentials
                </button>
            </Link>
        </div>
    )
}

export default Login
