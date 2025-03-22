import DisciplinesContent from "@/components/discipline-content"
import { fetchAllDisciplines } from "@/actions/discipline-actions"
import { fetchPrerequisites } from "@/actions/prerequisite-actions"
import { fetchTimetables } from "@/actions/timetable-actions"
import { fetchEducators } from "@/actions/educator-actions"

// Forçar renderização dinâmica para evitar problemas de pré-renderização
export const dynamic = "force-dynamic"

export default async function DisciplinesPage() {
  try {
    const [disciplines, prerequisites, timetables, educators] = await Promise.all([
      fetchAllDisciplines(),
      fetchPrerequisites(),
      fetchTimetables(),
      fetchEducators(),
    ])

    return (
      <DisciplinesContent
        initialDisciplines={disciplines}
        initialPrerequisites={prerequisites}
        initialTimetables={timetables}
        initialEducators={educators}
      />
    )
  } catch (error) {
    console.error("Error loading disciplines page:", error)
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

