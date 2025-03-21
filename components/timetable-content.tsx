"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { IDiscipline } from "@/types/Discipline"
import { ITimetable } from "@/types/Timetable"

// Define time slots
const timeSlots = [
  { id: "AB-M", label: "8:00 - 10:00", period: "morning" },
  { id: "CD-M", label: "10:00 - 12:00", period: "morning" },
  { id: "AB-T", label: "13:00 - 15:00", period: "afternoon" },
  { id: "CD-T", label: "15:00 - 17:00", period: "afternoon" },
  { id: "AB-N", label: "18:00 - 20:00", period: "evening" },
  { id: "CD-N", label: "20:00 - 22:00", period: "evening" },
]

// Define days
const days = [
  { id: "SEG", label: "Segunda" },
  { id: "TER", label: "Terça" },
  { id: "QUA", label: "Quarta" },
  { id: "QUI", label: "Quinta" },
  { id: "SEX", label: "Sexta" },
]

interface ITimetablePageProps {
  initialDisciplines: IDiscipline[];
  initialTimetables: ITimetable[];
}
export default function TimetableContent({initialDisciplines, initialTimetables}: ITimetablePageProps) {
  const [selectedSemester, setSelectedSemester] = useState<string>("1")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all")

  // Filter disciplines by selected semester
  const filteredDisciplines = useMemo(() => {
    return initialDisciplines.filter((d) => d.semester.toString() === selectedSemester)
  }, [selectedSemester])

  // Get all timetables for the filtered disciplines
  const semesterTimetables = useMemo(() => {
    const disciplineIds = filteredDisciplines.map((d) => d.id)
    return initialTimetables.filter((t) => disciplineIds.includes(t.disciplineId))
  }, [filteredDisciplines])

  // Filter time slots by selected period
  const filteredTimeSlots = useMemo(() => {
    if (selectedPeriod === "all") return timeSlots
    return timeSlots.filter((slot) => slot.period === selectedPeriod)
  }, [selectedPeriod])

  // Generate timetable grid data
  const timetableGrid = useMemo(() => {
    const grid: Record<string, Record<string, any[]>> = {}

    // Initialize grid
    filteredTimeSlots.forEach((timeSlot) => {
      grid[timeSlot.id] = {}
      days.forEach((day) => {
        grid[timeSlot.id][day.id] = []
      })
    })

    // Fill grid with disciplines
    semesterTimetables.forEach((timetable) => {
      const discipline = initialDisciplines.find((d) => d.id === timetable.disciplineId)
      if (!discipline) return

      const timetableDays = timetable.days.split(" ")
      const timetableHours = timetable.hours.split(" ")

      timetableDays.forEach((day, index) => {
        const hour = timetableHours[index] || timetableHours[0]
        if (grid[hour] && grid[hour][day]) {
          grid[hour][day].push(discipline)
        }
      })
    })

    return grid
  }, [filteredTimeSlots, semesterTimetables])

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Horários</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-48">
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o semestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Semestre 1</SelectItem>
                <SelectItem value="2">Semestre 2</SelectItem>
                <SelectItem value="3">Semestre 3</SelectItem>
                <SelectItem value="4">Semestre 4</SelectItem>
                <SelectItem value="5">Semestre 5</SelectItem>
                <SelectItem value="6">Semestre 6</SelectItem>
                <SelectItem value="7">Semestre 7</SelectItem>
                <SelectItem value="8">Semestre 8</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="all" value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="morning">Manhã</TabsTrigger>
              <TabsTrigger value="afternoon">Tarde</TabsTrigger>
              <TabsTrigger value="evening">Noite</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Horários do Semestre {selectedSemester}</CardTitle>
            <CardDescription>Visualize todas as aulas agendadas para o semestre {selectedSemester}</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[800px]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-2 text-left font-medium">Horário</th>
                      {days.map((day) => (
                        <th key={day.id} className="p-2 text-left font-medium">
                          {day.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTimeSlots.map((timeSlot) => (
                      <tr key={timeSlot.id} className="border-t">
                        <td className="p-2 align-top">
                          <div className="font-medium">{timeSlot.label}</div>
                          <div className="text-xs text-muted-foreground">{timeSlot.id}</div>
                        </td>
                        {days.map((day) => (
                          <td key={day.id} className="p-2 align-top">
                            <div className="min-h-[60px]">
                              {timetableGrid[timeSlot.id][day.id].length > 0 ? (
                                <div className="space-y-2">
                                  {timetableGrid[timeSlot.id][day.id].map((discipline) => (
                                    <div
                                      key={discipline.id}
                                      className={cn("p-2 rounded-md text-sm", "bg-green-50 border border-green-200")}
                                    >
                                      <div className="font-medium">{discipline.name}</div>
                                      <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-muted-foreground">{discipline.code}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {discipline.workload}h
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disciplinas do Semestre {selectedSemester}</CardTitle>
            <CardDescription>Lista de todas as disciplinas no semestre {selectedSemester}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDisciplines.map((discipline) => {
                const disciplineTimetables = initialTimetables.filter((t) => t.disciplineId === discipline.id)
                return (
                  <Card key={discipline.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2 bg-muted/30">
                      <CardTitle className="text-base">{discipline.name}</CardTitle>
                      <CardDescription>
                        {discipline.code} - {discipline.workload}h
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Horários:</div>
                        {disciplineTimetables.length > 0 ? (
                          <ul className="text-sm space-y-1">
                            {disciplineTimetables.map((timetable, index) => {
                              const timetableDays = timetable.days.split(" ")
                              const timetableHours = timetable.hours.split(" ")

                              return (
                                <li key={index} className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {timetableDays
                                      .map((day, i) => {
                                        const dayLabel = days.find((d) => d.id === day)?.label
                                        const hourId = timetableHours[i] || timetableHours[0]
                                        const hourLabel = timeSlots.find((t) => t.id === hourId)?.label
                                        return `${dayLabel} ${hourLabel}`
                                      })
                                      .join(", ")}
                                  </Badge>
                                </li>
                              )
                            })}
                          </ul>
                        ) : (
                          <div className="text-sm text-muted-foreground">Nenhum horário atribuído</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

