"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookOpen, Users, Home, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VersionManager } from "@/components/version-manager"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import { deleteCookie, getCookie } from "@/actions/cookies-actions"

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface UserData {
  id: number
  firstName: string
  lastName: string
  avatarUrl: string
  role: string
  hashedRefreshToken: string
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = () => {
    deleteCookie("jwt");
    router.push("/");
  }

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jwtToken = await getCookie('jwt');
    
        if (!jwtToken) {
          console.error("JWT token not found in cookies.");
          return;
        }
    
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/user/verifyAdmin`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          credentials: "include",
        });
    
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data: UserData = await response.json();
        console.log(data)
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Disciplinas", href: "/dashboard/disciplines", icon: BookOpen },
    { name: "Professores", href: "/dashboard/educators", icon: Users },
    { name: "Salas", href: "/dashboard/classrooms", icon: Home },
    { name: "Horários", href: "/dashboard/timetable", icon: BookOpen },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-background border-r">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-semibold text-green-700 dark:text-green-500">Acadêmico</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                    "group flex items-center rounded-md px-2 py-2 text-base font-medium",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      pathname === item.href
                        ? "text-accent-foreground"
                        : "text-muted-foreground group-hover:text-accent-foreground",
                      "mr-4 h-6 w-6 flex-shrink-0",
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t p-4">
            <div className="mb-4">
              <VersionManager />
            </div>
            <button
              onClick={handleLogout}
              className="group flex w-full items-center rounded-md px-2 py-2 text-base font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            >
              <LogOut className="mr-4 h-6 w-6 text-muted-foreground group-hover:text-accent-foreground" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r">
          <div className="flex h-16 items-center border-b px-4">
            <Image src={"/light-logo.png"} alt="logo guia" width={128} height={32} />
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                  )}
                >
                  <item.icon
                    className={cn(
                      pathname === item.href
                        ? "text-accent-foreground"
                        : "text-muted-foreground group-hover:text-accent-foreground",
                      "mr-3 h-5 w-5 flex-shrink-0",
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t p-4">
            <div className="mb-4">
              <VersionManager />
            </div>
            <button
              onClick={handleLogout}
              className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            >
              <LogOut className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-accent-foreground" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b bg-background">
          <button
            type="button"
            className="border-r px-4 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir menu lateral</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-end px-4">
            <div className="ml-4 flex items-center gap-4">
              <ThemeToggle />
              <span className="text-sm font-medium">{`${userData?.firstName} ${userData?.lastName}`}</span>
            </div>
          </div>
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
