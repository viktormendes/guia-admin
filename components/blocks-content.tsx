"use client"

import { useEffect, useState } from "react"
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
import { Block, BlockStatus } from "../app/dashboard/classrooms/types"
import { createBlock, updateBlock, deleteBlock } from "@/actions/block-actions"
import { toast } from "sonner"
import { UserData } from "./dashboard-layout"

interface BlocksContentProps {
  initialBlocks: Block[]
  initialUserData: UserData
}

export default function BlocksContent({initialBlocks, initialUserData}: BlocksContentProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null)
  const [newBlock, setNewBlock] = useState({
    description: "",
    number_of_floors: 0,
    status: BlockStatus.ACTIVE,
  })

  const filteredBlocks = blocks.filter(
    (block) =>
      block.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddBlock = async () => {
    try {
      const createdBlock = await createBlock(newBlock)
      setBlocks([...blocks, createdBlock])
      setNewBlock({
        description: "",
        number_of_floors: 0,
        status: BlockStatus.ACTIVE,
      })
      setIsAddDialogOpen(false)
      toast.success("Bloco criado com sucesso")
    } catch (error) {
      toast.error("Erro ao criar bloco")
      console.error(error)
    }
  }

  const handleEditBlock = async () => {
    if (!currentBlock) return

    try {
      const updatedBlock = await updateBlock(currentBlock.id, {
        description: currentBlock.description,
        number_of_floors: currentBlock.number_of_floors,
        status: currentBlock.status,
      })
      setBlocks(blocks.map((b) => (b.id === currentBlock.id ? updatedBlock : b)))
      setIsEditDialogOpen(false)
      toast.success("Bloco atualizado com sucesso")
    } catch (error) {
      toast.error("Erro ao atualizar bloco")
      console.error(error)
    }
  }

  const handleDeleteBlock = async () => {
    if (!currentBlock) return

    try {
      await deleteBlock(currentBlock.id)
      setBlocks(blocks.filter((b) => b.id !== currentBlock.id))
      setIsDeleteDialogOpen(false)
      toast.success("Bloco excluído com sucesso")
    } catch (error) {
      toast.error("Erro ao excluir bloco")
      console.error(error)
    }
  }

  const openEditDialog = (block: Block) => {
    setCurrentBlock({ ...block })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (block: Block) => {
    setCurrentBlock(block)
    setIsDeleteDialogOpen(true)
  }

  return (
    <DashboardLayout initUserData={initialUserData}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Blocos</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Bloco
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Bloco</DialogTitle>
                <DialogDescription>Insira os detalhes para o novo bloco.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={newBlock.description}
                    onChange={(e) => setNewBlock({ ...newBlock, description: e.target.value })}
                    placeholder="ex: Bloco A"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="floors">Andares</Label>
                  <Input
                    id="floors"
                    value={newBlock.number_of_floors}
                    type="number"
                    min="0"
                    onChange={(e) => setNewBlock({ ...newBlock, number_of_floors: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newBlock.status}
                    onValueChange={(value) => setNewBlock({ ...newBlock, status: value as BlockStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(BlockStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddBlock}>
                  Adicionar Bloco
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Blocos</CardTitle>
            <CardDescription>Visualize, adicione, edite e exclua blocos no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar blocos..."
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
                    <TableHead>Andares</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlocks.length > 0 ? (
                    filteredBlocks.map((block) => (
                      <TableRow key={block.id}>
                        <TableCell className="font-medium">{block.description}</TableCell>
                        <TableCell className="font-medium">{block.number_of_floors}</TableCell>
                        <TableCell>{block.status}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(block)}>
                              <Pencil className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(block)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        Nenhum bloco encontrado.
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
              <DialogTitle>Editar Bloco</DialogTitle>
              <DialogDescription>Edite os detalhes do bloco.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={currentBlock?.description || ""}
                  onChange={(e) => setCurrentBlock(currentBlock ? { ...currentBlock, description: e.target.value } : null)}
                  placeholder="ex: Bloco A"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Andares</Label>
                <Input
                  id="edit-floor"
                  value={currentBlock?.number_of_floors || ""}
                  onChange={(e) => setCurrentBlock(currentBlock ? { ...currentBlock, number_of_floors: Number(e.target.value) } : null)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentBlock?.status}
                  onValueChange={(value) => setCurrentBlock(currentBlock ? { ...currentBlock, status: value as BlockStatus } : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(BlockStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleEditBlock}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Bloco</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o bloco {currentBlock?.description}? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteBlock}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
} 