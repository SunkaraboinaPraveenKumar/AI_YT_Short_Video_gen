"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import Authentication from './Authentication'
import { useAuthContext } from '../provider';
import Link from 'next/link';

function Hero() {
  const { user } = useAuthContext();
  return (
    <div className='p-10 flex flex-col items-center justify-center mt-24 md:px-20 lg:px-36 xl:px-46'>
      <h2 className='font-bold text-6xl text-center'>AI Youtube Short Video Generator</h2>
      <p className='mt-4 text-2xl text-center text-gray-500'>🤖 AI generates scripts, images, and voiceovers in seconds. ⚡Creaate and Publish engaging shorts with ease!!</p>
      <div className='mt-7 gap-8 flex'>
        <Button variant='secondary' size="lg">Explore</Button>
        {!user ?
          <Authentication>
            <Button size="lg">Get Started</Button>
          </Authentication>
          :
          <Link href={'/dashboard'}>
            <Button size="lg">Get Started</Button>
          </Link>
        }
      </div>
    </div>
  )
}

export default Hero