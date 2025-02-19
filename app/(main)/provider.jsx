"use client"
import { SidebarProvider } from '@/components/ui/sidebar'
import React, { useEffect } from 'react'
import { useAuthContext } from '../provider'
import { useRouter } from 'next/navigation'
import AppSidebar from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'

function DashboardProvider({ children }) {
  const { user } = useAuthContext();
  useEffect(() => {
    CheckUserAuthenticated();
  }, [])
  const router = useRouter();
  const CheckUserAuthenticated = () => {
    if (!user) {
      router.replace('/')
    }
  }
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className='w-full'>
          <AppHeader />
          <div className='p-10'>
            {children}
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default DashboardProvider