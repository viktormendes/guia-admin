import type { Metadata } from "next"
import DashboardClientPage from "./DashboardClientPage"
import { fetchAllDisciplines } from "@/actions/discipline-actions"
import { fetchTimetables } from "@/actions/timetable-actions"
import { fetchEducators } from "@/actions/educator-actions"

export const metadata: Metadata = {
  title: "Dashboard - Academic Management",
  description: "Academic Management System Dashboard",
}

// Forçar renderização dinâmica para evitar problemas de pré-renderização
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  try {
    const [disciplines, timetables, educators] = await Promise.all([
      fetchAllDisciplines(),
      fetchTimetables(),
      fetchEducators(),
    ])

    return (
      <DashboardClientPage
        initialDisciplines={disciplines}
        initialEducators={educators}
        initialTimetables={timetables}
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

