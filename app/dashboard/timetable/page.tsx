import DisciplinesContent from "@/components/discipline-content"
import { fetchAllDisciplines } from "@/actions/discipline-actions"
import TimetableContent from "@/components/timetable-content"
import { fetchTimetables } from "@/actions/timetable-actions"
import { fetchPrerequisites } from "@/actions/prerequisite-actions"
import { fetchEducators } from "@/actions/educator-actions"

export default async function TimetablePage() {
  const disciplines = await fetchAllDisciplines()
  const prerequisites = await fetchPrerequisites()
  const timetables = await fetchTimetables()
  const educators = await fetchEducators()

  return (
    <TimetableContent initialDisciplines={disciplines} initialTimetables={timetables}/>
  )
}

