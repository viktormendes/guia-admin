"use client"

import React from "react"
import DashboardLayout from "@/components/dashboard-layout"

export default function NapneLayout({ children }: { children: React.ReactNode }) {
  // Aqui você pode buscar o usuário autenticado ou passar um mock para initUserData
  // Exemplo de mock:
  const mockUserData = {
    id: 1,
    firstName: "Usuário",
    lastName: "NAPNE",
    avatarUrl: "/placeholder.svg",
    role: "admin",
    hashedRefreshToken: ""
  }
  return (
    <DashboardLayout initUserData={mockUserData}>
      {children}
    </DashboardLayout>
  )
} 