"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Gem, HomeIcon, LucideFileVideo, Search, WalletCards } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuthContext } from "@/app/provider"

const MenuItems = [
    { title: 'Home', url: '/dashboard', icon: HomeIcon },
    { title: 'Create New', url: '/create-new-video', icon: LucideFileVideo },
    { title: 'Explore', url: '/explore', icon: Search },
    { title: 'Billing', url: '/billing', icon: WalletCards },
]

function AppSidebar() {
    const path = usePathname();
    const { user } = useAuthContext();
    return (
        <Sidebar>
            <SidebarHeader>
                <div>
                    <div className="flex items-center gap-3 w-full justify-center mt-5">
                        <Image src="/logo.png" width={40} height={40} alt="logo" />
                        <h2 className="font-bold text-2xl">Video Gen</h2>
                    </div>
                    <h2 className="text-lg text-gray-400 text-center mt-3">
                        AI Short Video Generator
                    </h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <div className="mx-3 mt-3">
                            <Link href={'/create-new-video'}>
                                <Button className="w-full">+ Create New Video</Button>
                            </Link>
                        </div>
                        <SidebarMenu>
                            {MenuItems.map((menu, index) => (
                                <SidebarMenuItem key={index} className="mt-3 mx-3">
                                    <SidebarMenuButton isActive={path == menu.url}>
                                        <Link href={menu?.url} className="flex items-center gap-4 p-5">
                                            <menu.icon />
                                            <span>{menu?.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="p-5 border rounded-lg mb-6 bg-gray-800">
                    <div className="flex justify-between">
                        <Gem />
                        <h2>{user?.credits} Credits Left</h2>
                    </div>
                    <Link href={'/billing'}>
                        <Button className='w-full mt-3'>Buy More Credits</Button>
                    </Link>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar;