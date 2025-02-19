"use client"
import { useAuthContext } from '@/app/provider'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Image from 'next/image'
import React from 'react'

function AppHeader() {
    const {user}=useAuthContext();
  return (
    <div className='p-3 flex justify-between items-center'>
        <SidebarTrigger/>
        {user?.pictureURL&&<Image src={user?.pictureURL} height={40} width={40} alt='user' className='rounded-full'/>}
    </div>
  )
}

export default AppHeader