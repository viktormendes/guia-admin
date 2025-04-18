"use client"

import { useEffect, useState } from "react"
import DashboardLayout, { UserData } from "@/components/dashboard-layout"
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
import { createRoom, updateRoom, deleteRoom } from "../actions/rooms-actions"
import { Block, Room, RoomType } from "@/app/dashboard/classrooms/types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RoomFormValues, roomSchema } from "@/lib/schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

interface ClassroomsContentProps {
    initClassrooms: Room[]
    initBlocks: Block[]
    initUserData: UserData
}

export default function ClassroomsContent({initClassrooms, initBlocks, initUserData}: ClassroomsContentProps) {
  const [classrooms, setClassrooms] = useState<Room[]>(initClassrooms || [])
  const [blocks, setBlocks] = useState<Block[]>(initBlocks || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentClassroom, setCurrentClassroom] = useState<Room | null>(null)

  const { toast } = useToast()

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      description: "",
      floor: 0,
      block_id: 0,
      capacity: 30,
      type: RoomType.CLASSROOM,
    },
  })

  const filteredClassrooms = classrooms.filter(
    (classroom) =>
      classroom?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom?.block?.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddClassroom = async (data: RoomFormValues) => {
    try {
      const createdRoom = await createRoom({
        ...data,
        type: data.type as RoomType
      })
      
      // Buscar o bloco correspondente
      const block = blocks.find(b => b.id === createdRoom.block_id)
      
      // Criar um objeto Room completo com o bloco
      const roomWithBlock = {
        ...createdRoom,
        block: block || null
      }
      
      setClassrooms([...classrooms, roomWithBlock])
      form.reset()
      setIsAddDialogOpen(false)
      toast({
        title: "Sucesso!",
        description: "Sala adicionado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Erro ao adicionar a sala",
        variant: "destructive"
      })
      console.error(error)
    }
  }

  const handleEditClassroom = async (data: RoomFormValues) => {
    if (!currentClassroom) return

    try {
      const updatedRoom = await updateRoom(currentClassroom.id, data)
      setClassrooms(classrooms.map((c) => (c.id === currentClassroom.id ? updatedRoom : c)))
      setIsEditDialogOpen(false)
      toast({
        title: "Sucesso!",
        description: "Sala editada com sucesso",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Erro ao editar a sala",
        variant: "destructive"
      })
      console.error(error)
    }
  }

  const handleDeleteClassroom = async () => {
    if (!currentClassroom) return

    try {
      await deleteRoom(currentClassroom.id)
      setClassrooms(classrooms.filter((c) => c.id !== currentClassroom.id))
      setIsDeleteDialogOpen(false)
      toast({
        title: "Sucesso!",
        description: "Sucesso ao deletar a sala",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Erro ao deletar a sala",
        variant: "destructive"
      })
      console.error(error)
    }
  }

  const openEditDialog = (classroom: Room) => {
    setCurrentClassroom({ ...classroom })
    form.reset({
      description: classroom.description,
      floor: classroom.floor,
      block_id: classroom.block_id,
      capacity: classroom.capacity,
      type: classroom.type,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (classroom: Room) => {
    setCurrentClassroom(classroom)
    setIsDeleteDialogOpen(true)
  }

  return (
    <DashboardLayout initUserData={initUserData}>
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddClassroom)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: Sala 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Andar</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="block_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bloco</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o bloco" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {blocks.map((block) => (
                              <SelectItem key={block.id} value={block.id.toString()}>
                                {block.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacidade</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(RoomType).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Adicionar Sala
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
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
                    <TableHead>Descrição</TableHead>
                    <TableHead>Andar</TableHead>
                    <TableHead>Bloco</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClassrooms.length > 0 ? (
                    filteredClassrooms.map((classroom) => (
                      <TableRow key={classroom.id}>
                        <TableCell className="font-medium">{classroom.description}</TableCell>
                        <TableCell>{classroom.floor}</TableCell>
                        <TableCell>{classroom.block?.description || "N/A"}</TableCell>
                        <TableCell>{classroom.capacity}</TableCell>
                        <TableCell>{classroom.type}</TableCell>
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
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhuma sala encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Sala</DialogTitle>
              <DialogDescription>Edite os detalhes da sala.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEditClassroom)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Sala 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Andar</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="block_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bloco</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o bloco" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {blocks.map((block) => (
                            <SelectItem key={block.id} value={block.id.toString()}>
                              {block.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacidade</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(RoomType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Salvar Alterações
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Sala</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir a sala {currentClassroom?.description}? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteClassroom}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

