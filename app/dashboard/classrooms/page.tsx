"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for classrooms
const initialClassrooms = [
  {
    id: 1,
    name: "Sala 101",
    building: "Bloco A",
    capacity: 40,
    type: "Classroom",
  },
  {
    id: 2,
    name: "Laboratório 01",
    building: "Bloco B",
    capacity: 30,
    type: "Laboratory",
  },
  {
    id: 3,
    name: "Sala 201",
    building: "Bloco A",
    capacity: 45,
    type: "Classroom",
  },
  {
    id: 4,
    name: "Auditório Principal",
    building: "Bloco C",
    capacity: 120,
    type: "Auditorium",
  },
  {
    id: 5,
    name: "Laboratório 02",
    building: "Bloco B",
    capacity: 25,
    type: "Laboratory",
  },
]

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState(initialClassrooms)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentClassroom, setCurrentClassroom] = useState<any>(null)
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    building: "",
    capacity: 30,
    type: "Classroom",
  })

  const filteredClassrooms = classrooms.filter(
    (classroom) =>
      classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.building.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddClassroom = () => {
    const id = Math.max(...classrooms.map((c) => c.id)) + 1
    setClassrooms([...classrooms, { ...newClassroom, id }])
    setNewClassroom({
      name: "",
      building: "",
      capacity: 30,
      type: "Classroom",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditClassroom = () => {
    setClassrooms(classrooms.map((c) => (c.id === currentClassroom.id ? currentClassroom : c)))
    setIsEditDialogOpen(false)
  }

  const handleDeleteClassroom = () => {
    setClassrooms(classrooms.filter((c) => c.id !== currentClassroom.id))
    setIsDeleteDialogOpen(false)
  }

  const openEditDialog = (classroom: any) => {
    setCurrentClassroom({ ...classroom })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (classroom: any) => {
    setCurrentClassroom(classroom)
    setIsDeleteDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Salas</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Sala
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Sala</DialogTitle>
                <DialogDescription>Insira os detalhes para a nova sala.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={newClassroom.name}
                    onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
                    placeholder="ex: Sala 101"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="building">Prédio</Label>
                  <Input
                    id="building"
                    value={newClassroom.building}
                    onChange={(e) => setNewClassroom({ ...newClassroom, building: e.target.value })}
                    placeholder="ex: Bloco A"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="capacity">Capacidade</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      value={newClassroom.capacity}
                      onChange={(e) => setNewClassroom({ ...newClassroom, capacity: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={newClassroom.type}
                      onValueChange={(value) => setNewClassroom({ ...newClassroom, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Classroom">Sala de Aula</SelectItem>
                        <SelectItem value="Laboratory">Laboratório</SelectItem>
                        <SelectItem value="Auditorium">Auditório</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddClassroom}>
                  Adicionar Sala
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Salas</CardTitle>
            <CardDescription>Visualize, adicione, edite e exclua salas no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar salas..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Prédio</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClassrooms.length > 0 ? (
                    filteredClassrooms.map((classroom) => (
                      <TableRow key={classroom.id}>
                        <TableCell className="font-medium">{classroom.name}</TableCell>
                        <TableCell>{classroom.building}</TableCell>
                        <TableCell>{classroom.capacity}</TableCell>
                        <TableCell>
                          {classroom.type === "Classroom"
                            ? "Sala de Aula"
                            : classroom.type === "Laboratory"
                              ? "Laboratório"
                              : classroom.type === "Auditorium"
                                ? "Auditório"
                                : classroom.type}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(classroom)}>
                              <Pencil className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(classroom)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nenhuma sala encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Sala</DialogTitle>
              <DialogDescription>Atualize os detalhes desta sala.</DialogDescription>
            </DialogHeader>
            {currentClassroom && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nome</Label>
                  <Input
                    id="edit-name"
                    value={currentClassroom.name}
                    onChange={(e) => setCurrentClassroom({ ...currentClassroom, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-building">Prédio</Label>
                  <Input
                    id="edit-building"
                    value={currentClassroom.building}
                    onChange={(e) => setCurrentClassroom({ ...currentClassroom, building: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-capacity">Capacidade</Label>
                    <Input
                      id="edit-capacity"
                      type="number"
                      min="1"
                      value={currentClassroom.capacity}
                      onChange={(e) =>
                        setCurrentClassroom({ ...currentClassroom, capacity: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-type">Tipo</Label>
                    <Select
                      value={currentClassroom.type}
                      onValueChange={(value) => setCurrentClassroom({ ...currentClassroom, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Classroom">Sala de Aula</SelectItem>
                        <SelectItem value="Laboratory">Laboratório</SelectItem>
                        <SelectItem value="Auditorium">Auditório</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleEditClassroom}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Sala</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir esta sala? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            {currentClassroom && (
              <div className="py-4">
                <p className="font-medium">{currentClassroom.name}</p>
                <p className="text-sm text-muted-foreground">{currentClassroom.building}</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteClassroom}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

