"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookOpen, Users, Home, Menu, X, LogOut, Cuboid, LayoutDashboard, User, FileText, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VersionManager } from "@/components/version-manager"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import { deleteCookie, getCookie } from "@/actions/cookies-actions"
import { Separator } from "@/components/ui/separator"

interface DashboardLayoutProps {
  children: React.ReactNode
  initUserData: UserData
}

export interface UserData {
  id: number
  firstName: string
  lastName: string
  avatarUrl: string
  role: string
  hashedRefreshToken: string
}

export default function DashboardLayout({ children, initUserData }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(initUserData)
  const [napneOpen, setNapneOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = () => {
    deleteCookie("jwt");
    router.push("/");
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Disciplinas", href: "/dashboard/disciplines", icon: BookOpen },
    { name: "Professores", href: "/dashboard/educators", icon: Users },
    { name: "Blocos", href: "/dashboard/blocks", icon: Cuboid },
    { name: "Salas", href: "/dashboard/classrooms", icon: Home },
    { name: "Horários", href: "/dashboard/timetable", icon: BookOpen },
  ]

  const napneNavigation = [
    { name: "Dashboard", href: "/napne/dashboard", icon: LayoutDashboard },
    { name: "Ajudantes", href: "/napne/helpers", icon: Users },
    { name: "Estudantes", href: "/napne/students", icon: User },
    { name: "Solicitações", href: "/napne/requests", icon: FileText },
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
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 1509.000000 1172.000000"
              preserveAspectRatio="xMidYMid meet"
              className="fill-green-700 dark:fill-green-400"
            >
              <g
                transform="translate(0.000000,1172.000000) scale(0.100000,-0.100000)"
                stroke="none"
              >
                <path d="M8469 11710 c-381 -24 -797 -113 -1109 -238 -412 -165 -748 -353 -1010 -566 -88 -71 -519 -490 -603 -585 -107 -123 -295 -399 -437 -646 -256 -444 -453 -1087 -501 -1640 -15 -174 -6 -640 16 -844 34 -316 125 -671 259 -1008 l44 -113 -42 0 c-22 0 -97 7 -166 14 -421 49 -862 21 -1254 -78 -524 -134 -985 -378 -1678 -890 -216 -160 -239 -176 -247 -175 -3 0 -27 27 -54 59 l-47 59 -163 -96 c-224 -133 -324 -199 -525 -346 -95 -69 -211 -150 -258 -179 -218 -135 -333 -217 -507 -362 -103 -86 -187 -159 -187 -164 0 -21 83 -320 110 -397 69 -195 128 -308 335 -644 74 -121 192 -321 261 -443 303 -534 738 -1290 852 -1478 176 -292 335 -522 549 -792 l125 -157 59 37 c33 20 140 95 238 167 98 72 278 193 400 270 577 364 673 434 797 587 32 40 75 90 95 110 35 36 40 38 100 38 169 0 485 -55 802 -140 283 -76 480 -138 959 -301 244 -84 526 -179 628 -211 1095 -351 1685 -372 2382 -87 153 63 514 247 713 364 83 48 290 176 460 283 171 108 492 307 715 442 401 244 1564 968 1670 1040 31 21 186 119 345 217 525 325 2069 1315 2124 1361 142 120 259 328 308 547 10 45 16 117 16 205 -1 154 -24 265 -87 410 -45 104 -149 261 -220 332 -117 117 -317 229 -491 274 -83 22 -130 27 -272 31 -272 8 -435 -27 -697 -152 -198 -93 -808 -410 -1066 -553 -301 -166 -313 -173 -315 -170 -1 2 -12 18 -24 35 -13 19 -19 38 -15 45 4 7 46 67 92 133 322 459 552 999 661 1550 105 529 103 1050 -4 1590 -105 528 -308 1019 -612 1485 -141 215 -226 320 -380 470 -76 74 -201 198 -278 276 -159 161 -273 254 -495 400 -516 339 -1069 544 -1665 614 -121 15 -538 20 -706 10z m651 -605 c536 -68 1064 -273 1495 -579 208 -147 487 -404 646 -596 449 -540 712 -1140 806 -1840 25 -189 25 -697 0 -885 -67 -495 -194 -866 -453 -1316 -112 -196 -158 -258 -359 -487 -221 -252 -394 -404 -672 -590 -100 -67 -236 -142 -257 -142 -9 0 -16 18 -21 48 -10 70 -61 218 -101 292 -104 190 -289 366 -495 470 -167 85 -409 149 -635 171 -66 6 -137 14 -160 17 l-41 7 119 585 c66 322 123 588 127 593 17 18 338 -211 1006 -717 247 -188 458 -348 470 -356 26 -18 30 -24 -342 452 -433 554 -601 781 -728 984 -30 48 -55 92 -55 99 0 7 54 17 153 29 724 83 1707 261 1707 309 0 40 -22 46 -330 96 -468 76 -620 99 -815 121 -528 60 -715 94 -715 130 0 60 583 833 919 1220 181 207 284 340 266 340 -8 0 -133 -93 -270 -200 -60 -47 -305 -234 -543 -414 -612 -464 -711 -530 -732 -495 -27 42 -82 337 -204 1086 -85 522 -135 764 -166 813 -7 11 -11 9 -19 -12 -37 -97 -66 -237 -132 -633 -27 -165 -65 -385 -84 -490 -46 -254 -81 -492 -97 -649 -7 -80 -17 -130 -24 -133 -18 -7 -108 39 -196 99 -43 29 -241 179 -440 333 -555 429 -902 687 -906 675 -6 -17 43 -85 121 -169 40 -42 139 -164 222 -271 82 -107 262 -339 400 -515 340 -433 448 -577 438 -585 -15 -14 -395 -80 -748 -129 -192 -28 -433 -63 -535 -80 -102 -16 -237 -35 -300 -41 -134 -13 -221 -33 -266 -60 -43 -27 -50 -48 -20 -60 97 -36 1029 -196 1581 -270 271 -36 275 -37 275 -59 0 -37 -81 -181 -155 -276 -43 -55 -184 -239 -314 -410 -316 -417 -410 -534 -512 -637 -48 -47 -91 -100 -97 -117 -6 -17 -9 -31 -6 -31 7 0 254 177 877 630 554 403 579 421 583 418 4 -5 214 -1172 214 -1192 0 -17 -35 -18 -682 -13 -541 3 -715 8 -838 21 -169 18 -387 48 -520 72 -118 21 -649 142 -683 156 -23 9 -42 39 -102 161 -265 533 -385 1031 -385 1592 0 310 28 544 100 840 122 501 356 978 676 1380 108 135 386 415 514 517 497 395 1085 636 1695 697 61 6 126 13 145 15 78 9 483 -4 600 -19z m-269 -2935 c76 -15 170 -61 225 -112 173 -158 219 -442 107 -662 -37 -72 -129 -161 -206 -197 -202 -94 -402 -67 -578 77 -117 95 -173 203 -185 358 -19 225 113 423 334 503 110 40 209 51 303 33z m-4016 -2670 c303 -28 654 -92 1121 -204 345 -83 524 -119 749 -150 370 -52 510 -58 1430 -66 895 -8 914 -9 1108 -54 278 -65 444 -212 487 -434 25 -127 -5 -237 -85 -310 -84 -78 -205 -119 -387 -130 -62 -4 -408 -4 -768 -1 -992 11 -2876 10 -3134 -1 -252 -10 -306 -21 -373 -70 -49 -36 -93 -117 -93 -172 0 -87 66 -174 160 -209 l55 -21 2695 2 c1736 1 2711 5 2740 11 25 5 117 50 205 98 88 49 306 170 485 269 179 99 440 243 580 319 140 77 320 176 400 221 693 385 1361 726 1505 768 115 34 286 39 380 10 140 -42 263 -142 319 -259 81 -172 43 -376 -92 -497 -104 -93 -421 -301 -1077 -705 -198 -122 -630 -393 -960 -602 -688 -436 -668 -423 -1765 -1095 -454 -278 -931 -572 -1060 -655 -420 -267 -663 -404 -892 -502 -348 -149 -625 -211 -888 -197 -396 20 -764 113 -1645 411 -750 255 -910 304 -1210 379 -399 99 -653 135 -1024 145 l-243 6 -82 135 c-46 74 -177 288 -293 475 -442 715 -959 1592 -1097 1858 l-61 119 50 45 c164 146 755 556 1000 694 355 198 712 318 1089 363 134 17 519 20 671 6z m-3272 -1484 c199 -382 405 -736 881 -1511 388 -633 707 -1167 703 -1179 -5 -16 -302 -213 -542 -359 -115 -70 -219 -134 -230 -142 -19 -13 -23 -9 -67 48 -76 101 -500 810 -793 1327 -241 425 -480 838 -580 1000 -177 290 -244 412 -260 482 -6 24 -1 31 54 71 33 25 113 78 177 119 64 40 209 139 322 221 114 81 209 147 213 147 3 0 58 -101 122 -224z" />
                <path d="M8645 10973 c-146 -76 -166 -249 -44 -376 l48 -50 65 5 c75 6 135 37 185 93 30 35 31 38 31 134 l0 99 -49 36 c-99 73 -175 92 -236 59z" />
                <path d="M11630 7861 c-82 -25 -170 -111 -188 -184 -28 -111 48 -189 219 -222 116 -22 134 -10 171 109 60 196 -41 346 -202 297z" />
                <path d="M5767 7841 c-67 -22 -93 -42 -112 -88 -51 -121 -5 -264 98 -302 89 -34 217 7 262 83 35 60 35 143 -1 215 -48 96 -136 128 -247 92z" />
                <path d="M8659 7947 c-86 -30 -141 -68 -179 -125 -40 -60 -53 -114 -47 -187 8 -111 74 -205 175 -252 103 -48 279 -17 365 65 114 107 107 307 -15 432 -80 83 -187 107 -299 67z" />
                <path d="M6773 2699 c-260 -10 -320 -26 -375 -101 -68 -91 -62 -214 14 -285 86 -81 198 -87 1353 -79 1002 7 1384 17 1460 40 153 47 196 264 70 360 -40 31 -72 44 -140 58 -59 11 -2102 18 -2382 7z" />
                <path d="M2425 1866 c-173 -55 -266 -197 -236 -361 25 -134 109 -244 218 -285 77 -29 196 -25 263 9 133 68 201 208 178 371 -15 114 -75 202 -170 249 -53 27 -72 31 -137 30 -42 0 -94 -6 -116 -13z" />
              </g>
            </svg>
              <span className="ml-2 text-xl font-semibold text-green-700 dark:text-green-500">ADMIN</span>
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
              <Separator className="my-4 bg-green-100 dark:bg-green-900" />
              <button
                type="button"
                className={cn(
                  "flex w-full items-center rounded-md px-2 py-2 text-base font-semibold tracking-wide transition-colors uppercase",
                  napneOpen ? "bg-accent text-accent-foreground" : "text-green-700 dark:text-green-400 hover:bg-accent/50 hover:text-accent-foreground"
                )}
                onClick={() => setNapneOpen((open) => !open)}
              >
                <Users className="mr-4 h-6 w-6 flex-shrink-0" />
                NAPNE
                <ChevronDown className={cn("ml-auto transition-transform", napneOpen && "rotate-180")}/>
              </button>
              {napneOpen && (
                <div className="ml-8 flex flex-col gap-1 mt-1">
                  {napneNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        pathname === item.href
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400"
                          : "text-muted-foreground hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-700 dark:hover:text-green-400",
                        "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-4 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
              <Separator className="my-4 bg-green-100 dark:bg-green-900" />
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
          <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 1509.000000 1172.000000"
              preserveAspectRatio="xMidYMid meet"
              className="fill-green-700 dark:fill-green-500"
            >
              <g
                transform="translate(0.000000,1172.000000) scale(0.100000,-0.100000)"
                stroke="none"
              >
                <path d="M8469 11710 c-381 -24 -797 -113 -1109 -238 -412 -165 -748 -353 -1010 -566 -88 -71 -519 -490 -603 -585 -107 -123 -295 -399 -437 -646 -256 -444 -453 -1087 -501 -1640 -15 -174 -6 -640 16 -844 34 -316 125 -671 259 -1008 l44 -113 -42 0 c-22 0 -97 7 -166 14 -421 49 -862 21 -1254 -78 -524 -134 -985 -378 -1678 -890 -216 -160 -239 -176 -247 -175 -3 0 -27 27 -54 59 l-47 59 -163 -96 c-224 -133 -324 -199 -525 -346 -95 -69 -211 -150 -258 -179 -218 -135 -333 -217 -507 -362 -103 -86 -187 -159 -187 -164 0 -21 83 -320 110 -397 69 -195 128 -308 335 -644 74 -121 192 -321 261 -443 303 -534 738 -1290 852 -1478 176 -292 335 -522 549 -792 l125 -157 59 37 c33 20 140 95 238 167 98 72 278 193 400 270 577 364 673 434 797 587 32 40 75 90 95 110 35 36 40 38 100 38 169 0 485 -55 802 -140 283 -76 480 -138 959 -301 244 -84 526 -179 628 -211 1095 -351 1685 -372 2382 -87 153 63 514 247 713 364 83 48 290 176 460 283 171 108 492 307 715 442 401 244 1564 968 1670 1040 31 21 186 119 345 217 525 325 2069 1315 2124 1361 142 120 259 328 308 547 10 45 16 117 16 205 -1 154 -24 265 -87 410 -45 104 -149 261 -220 332 -117 117 -317 229 -491 274 -83 22 -130 27 -272 31 -272 8 -435 -27 -697 -152 -198 -93 -808 -410 -1066 -553 -301 -166 -313 -173 -315 -170 -1 2 -12 18 -24 35 -13 19 -19 38 -15 45 4 7 46 67 92 133 322 459 552 999 661 1550 105 529 103 1050 -4 1590 -105 528 -308 1019 -612 1485 -141 215 -226 320 -380 470 -76 74 -201 198 -278 276 -159 161 -273 254 -495 400 -516 339 -1069 544 -1665 614 -121 15 -538 20 -706 10z m651 -605 c536 -68 1064 -273 1495 -579 208 -147 487 -404 646 -596 449 -540 712 -1140 806 -1840 25 -189 25 -697 0 -885 -67 -495 -194 -866 -453 -1316 -112 -196 -158 -258 -359 -487 -221 -252 -394 -404 -672 -590 -100 -67 -236 -142 -257 -142 -9 0 -16 18 -21 48 -10 70 -61 218 -101 292 -104 190 -289 366 -495 470 -167 85 -409 149 -635 171 -66 6 -137 14 -160 17 l-41 7 119 585 c66 322 123 588 127 593 17 18 338 -211 1006 -717 247 -188 458 -348 470 -356 26 -18 30 -24 -342 452 -433 554 -601 781 -728 984 -30 48 -55 92 -55 99 0 7 54 17 153 29 724 83 1707 261 1707 309 0 40 -22 46 -330 96 -468 76 -620 99 -815 121 -528 60 -715 94 -715 130 0 60 583 833 919 1220 181 207 284 340 266 340 -8 0 -133 -93 -270 -200 -60 -47 -305 -234 -543 -414 -612 -464 -711 -530 -732 -495 -27 42 -82 337 -204 1086 -85 522 -135 764 -166 813 -7 11 -11 9 -19 -12 -37 -97 -66 -237 -132 -633 -27 -165 -65 -385 -84 -490 -46 -254 -81 -492 -97 -649 -7 -80 -17 -130 -24 -133 -18 -7 -108 39 -196 99 -43 29 -241 179 -440 333 -555 429 -902 687 -906 675 -6 -17 43 -85 121 -169 40 -42 139 -164 222 -271 82 -107 262 -339 400 -515 340 -433 448 -577 438 -585 -15 -14 -395 -80 -748 -129 -192 -28 -433 -63 -535 -80 -102 -16 -237 -35 -300 -41 -134 -13 -221 -33 -266 -60 -43 -27 -50 -48 -20 -60 97 -36 1029 -196 1581 -270 271 -36 275 -37 275 -59 0 -37 -81 -181 -155 -276 -43 -55 -184 -239 -314 -410 -316 -417 -410 -534 -512 -637 -48 -47 -91 -100 -97 -117 -6 -17 -9 -31 -6 -31 7 0 254 177 877 630 554 403 579 421 583 418 4 -5 214 -1172 214 -1192 0 -17 -35 -18 -682 -13 -541 3 -715 8 -838 21 -169 18 -387 48 -520 72 -118 21 -649 142 -683 156 -23 9 -42 39 -102 161 -265 533 -385 1031 -385 1592 0 310 28 544 100 840 122 501 356 978 676 1380 108 135 386 415 514 517 497 395 1085 636 1695 697 61 6 126 13 145 15 78 9 483 -4 600 -19z m-269 -2935 c76 -15 170 -61 225 -112 173 -158 219 -442 107 -662 -37 -72 -129 -161 -206 -197 -202 -94 -402 -67 -578 77 -117 95 -173 203 -185 358 -19 225 113 423 334 503 110 40 209 51 303 33z m-4016 -2670 c303 -28 654 -92 1121 -204 345 -83 524 -119 749 -150 370 -52 510 -58 1430 -66 895 -8 914 -9 1108 -54 278 -65 444 -212 487 -434 25 -127 -5 -237 -85 -310 -84 -78 -205 -119 -387 -130 -62 -4 -408 -4 -768 -1 -992 11 -2876 10 -3134 -1 -252 -10 -306 -21 -373 -70 -49 -36 -93 -117 -93 -172 0 -87 66 -174 160 -209 l55 -21 2695 2 c1736 1 2711 5 2740 11 25 5 117 50 205 98 88 49 306 170 485 269 179 99 440 243 580 319 140 77 320 176 400 221 693 385 1361 726 1505 768 115 34 286 39 380 10 140 -42 263 -142 319 -259 81 -172 43 -376 -92 -497 -104 -93 -421 -301 -1077 -705 -198 -122 -630 -393 -960 -602 -688 -436 -668 -423 -1765 -1095 -454 -278 -931 -572 -1060 -655 -420 -267 -663 -404 -892 -502 -348 -149 -625 -211 -888 -197 -396 20 -764 113 -1645 411 -750 255 -910 304 -1210 379 -399 99 -653 135 -1024 145 l-243 6 -82 135 c-46 74 -177 288 -293 475 -442 715 -959 1592 -1097 1858 l-61 119 50 45 c164 146 755 556 1000 694 355 198 712 318 1089 363 134 17 519 20 671 6z m-3272 -1484 c199 -382 405 -736 881 -1511 388 -633 707 -1167 703 -1179 -5 -16 -302 -213 -542 -359 -115 -70 -219 -134 -230 -142 -19 -13 -23 -9 -67 48 -76 101 -500 810 -793 1327 -241 425 -480 838 -580 1000 -177 290 -244 412 -260 482 -6 24 -1 31 54 71 33 25 113 78 177 119 64 40 209 139 322 221 114 81 209 147 213 147 3 0 58 -101 122 -224z" />
                <path d="M8645 10973 c-146 -76 -166 -249 -44 -376 l48 -50 65 5 c75 6 135 37 185 93 30 35 31 38 31 134 l0 99 -49 36 c-99 73 -175 92 -236 59z" />
                <path d="M11630 7861 c-82 -25 -170 -111 -188 -184 -28 -111 48 -189 219 -222 116 -22 134 -10 171 109 60 196 -41 346 -202 297z" />
                <path d="M5767 7841 c-67 -22 -93 -42 -112 -88 -51 -121 -5 -264 98 -302 89 -34 217 7 262 83 35 60 35 143 -1 215 -48 96 -136 128 -247 92z" />
                <path d="M8659 7947 c-86 -30 -141 -68 -179 -125 -40 -60 -53 -114 -47 -187 8 -111 74 -205 175 -252 103 -48 279 -17 365 65 114 107 107 307 -15 432 -80 83 -187 107 -299 67z" />
                <path d="M6773 2699 c-260 -10 -320 -26 -375 -101 -68 -91 -62 -214 14 -285 86 -81 198 -87 1353 -79 1002 7 1384 17 1460 40 153 47 196 264 70 360 -40 31 -72 44 -140 58 -59 11 -2102 18 -2382 7z" />
                <path d="M2425 1866 c-173 -55 -266 -197 -236 -361 25 -134 109 -244 218 -285 77 -29 196 -25 263 9 133 68 201 208 178 371 -15 114 -75 202 -170 249 -53 27 -72 31 -137 30 -42 0 -94 -6 -116 -13z" />
              </g>
            </svg>
              <span className="ml-2 text-xl font-semibold text-green-700 dark:text-green-500">GUIA ADMIN</span>
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
              <Separator className="my-4 bg-green-100 dark:bg-green-900" />
              <button
                type="button"
                className={cn(
                  "flex w-full items-center rounded-md px-2 py-2 text-sm font-semibold tracking-wide transition-colors uppercase",
                  napneOpen ? "bg-accent text-accent-foreground" : "text-green-700 dark:text-green-400 hover:bg-accent/50 hover:text-accent-foreground"
                )}
                onClick={() => setNapneOpen((open) => !open)}
              >
                <Users className="mr-3 h-5 w-5 flex-shrink-0" />
                NAPNE
                <ChevronDown className={cn("ml-auto transition-transform", napneOpen && "rotate-180")}/>
              </button>
              {napneOpen && (
                <div className="ml-8 flex flex-col gap-1 mt-1">
                  {napneNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        pathname === item.href
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400"
                          : "text-muted-foreground hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-700 dark:hover:text-green-400",
                        "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
              <Separator className="my-4 bg-green-100 dark:bg-green-900" />
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
