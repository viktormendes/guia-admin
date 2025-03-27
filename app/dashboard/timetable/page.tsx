import TimetableContent from "@/components/timetable-content"
import { fetchAllDisciplines, fetchUserData } from "@/actions/discipline-actions"
import { fetchTimetables } from "@/actions/timetable-actions"

// Forçar renderização dinâmica para evitar problemas de pré-renderização
export const dynamic = "force-dynamic"

export default async function TimetablePage() {
  try {
    const [disciplines, timetables, userData] = await Promise.all([
      fetchAllDisciplines(),
      fetchTimetables(),
      fetchUserData(),
    ])

    return <TimetableContent initialDisciplines={disciplines} initialTimetables={timetables} initialUserData={userData} />
  } catch (error) {
    console.error("Error loading timetable page:", error)
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

