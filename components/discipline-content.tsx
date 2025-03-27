"use client"

import { useState, useEffect } from "react"
import DashboardLayout, { UserData } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Search, Filter, X, Check, Clock, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { IDiscipline } from "@/types/Discipline"
import {
  createDiscipline,
  deleteDiscipline,
  updateDiscipline,
} from "@/actions/discipline-actions"
import { toast } from "@/components/ui/use-toast"
import { disciplineSchema, timetableSchema } from "@/lib/schemas"
import type { DisciplineFormValues, TimetableFormValues } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createPrerequisite, deletePrerequisite } from "@/actions/prerequisite-actions"
import { createTimetable, deleteTimetable } from "@/actions/timetable-actions"
import { Room } from "@/app/dashboard/classrooms/types"

interface IDisciplineContentProps {
  initialDisciplines: IDiscipline[]
  initialPrerequisites: { id: number, disciplineId: number; prerequisiteId: number }[]
  initialTimetables: {
    id: number
    disciplineId: number
    days: string
    hours: string
    educator: { id: number; name: string; lattesLink: string }
  }[]
  initialEducators: { id: number; name: string; lattesLink: string }[]
  initialRooms: Room[]
  initialUserData: UserData
}

export default function DisciplinesContent({
  initialDisciplines,
  initialPrerequisites,
  initialTimetables,
  initialEducators,
  initialUserData,
  initialRooms,
}: IDisciplineContentProps) {
  const [disciplines, setDisciplines] = useState(initialDisciplines)
  const [prerequisites, setPrerequisites] = useState(initialPrerequisites)
  const [timetables, setTimetables] = useState(initialTimetables)
  const [educators, setEducators] = useState(initialEducators)
  const [rooms, setRooms] = useState<Room[]>(initialRooms || [])
  const [searchEducator, setSearchEducator] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSemester, setSelectedSemester] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isTimetableDialogOpen, setIsTimetableDialogOpen] = useState(false)
  const [currentDiscipline, setCurrentDiscipline] = useState<any>(null)
  const [selectedPrerequisites, setSelectedPrerequisites] = useState<number[]>([])
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [searchPrerequisite, setSearchPrerequisite] = useState("")
  const [currentTimetables, setCurrentTimetables] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedDisciplines, setPaginatedDisciplines] = useState<any[]>([])
  const [totalItems, setTotalItems] = useState(0)

  const filteredEducators = educators.filter((educator) =>
    educator.name.toLowerCase().includes(searchEducator.toLowerCase())
  );


  // Form para adicionar disciplina
  const addDisciplineForm = useForm<DisciplineFormValues>({
    resolver: zodResolver(disciplineSchema),
    defaultValues: {
      name: "",
      semester: 1,
      workload: 80,
      type: "OBG",
      code: "",
    },
  })

  // Form para editar disciplina
  const editDisciplineForm = useForm<DisciplineFormValues>({
    resolver: zodResolver(disciplineSchema),
    defaultValues: {
      name: "",
      semester: 1,
      workload: 80,
      type: "OBG",
      code: "",
    },
  })

  // Form para adicionar horário
  const addTimetableForm = useForm<TimetableFormValues>({
    resolver: zodResolver(timetableSchema),
    defaultValues: {
      disciplineId: 0,
      educatorId: 1,
      days: "SEG",
      hours: "AB-M",
      roomId: 1,
    },
  })

  // Move filteredDisciplines inside useEffect to prevent infinite loop
  useEffect(() => {
    // Calculate filtered disciplines here instead of outside the effect
    const filtered = disciplines.filter((discipline) => {
      const matchesSearch =
        discipline?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        discipline?.code?.toLowerCase()?.includes(searchTerm.toLowerCase())
      const matchesSemester = selectedSemester === "all" || discipline.semester.toString() === selectedSemester
      return matchesSearch && matchesSemester
    })

    // Set the total filtered items count
    setTotalItems(filtered.length)

    const total = Math.ceil(filtered.length / itemsPerPage)
    setTotalPages(total || 1)

    // Reset to first page when filters change
    if (currentPage > total) {
      setCurrentPage(1)
    }

    // Simulate backend pagination by slicing the array
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedDisciplines(filtered.slice(startIndex, endIndex))
  }, [disciplines, searchTerm, selectedSemester, currentPage, itemsPerPage])

  // Get prerequisites for a discipline
  const getDisciplinePrerequisites = (disciplineId: number) => {
    const prerequisiteIds = prerequisites?.filter((p) => p.disciplineId === disciplineId)?.map((p) => p.prerequisiteId) || []

    return disciplines.filter((d) => prerequisiteIds.includes(d.id))
  }

  // Get timetables for a discipline
  const getDisciplineTimetables = (disciplineId: number) => {
    return timetables.filter((t) => t.disciplineId === disciplineId)
  }

  // Filter disciplines for prerequisites selection (exclude current discipline and already selected prerequisites)
  const getFilteredPrerequisiteOptions = (disciplineId: number, currentPrereqs: number[]) => {
    return disciplines.filter((d) => {
      // Don't show the current discipline as a prerequisite option
      if (disciplineId && d.id === disciplineId) return false

      // Don't show already selected prerequisites
      if (currentPrereqs.includes(d.id)) return false

      // Filter by search term if provided
      if (searchPrerequisite && !d.name.toLowerCase().includes(searchPrerequisite.toLowerCase())) return false

      return true
    })
  }

  const handleAddDiscipline = async (data: DisciplineFormValues) => {
    setIsSubmitting(true)
    try {
      const newDisciplineData = await createDiscipline(data)

      if (newDisciplineData) {
        // Adicionar a nova disciplina ao estado local
        setDisciplines((prev) => [...prev, newDisciplineData])

        // Adicionar pré-requisitos se houver
        if (selectedPrerequisites.length > 0) {
          for (const prerequisiteId of selectedPrerequisites) {
            await createPrerequisite({
              disciplineId: newDisciplineData.id,
              prerequisiteId,
            })
          }

          // Atualizar o estado local dos pré-requisitos
          const newPrerequisites = selectedPrerequisites.map((prerequisiteId) => ({
            disciplineId: newDisciplineData.id,
            prerequisiteId,
          }))
          setPrerequisites([...prerequisites, ...newPrerequisites])
        }

        toast({
          title: "Sucesso",
          description: "Disciplina adicionada com sucesso",
        })
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a disciplina",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao adicionar disciplina:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a disciplina",
        variant: "destructive",
      })
    } finally {
      // Reset form
      addDisciplineForm.reset()
      setSelectedPrerequisites([])
      setIsAddDialogOpen(false)
      setIsSubmitting(false)
    }
  }

  const handleEditDiscipline = async (data: DisciplineFormValues) => {
    if (!currentDiscipline) return

    setIsSubmitting(true)
    try {
      const updatedDiscipline = await updateDiscipline(currentDiscipline.id, data)

      if (updatedDiscipline) {
        // Atualizar a disciplina no estado local
        setDisciplines(disciplines.map((d) => (d.id === currentDiscipline.id ? updatedDiscipline : d)))

        // Atualizar pré-requisitos
        // Primeiro, remover todos os pré-requisitos existentes para esta disciplina
        const currentPrereqs = prerequisites.filter((p) => p.disciplineId === currentDiscipline.id)

        // Remover pré-requisitos que não estão mais selecionados
        for (const prereq of currentPrereqs) {
          if (!selectedPrerequisites.includes(prereq.prerequisiteId)) {
            await deletePrerequisite(prereq.id)
          }
        }

        // Adicionar novos pré-requisitos
        for (const prerequisiteId of selectedPrerequisites) {
          if (!currentPrereqs.some((p) => p.prerequisiteId === prerequisiteId)) {
            await createPrerequisite({
              disciplineId: currentDiscipline.id,
              prerequisiteId,
            })
          }
        }

        // Atualizar o estado local dos pré-requisitos
        const filteredPrerequisites = prerequisites.filter((p) => p.disciplineId !== currentDiscipline.id)
        const newPrerequisites = selectedPrerequisites.map((prerequisiteId) => ({
          disciplineId: currentDiscipline.id,
          prerequisiteId,
        }))
        setPrerequisites([...filteredPrerequisites, ...newPrerequisites])

        toast({
          title: "Sucesso",
          description: "Disciplina atualizada com sucesso",
        })
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a disciplina",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao atualizar disciplina:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a disciplina",
        variant: "destructive",
      })
    } finally {
      setIsEditDialogOpen(false)
      setIsSubmitting(false)
    }
  }

  const handleDeleteDiscipline = async () => {
    if (!currentDiscipline) return

    setIsSubmitting(true)
    try {
      const success = await deleteDiscipline(currentDiscipline.id)

      if (success) {
        // Remover a disciplina do estado local
        setDisciplines(disciplines.filter((d) => d.id !== currentDiscipline.id))

        // Remover quaisquer relacionamentos de pré-requisitos
        setPrerequisites(
          prerequisites.filter(
            (p) => p.disciplineId !== currentDiscipline.id && p.prerequisiteId !== currentDiscipline.id,
          ),
        )

        // Remover quaisquer horários
        setTimetables(timetables.filter((t) => t.disciplineId !== currentDiscipline.id))

        toast({
          title: "Sucesso",
          description: "Disciplina excluída com sucesso",
        })
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível excluir a disciplina",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao excluir disciplina:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a disciplina",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (discipline: any) => {
    setCurrentDiscipline({ ...discipline })

    // Get current prerequisites for this discipline
    const currentPrereqs = prerequisites.filter((p) => p.disciplineId === discipline.id).map((p) => p.prerequisiteId)

    setSelectedPrerequisites(currentPrereqs)

    // Set form values
    editDisciplineForm.reset({
      name: discipline.name,
      semester: discipline.semester,
      workload: discipline.workload,
      type: discipline.type,
      code: discipline.code,
    })

    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (discipline: any) => {
    setCurrentDiscipline(discipline)
    setIsDeleteDialogOpen(true)
  }

  const openTimetableDialog = (discipline: any) => {
    setCurrentDiscipline(discipline)
    setCurrentTimetables(getDisciplineTimetables(discipline.id))

    // Initialize timetable form
    addTimetableForm.reset({
      disciplineId: discipline.id,
      educatorId: 1, // Default to first educator
      days: discipline.workload === 40 ? "SEG" : "SEG QUA",
      hours: discipline.workload === 40 ? "AB-M" : "AB-M AB-M",
    })

    setIsTimetableDialogOpen(true)
  }

  const addPrerequisite = (prerequisiteId: number) => {
    if (!selectedPrerequisites.includes(prerequisiteId)) {
      setSelectedPrerequisites([...selectedPrerequisites, prerequisiteId])
    }
    setComboboxOpen(false)
  }

  const removePrerequisite = (prerequisiteId: number) => {
    setSelectedPrerequisites(selectedPrerequisites.filter((id) => id !== prerequisiteId))
  }

  const handleAddTimetable = async () => {
    try {
      const values = addTimetableForm.getValues()

      const newTimetableData = await createTimetable({
        disciplineId: currentDiscipline.id,
        educatorId: values.educatorId,
        days: values.days,
        hours: values.hours,
        roomId: values.roomId,
      })

      if (newTimetableData) {
        // Adicionar o novo horário ao estado local
        const newTimetable = {
          id: newTimetableData.id,
          disciplineId: currentDiscipline.id,
          days: values.days,
          hours: values.hours,
          educator: { id: values.educatorId, name: "Educador", lattesLink: "" },
          room: rooms.find(r => r.id === values.roomId) || null,
        }

        setTimetables([...timetables, newTimetable])
        setCurrentTimetables([...currentTimetables, newTimetable])

        toast({
          title: "Sucesso",
          description: "Horário adicionado com sucesso",
        })

        // Reset form based on workload
        addTimetableForm.reset({
          disciplineId: currentDiscipline.id,
          educatorId: values.educatorId,
          days: currentDiscipline.workload === 40 ? "SEG" : "SEG QUA",
          hours: currentDiscipline.workload === 40 ? "AB-M" : "AB-M AB-M",
          roomId: 1,
        })
      }
    } catch (error) {
      console.error("Erro ao adicionar horário:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o horário",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTimetable = async (timetableId: number) => {
    try {
      const success = await deleteTimetable(timetableId)

      if (success) {
        setTimetables(timetables.filter((t) => t.id !== timetableId))
        setCurrentTimetables(currentTimetables.filter((t) => t.id !== timetableId))

        toast({
          title: "Sucesso",
          description: "Horário excluído com sucesso",
        })
      }
    } catch (error) {
      console.error("Erro ao excluir horário:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o horário",
        variant: "destructive",
      })
    }
  }

  // Helper function to format timetable for display
  const formatTimetable = (timetable: any) => {
    const dayMap: Record<string, string> = {
      SEG: "Segunda",
      TER: "Terça",
      QUA: "Quarta",
      QUI: "Quinta",
      SEX: "Sexta",
    }

    const timeMap: Record<string, string> = {
      "AB-M": "8:00-10:00",
      "CD-M": "10:00-12:00",
      "AB-T": "13:00-15:00",
      "CD-T": "15:00-17:00",
      "AB-N": "18:00-20:00",
      "CD-N": "20:00-22:00",
    }

    const days = timetable.days.split(" ")
    const hours = timetable.hours.split(" ")

    return days
      .map((day: string, index: number) => {
        const hour = hours[index] || hours[0]
        return `${dayMap[day]} ${timeMap[hour]}`
      })
      .join(", ")
  }

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  return (
    <DashboardLayout initUserData={initialUserData}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Disciplinas</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/dashboard/timetable">Ver Horários</Link>
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Disciplina
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Disciplina</DialogTitle>
                  <DialogDescription>Insira os detalhes para a nova disciplina.</DialogDescription>
                </DialogHeader>
                <Form {...addDisciplineForm}>
                  <form onSubmit={addDisciplineForm.handleSubmit(handleAddDiscipline)} className="space-y-4 py-4">
                    <FormField
                      control={addDisciplineForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="ex: CÁLCULO I" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={addDisciplineForm.control}
                        name="semester"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Semestre</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addDisciplineForm.control}
                        name="workload"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Carga Horária (horas)</FormLabel>
                            <Select
                              value={field.value.toString()}
                              onValueChange={(value) => field.onChange(Number.parseInt(value) as 40 | 80)}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a carga horária" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="40">40 horas</SelectItem>
                                <SelectItem value="80">80 horas</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={addDisciplineForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="OBG">Obrigatória (OBG)</SelectItem>
                                <SelectItem value="OPT">Optativa (OPT)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addDisciplineForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="ex: 04.505.15" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Pré-requisitos</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedPrerequisites.map((prereqId) => {
                          const prereq = disciplines.find((d) => d.id === prereqId)
                          return prereq ? (
                            <Badge key={prereq.id} variant="secondary" className="flex items-center gap-1">
                              {prereq.name}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => removePrerequisite(prereq.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ) : null
                        })}
                      </div>
                      <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={comboboxOpen}
                            className="justify-between"
                          >
                            Adicionar pré-requisito...
                            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar disciplinas..."
                              value={searchPrerequisite}
                              onValueChange={setSearchPrerequisite}
                            />
                            <CommandList>
                              <CommandEmpty>Nenhuma disciplina encontrada.</CommandEmpty>
                              <CommandGroup>
                                <ScrollArea className="h-[200px]">
                                  {getFilteredPrerequisiteOptions(0, selectedPrerequisites).map((discipline) => (
                                    <CommandItem
                                      key={discipline.id}
                                      value={discipline.name}
                                      onSelect={() => addPrerequisite(discipline.id)}
                                    >
                                      <div className="flex flex-col">
                                        <span>{discipline.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {discipline.code} - Semestre {discipline.semester}
                                        </span>
                                      </div>
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          selectedPrerequisites.includes(discipline.id) ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </ScrollArea>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="w-full sm:w-auto"
                        type="button"
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Adicionando..." : "Adicionar Disciplina"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Disciplinas</CardTitle>
            <CardDescription>Visualize, adicione, edite e exclua disciplinas no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar disciplinas..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-48">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Semestres</SelectItem>
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
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden md:table-cell">Semestre</TableHead>
                    <TableHead className="hidden md:table-cell">Carga Horária</TableHead>
                    <TableHead className="hidden md:table-cell">Tipo</TableHead>
                    <TableHead className="hidden lg:table-cell">Pré-requisitos</TableHead>
                    <TableHead className="hidden lg:table-cell">Horários</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDisciplines.length > 0 ? (
                    paginatedDisciplines.map((discipline) => (
                      <TableRow key={discipline.id}>
                        <TableCell className="font-medium">{discipline.code}</TableCell>
                        <TableCell>
                          <div>
                            {discipline.name}
                            <div className="md:hidden mt-1 space-y-1">
                              <div className="text-xs text-muted-foreground">Semestre: {discipline.semester}</div>
                              <div className="text-xs text-muted-foreground">Carga Horária: {discipline.workload}h</div>
                              <div className="text-xs text-muted-foreground">Tipo: {discipline.type}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{discipline.semester}</TableCell>
                        <TableCell className="hidden md:table-cell">{discipline.workload}h</TableCell>
                        <TableCell className="hidden md:table-cell">{discipline.type}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {getDisciplinePrerequisites(discipline.id).map((prereq) => (
                              <Badge key={prereq.id} variant="outline" className="text-xs">
                                {prereq.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {getDisciplineTimetables(discipline.id).length > 0 ? (
                              <Badge variant="secondary" className="text-xs">
                                {getDisciplineTimetables(discipline.id).length} horário(s)
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">Sem horários</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openTimetableDialog(discipline)}
                              title="Gerenciar Horários"
                            >
                              <Clock className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(discipline)}
                              title="Editar Disciplina"
                            >
                              <Pencil className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(discipline)}
                              title="Excluir Disciplina"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Nenhuma disciplina encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Controles de Paginação */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 space-x-0 sm:space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground text-center sm:text-left">
                Mostrando <span className="font-medium">{paginatedDisciplines.length}</span> de{" "}
                <span className="font-medium">{totalItems}</span> disciplinas
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 space-x-0 sm:space-x-2">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Linhas por página</p>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={itemsPerPage.toString()} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 15, 20].map((pageSize) => (
                        <SelectItem key={pageSize} value={pageSize.toString()}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-center text-sm font-medium">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diálogo de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Disciplina</DialogTitle>
              <DialogDescription>Atualize os detalhes desta disciplina.</DialogDescription>
            </DialogHeader>
            {currentDiscipline && (
              <Form {...editDisciplineForm}>
                <form onSubmit={editDisciplineForm.handleSubmit(handleEditDiscipline)} className="space-y-4 py-4">
                  <FormField
                    control={editDisciplineForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={editDisciplineForm.control}
                      name="semester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semestre</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editDisciplineForm.control}
                      name="workload"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carga Horária (horas)</FormLabel>
                          <Select
                            value={field.value.toString()}
                            onValueChange={(value) => field.onChange(Number.parseInt(value) as 40 | 80)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a carga horária" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="40">40 horas</SelectItem>
                              <SelectItem value="80">80 horas</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={editDisciplineForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="OBG">Obrigatória (OBG)</SelectItem>
                              <SelectItem value="OPT">Optativa (OPT)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editDisciplineForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Pré-requisitos</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedPrerequisites.map((prereqId) => {
                        const prereq = disciplines.find((d) => d.id === prereqId)
                        return prereq ? (
                          <Badge key={prereq.id} variant="secondary" className="flex items-center gap-1">
                            {prereq.name}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 ml-1"
                              onClick={() => removePrerequisite(prereq.id)}
                              type="button"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ) : null
                      })}
                    </div>
                    <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={comboboxOpen}
                          className="justify-between"
                          type="button"
                        >
                          Adicionar pré-requisito...
                          <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar disciplinas..."
                            value={searchPrerequisite}
                            onValueChange={setSearchPrerequisite}
                          />
                          <CommandList>
                            <CommandEmpty>Nenhuma disciplina encontrada.</CommandEmpty>
                            <CommandGroup>
                              <ScrollArea className="h-[200px]">
                                {getFilteredPrerequisiteOptions(currentDiscipline.id, selectedPrerequisites).map(
                                  (discipline) => (
                                    <CommandItem
                                      key={discipline.id}
                                      value={discipline.name}
                                      onSelect={() => addPrerequisite(discipline.id)}
                                    >
                                      <div className="flex flex-col">
                                        <span>{discipline.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {discipline.code} - Semestre {discipline.semester}
                                        </span>
                                      </div>
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          selectedPrerequisites.includes(discipline.id) ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  ),
                                )}
                              </ScrollArea>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      className="w-full sm:w-auto"
                      type="button"
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>

        {/* Diálogo de Exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Disciplina</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir esta disciplina? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            {currentDiscipline && (
              <div className="py-4">
                <p className="font-medium">{currentDiscipline.name}</p>
                <p className="text-sm text-muted-foreground">Código: {currentDiscipline.code}</p>
              </div>
            )}
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={handleDeleteDiscipline}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Excluindo..." : "Excluir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de Horários */}
        <Dialog open={isTimetableDialogOpen} onOpenChange={setIsTimetableDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gerenciar Horários</DialogTitle>
              <DialogDescription>
                {currentDiscipline && (
                  <>
                    Gerenciar horários para {currentDiscipline.name} ({currentDiscipline.code})
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            {currentDiscipline && (
              <div className="grid gap-4 py-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dias</TableHead>
                        <TableHead>Horas</TableHead>
                        <TableHead className="hidden md:table-cell">Horário</TableHead>
                        <TableHead className="hidden md:table-cell">Sala</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTimetables.length > 0 ? (
                        currentTimetables.map((timetable) => (
                          <TableRow key={timetable.id}>
                            <TableCell>{timetable.days}</TableCell>
                            <TableCell>{timetable.hours}</TableCell>
                            <TableCell className="hidden md:table-cell">{formatTimetable(timetable)}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {timetable.room ? `${timetable.room.description} - ${timetable.room.block?.description || "N/A"}` : "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteTimetable(timetable.id)}>
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            Nenhum horário encontrado. Adicione um abaixo.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-medium">Adicionar Novo Horário</h3>

                  <Form {...addTimetableForm}>
                    <form className="space-y-4">
                      {currentDiscipline.workload === 40 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={addTimetableForm.control}
                            name="days"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dia</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o dia" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="SEG">Segunda (SEG)</SelectItem>
                                    <SelectItem value="TER">Terça (TER)</SelectItem>
                                    <SelectItem value="QUA">Quarta (QUA)</SelectItem>
                                    <SelectItem value="QUI">Quinta (QUI)</SelectItem>
                                    <SelectItem value="SEX">Sexta (SEX)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addTimetableForm.control}
                            name="hours"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Horário</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o horário" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="AB-M">Manhã 8:00-10:00 (AB-M)</SelectItem>
                                    <SelectItem value="CD-M">Manhã 10:00-12:00 (CD-M)</SelectItem>
                                    <SelectItem value="AB-T">Tarde 13:00-15:00 (AB-T)</SelectItem>
                                    <SelectItem value="CD-T">Tarde 15:00-17:00 (CD-T)</SelectItem>
                                    <SelectItem value="AB-N">Noite 18:00-20:00 (AB-N)</SelectItem>
                                    <SelectItem value="CD-N">Noite 20:00-22:00 (CD-N)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={addTimetableForm.control}
                              name="days"
                              render={({ field }) => {
                                const days = field.value.split(" ")
                                return (
                                  <FormItem>
                                    <FormLabel>Dias</FormLabel>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Primeiro Dia:</span>
                                        <Select
                                          value={days[0] || "SEG"}
                                          onValueChange={(value) => {
                                            const newDays = [...days]
                                            newDays[0] = value
                                            field.onChange(newDays.join(" "))
                                          }}
                                        >
                                          <FormControl>
                                            <SelectTrigger className="w-[140px]">
                                              <SelectValue placeholder="Selecione o dia" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="SEG">Segunda (SEG)</SelectItem>
                                            <SelectItem value="TER">Terça (TER)</SelectItem>
                                            <SelectItem value="QUA">Quarta (QUA)</SelectItem>
                                            <SelectItem value="QUI">Quinta (QUI)</SelectItem>
                                            <SelectItem value="SEX">Sexta (SEX)</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Segundo Dia:</span>
                                        <Select
                                          value={days[1] || "QUA"}
                                          onValueChange={(value) => {
                                            const newDays = [...days]
                                            newDays[1] = value
                                            field.onChange(newDays.join(" "))
                                          }}
                                        >
                                          <FormControl>
                                            <SelectTrigger className="w-[140px]">
                                              <SelectValue placeholder="Selecione o dia" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="SEG">Segunda (SEG)</SelectItem>
                                            <SelectItem value="TER">Terça (TER)</SelectItem>
                                            <SelectItem value="QUA">Quarta (QUA)</SelectItem>
                                            <SelectItem value="QUI">Quinta (QUI)</SelectItem>
                                            <SelectItem value="SEX">Sexta (SEX)</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )
                              }}
                            />
                            <FormField
                              control={addTimetableForm.control}
                              name="hours"
                              render={({ field }) => {
                                const hours = field.value.split(" ")
                                return (
                                  <FormItem>
                                    <FormLabel>Horários</FormLabel>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Primeiro Horário:</span>
                                        <Select
                                          value={hours[0] || "AB-M"}
                                          onValueChange={(value) => {
                                            const newHours = [...hours]
                                            newHours[0] = value
                                            field.onChange(newHours.join(" "))
                                          }}
                                        >
                                          <FormControl>
                                            <SelectTrigger className="w-[140px]">
                                              <SelectValue placeholder="Selecione o horário" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="AB-M">Manhã 8:00-10:00</SelectItem>
                                            <SelectItem value="CD-M">Manhã 10:00-12:00</SelectItem>
                                            <SelectItem value="AB-T">Tarde 13:00-15:00</SelectItem>
                                            <SelectItem value="CD-T">Tarde 15:00-17:00</SelectItem>
                                            <SelectItem value="AB-N">Noite 18:00-20:00</SelectItem>
                                            <SelectItem value="CD-N">Noite 20:00-22:00</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Segundo Horário:</span>
                                        <Select
                                          value={hours[1] || "AB-M"}
                                          onValueChange={(value) => {
                                            const newHours = [...hours]
                                            newHours[1] = value
                                            field.onChange(newHours.join(" "))
                                          }}
                                        >
                                          <FormControl>
                                            <SelectTrigger className="w-[140px]">
                                              <SelectValue placeholder="Selecione o horário" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="AB-M">Manhã 8:00-10:00</SelectItem>
                                            <SelectItem value="CD-M">Manhã 10:00-12:00</SelectItem>
                                            <SelectItem value="AB-T">Tarde 13:00-15:00</SelectItem>
                                            <SelectItem value="CD-T">Tarde 15:00-17:00</SelectItem>
                                            <SelectItem value="AB-N">Noite 18:00-20:00</SelectItem>
                                            <SelectItem value="CD-N">Noite 20:00-22:00</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <FormField
                        control={addTimetableForm.control}
                        name="educatorId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professor</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between"
                                  >
                                    {field.value
                                      ? educators.find((educator) => educator.id === field.value)?.name
                                      : "Selecione o professor"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Buscar professor..."
                                    value={searchEducator}
                                    onValueChange={setSearchEducator}
                                  />
                                  <CommandList>
                                    <CommandEmpty>Nenhum professor encontrado.</CommandEmpty>
                                    <CommandGroup>
                                      <ScrollArea className="h-[200px]">
                                        {filteredEducators.map((educator) => (
                                          <CommandItem
                                            key={educator.id}
                                            value={educator.name}
                                            onSelect={() => {
                                              field.onChange(educator.id);
                                              setSearchEducator("");
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value === educator.id ? "opacity-100" : "opacity-0"
                                              )}
                                            />
                                            {educator.name}
                                          </CommandItem>
                                        ))}
                                      </ScrollArea>
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={addTimetableForm.control}
                        name="roomId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sala</FormLabel>
                            <Select
                              value={field.value?.toString() || "1"}
                              onValueChange={(value) => field.onChange(Number(value))}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a sala" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {rooms && rooms.length > 0 ? (
                                  rooms.map((room) => (
                                    <SelectItem key={room.id} value={room.id.toString()}>
                                      {room.description} - {room.block?.description || "N/A"}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="1" disabled>
                                    Nenhuma sala disponível
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </div>
              </div>
            )}
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsTimetableDialogOpen(false)} className="w-full sm:w-auto">
                Fechar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" onClick={handleAddTimetable}>
                Adicionar Horário
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

