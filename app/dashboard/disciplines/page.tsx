import DisciplinesContent from "@/components/discipline-content"
import { fetchAllDisciplines } from "@/actions/discipline-actions"
import { fetchPrerequisites } from "@/actions/prerequisite-actions"
import { fetchTimetables } from "@/actions/timetable-actions"
import { fetchEducators } from "@/actions/educator-actions"

export default async function DisciplinePage() {
  const disciplines = await fetchAllDisciplines()
  const prerequisites = await fetchPrerequisites()
  const timetables = await fetchTimetables()
  const educators = await fetchEducators()

  return (
    <DisciplinesContent
      initialDisciplines={disciplines}
      initialPrerequisites={prerequisites}
      initialTimetables={timetables}
      initialEducators={educators}
    />
  )
}

