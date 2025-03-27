"use client"

import { useState, useEffect } from "react"
import DashboardLayout, { UserData } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Home, Clock, AlertTriangle, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { IEducator } from "@/types/Educator"
import { ITimetable } from "@/types/Timetable"
import { IDiscipline } from "@/types/Discipline"


const initialClassrooms = [
  { id: 1, name: "Sala 101", building: "Bloco A", capacity: 40, type: "Classroom" },
  { id: 2, name: "Laboratório 01", building: "Bloco B", capacity: 30, type: "Laboratory" },
  { id: 3, name: "Sala 201", building: "Bloco A", capacity: 45, type: "Classroom" },
  { id: 4, name: "Auditório Principal", building: "Bloco C", capacity: 120, type: "Auditorium" },
]

interface IDashboardClientPageProps {
  initialEducators: IEducator[]
  initialTimetables: ITimetable[]
  initialDisciplines: IDiscipline[]
  initialUserData: UserData
}
export default function DashboardClientPage({ initialDisciplines, initialEducators, initialTimetables, initialUserData }: IDashboardClientPageProps) {
  const [disciplinesWithoutTimetables, setDisciplinesWithoutTimetables] = useState(0)
  const [disciplinesWithSinglePeriod, setDisciplinesWithSinglePeriod] = useState(0)
  const [disciplinesByPeriod, setDisciplinesByPeriod] = useState({
    morning: 0,
    afternoon: 0,
    evening: 0,
    multiple: 0,
  })
  const [timetableStats, setTimetableStats] = useState({
    withTimetables: 0,
    withoutTimetables: 0,
    percentage: 0,
  })

  useEffect(() => {
    // Calculate disciplines without timetables
    const withoutTimetables = initialDisciplines.filter((discipline) => {
      return !initialTimetables.some((t) => t.disciplineId === discipline.id)
    })

    const withTimetables = initialDisciplines.filter((discipline) => {
      return initialTimetables.some((t) => t.disciplineId === discipline.id)
    })

    setDisciplinesWithoutTimetables(withoutTimetables.length)

    // Calculate timetable statistics
    const percentage = Math.round((withTimetables.length / initialDisciplines.length) * 100)
    setTimetableStats({
      withTimetables: withTimetables.length,
      withoutTimetables: withoutTimetables.length,
      percentage,
    })

    // Calculate disciplines with timetables in only one period
    const periodMap = {
      "AB-M": "morning",
      "CD-M": "morning",
      "AB-T": "afternoon",
      "CD-T": "afternoon",
      "AB-N": "evening",
      "CD-N": "evening",
    }

    const disciplinesPeriods = new Map()

    // First, collect all periods for each discipline
    initialTimetables.forEach((timetable) => {
      const hours = timetable.hours.split(" ")
      const periods = new Set()

      hours.forEach((hour) => {
        periods.add(periodMap[hour])
      })

      if (!disciplinesPeriods.has(timetable.disciplineId)) {
        disciplinesPeriods.set(timetable.disciplineId, periods)
      } else {
        const existingPeriods = disciplinesPeriods.get(timetable.disciplineId)
        periods.forEach((period) => existingPeriods.add(period))
      }
    })

    // Count disciplines by period
    let morningOnly = 0
    let afternoonOnly = 0
    let eveningOnly = 0
    let multiplePeriods = 0

    disciplinesPeriods.forEach((periods) => {
      if (periods.size === 1) {
        if (periods.has("morning")) morningOnly++
        else if (periods.has("afternoon")) afternoonOnly++
        else if (periods.has("evening")) eveningOnly++
      } else {
        multiplePeriods++
      }
    })

    setDisciplinesWithSinglePeriod(morningOnly + afternoonOnly + eveningOnly)
    setDisciplinesByPeriod({
      morning: morningOnly,
      afternoon: afternoonOnly,
      evening: eveningOnly,
      multiple: multiplePeriods,
    })
  }, [])

  return (
    <DashboardLayout initUserData={initialUserData}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Disciplinas</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{initialDisciplines.length}</div>
              <p className="text-xs text-muted-foreground">Em todos os semestres</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Professores</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{initialEducators.length}</div>
              <p className="text-xs text-muted-foreground">Membros ativos do corpo docente</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Salas</CardTitle>
              <Home className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{initialClassrooms.length}</div>
              <p className="text-xs text-muted-foreground">Disponíveis para agendamento</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horários</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{initialTimetables.length}</div>
              <p className="text-xs text-muted-foreground">Horários de aula agendados</p>
            </CardContent>
          </Card>
        </div>

        {/* Timetable Statistics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cobertura de Horários</CardTitle>
              <AlertTriangle
                className={`h-4 w-4 ${timetableStats.percentage < 90 ? "text-amber-500" : "text-green-500"}`}
              />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <div className="text-2xl font-bold">{timetableStats.percentage}%</div>
                <div className="text-sm text-muted-foreground">
                  {timetableStats.withoutTimetables} disciplinas sem horários
                </div>
              </div>
              <Progress value={timetableStats.percentage} className="h-2 mb-4" />
              <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                <Link href="/dashboard/disciplines">Gerenciar Horários</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Distribuição por Período</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    <span className="text-sm">Apenas Manhã</span>
                  </div>
                  <span className="text-sm font-medium">{disciplinesByPeriod.morning} disciplinas</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-400"></div>
                    <span className="text-sm">Apenas Tarde</span>
                  </div>
                  <span className="text-sm font-medium">{disciplinesByPeriod.afternoon} disciplinas</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-300"></div>
                    <span className="text-sm">Apenas Noite</span>
                  </div>
                  <span className="text-sm font-medium">{disciplinesByPeriod.evening} disciplinas</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-blue-400"></div>
                    <span className="text-sm">Múltiplos Períodos</span>
                  </div>
                  <span className="text-sm font-medium">{disciplinesByPeriod.multiple} disciplinas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Nova disciplina adicionada: CÁLCULO 0</p>
                    <p className="text-sm text-muted-foreground">2 horas atrás</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Professor atualizado: MANUEL RICARDO DOS SANTOS RABELO
                    </p>
                    <p className="text-sm text-muted-foreground">5 horas atrás</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Novo horário adicionado para CÁLCULO I</p>
                    <p className="text-sm text-muted-foreground">Ontem</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Visão Geral do Semestre</CardTitle>
              <CardDescription>Distribuição de disciplinas por semestre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    <span className="text-sm">Semestre 1</span>
                  </div>
                  <span className="text-sm font-medium">
                    {initialDisciplines.filter((d) => d.semester === 1).length} disciplinas
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-400"></div>
                    <span className="text-sm">Semestre 2</span>
                  </div>
                  <span className="text-sm font-medium">
                    {initialDisciplines.filter((d) => d.semester === 2).length} disciplinas
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-300"></div>
                    <span className="text-sm">Semestre 3</span>
                  </div>
                  <span className="text-sm font-medium">
                    {initialDisciplines.filter((d) => d.semester === 3).length} disciplinas
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-200"></div>
                    <span className="text-sm">Semestre 4+</span>
                  </div>
                  <span className="text-sm font-medium">
                    {initialDisciplines.filter((d) => d.semester >= 4).length} disciplinas
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

