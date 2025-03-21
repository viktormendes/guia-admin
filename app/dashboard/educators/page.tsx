import DisciplinesContent from "@/components/discipline-content"
import { fetchAllDisciplines, fetchEducators, fetchPrerequisites, fetchTimetables } from "@/actions/discipline-actions"
import EducatorsContent from "@/components/educator-content"

export default async function DisciplinePage() {
  const disciplines = await fetchAllDisciplines()
  const prerequisites = await fetchPrerequisites()
  const timetables = await fetchTimetables()
  const educators = await fetchEducators()

  return (
    <EducatorsContent initialEducators={educators}/>
  )
}

