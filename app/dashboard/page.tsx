import type { Metadata } from "next"
import DashboardClientPage from "./DashboardClientPage"
import { fetchAllDisciplines, fetchUserData } from "@/actions/discipline-actions"
import { fetchTimetables } from "@/actions/timetable-actions"
import { fetchEducators } from "@/actions/educator-actions"
import { fetchClassrooms } from "@/actions/rooms-actions"

export const metadata: Metadata = {
  title: "Dashboard - Academic Management",
  description: "Academic Management System Dashboard",
}

// Forçar renderização dinâmica para evitar problemas de pré-renderização
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  try {
    const [disciplines, timetables, educators, userData, classrooms] = await Promise.all([
      fetchAllDisciplines(),
      fetchTimetables(),
      fetchEducators(),
      fetchUserData(),
      fetchClassrooms() 
    ])
    return (
      <DashboardClientPage
        initialDisciplines={disciplines}
        initialEducators={educators}
        initialTimetables={timetables}
        initialUserData={userData}
        initialClassrooms={classrooms}
      />
    )
  } catch (error) {
    console.error("Error loading dashboard page:", error)
    // Renderizar um estado de fallback em caso de erro
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Erro ao carregar dados</h2>
          <p className="text-muted-foreground">Tente novamente mais tarde</p>
        </div>
      </div>
    )
  }
}

