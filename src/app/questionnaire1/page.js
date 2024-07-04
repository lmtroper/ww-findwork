"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Circle from '@/app/components/Circle'
import { Bakbak_One } from "next/font/google";
const bakbakOne = Bakbak_One({ subsets: ["latin"], weight: "400" });


const page = () => {
  const [username, setUsername] = useState('Sirisha')

  return (
    <div className='w-full absolute top-[200px] flex flex-col items-center justify-center px-10'>
    <div className='max-w-[800px]'>
        <div className='flex justify-end mb-16'>
            <Circle number={1} active={true} />
            <Circle number={2} active={false} />
            <Circle number={3} active={false} />
        </div>
        <div className={`${bakbakOne.className} font-bold text-3xl mb-8 text-center`}>Welcome to FindWork on WaterlooWorks, {username}!</div>
        <div className='mb-16 font-light text-sm text-center'>
          To get started upload your resume and continue to fill out the questionnaire
          so that we can filter through the jobs on WaterlooWorks and show you the ones most relevant to you. 
          Don’t worry you can come back later to change this.
        </div>
    </div>
    <button className='mb-5 resume-upload-btn w-[640px] flex justify-center items-center'>
      <Image src="/upload.png" alt="upload" width={25} height={25} />
      <div className='ml-2'>Click here to upload your resume</div>
    </button>
    <Link href="questionnaire2">
        <button className='signin-button w-[640px]'>Start questionnaire</button>
    </Link>
</div>
  )
}

export default page
