import type { Metadata } from "next"
import DashboardClientPage from "./DashboardClientPage"
import { fetchAllDisciplines } from "@/actions/discipline-actions"
import { fetchTimetables } from "@/actions/timetable-actions"
import { fetchEducators } from "@/actions/educator-actions"

export const metadata: Metadata = {
  title: "Dashboard - Academic Management",
  description: "Academic Management System Dashboard",
}

export default async function DashboardPage() {
    const disciplines = await fetchAllDisciplines()
    const timetables = await fetchTimetables()
    const educators = await fetchEducators()
  return <DashboardClientPage initialDisciplines={disciplines} initialEducators={educators} initialTimetables={timetables}/>
}

