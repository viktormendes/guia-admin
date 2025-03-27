"use client";

import { useState, useEffect } from "react";
import DashboardLayout, { UserData } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IEducator } from "@/types/Educator";
import {
  createEducator,
  deleteEducator,
  fetchEducators,
  updateEducator,
} from "@/actions/educator-actions";
import { EducatorFormValues, educatorSchema } from "@/lib/schemas";
import { z } from "zod";

interface IEducatorsContentProps {
  initialEducators: IEducator[];
  initialUserData: UserData
}
export default function EducatorsContent({
  initialEducators,
  initialUserData
}: IEducatorsContentProps) {
  const [educators, setEducators] = useState(initialEducators);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEducator, setCurrentEducator] = useState<IEducator | null>(
    null
  );
  const [newEducator, setNewEducator] = useState<EducatorFormValues>({
    name: "",
    lattesLink: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedEducators, setPaginatedEducators] = useState<IEducator[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  // Buscar educadores ao carregar o componente
  useEffect(() => {
    const loadEducators = async () => {
      const data = await fetchEducators();
      setEducators(data);
    };
    loadEducators();
  }, []);

  // Filtragem e paginação
  useEffect(() => {
    const filtered = educators.filter((educator) =>
      educator.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTotalItems(filtered.length);
    const total = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(total || 1);

    if (currentPage > total) {
      setCurrentPage(1);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedEducators(filtered.slice(startIndex, endIndex));
  }, [educators, searchTerm, currentPage, itemsPerPage]);

  // Adicionar educador
  const handleAddEducator = async () => {
    try {
      // Validar os dados com Zod
      const validatedData = educatorSchema.parse(newEducator);
      setErrors({});
      // Chamar a server action para criar o educador
      const success = await createEducator(validatedData);
      if (success) {
        const data = await fetchEducators();
        setEducators(data);
        setNewEducator({ name: "", lattesLink: "" });
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      // Exibir erros de validação
      if (error instanceof z.ZodError) {
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) errorMap[err.path[0]] = err.message;
        });
        setErrors(errorMap);
      } else {
        console.error("Erro ao criar educador:", error);
      }
    }
  };

  const handleEditEducator = async () => {
    if (currentEducator) {
      try {
        // Validar os dados com Zod
        const validatedData = educatorSchema.parse({
          name: currentEducator.name,
          lattesLink: currentEducator.lattesLink || "",
        });
        setErrors({});

        // Chamar a server action para atualizar o educador
        const success = await updateEducator(currentEducator.id, validatedData);
        if (success) {
          const data = await fetchEducators();
          setEducators(data);
          setIsEditDialogOpen(false);
        }
      } catch (error) {
        // Exibir erros de validação
        if (error instanceof z.ZodError) {
            const errorMap: { [key: string]: string } = {};
            error.errors.forEach((err) => {
              if (err.path) errorMap[err.path[0]] = err.message;
            });
            setErrors(errorMap);
        } else {
          console.error("Erro ao atualizar educador:", error);
        }
      }
    }
  };

  // Excluir educador
  const handleDeleteEducator = async () => {
    if (currentEducator) {
      const success = await deleteEducator(currentEducator.id);
      if (success) {
        const data = await fetchEducators();
        setEducators(data);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  // Abrir diálogo de edição
  const openEditDialog = (educator: IEducator) => {
    setCurrentEducator(educator);
    setIsEditDialogOpen(true);
  };

  // Abrir diálogo de exclusão
  const openDeleteDialog = (educator: IEducator) => {
    setCurrentEducator(educator);
    setIsDeleteDialogOpen(true);
  };

  // Paginação
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value));
    setCurrentPage(1);
  };

  return (
    <DashboardLayout initUserData={initialUserData}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Professores
          </h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Professor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Professor</DialogTitle>
                <DialogDescription>
                  Insira os detalhes para o novo professor.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={newEducator.name}
                    onChange={(e) =>
                      setNewEducator({ ...newEducator, name: e.target.value })
                    }
                    placeholder="ex: JOÃO SILVA"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm">{errors.name}</span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lattesLink">Link do Lattes (opcional)</Label>
                  <Input
                    id="lattesLink"
                    value={newEducator.lattesLink}
                    onChange={(e) =>
                      setNewEducator({
                        ...newEducator,
                        lattesLink: e.target.value,
                      })
                    }
                    placeholder="http://lattes.cnpq.br/..."
                  />
                  {errors.lattesLink && (
                    <span className="text-red-500 text-sm">
                      {errors.lattesLink}
                    </span>
                  )}
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  onClick={handleAddEducator}
                >
                  Adicionar Professor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Professores</CardTitle>
            <CardDescription>
              Visualize, adicione, edite e exclua professores no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar professores..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Link do Lattes
                    </TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEducators.length > 0 ? (
                    paginatedEducators.map((educator) => (
                      <TableRow key={educator.id}>
                        <TableCell className="font-medium">
                          {educator.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            {educator.name}
                            <div className="md:hidden mt-1">
                              {educator.lattesLink ? (
                                <a
                                  href={educator.lattesLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-green-600 hover:underline text-xs"
                                >
                                  Ver Lattes{" "}
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Sem link do Lattes
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {educator.lattesLink ? (
                            <a
                              href={educator.lattesLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-green-600 hover:underline"
                            >
                              Ver Lattes{" "}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">
                              Não fornecido
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(educator)}
                            >
                              <Pencil className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(educator)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Nenhum professor encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Controles de Paginação */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 space-x-0 sm:space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground text-center sm:text-left">
                Mostrando{" "}
                <span className="font-medium">{paginatedEducators.length}</span>{" "}
                de <span className="font-medium">{totalItems}</span> professores
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 space-x-0 sm:space-x-2">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Linhas por página</p>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                  >
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
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diálogo de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Professor</DialogTitle>
              <DialogDescription>
                Atualize os detalhes deste professor.
              </DialogDescription>
            </DialogHeader>
            {currentEducator && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nome</Label>
                  <Input
                    id="edit-name"
                    value={currentEducator.name}
                    onChange={(e) =>
                      setCurrentEducator({
                        ...currentEducator,
                        name: e.target.value,
                      })
                    }
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm">{errors.name}</span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-lattesLink">
                    Link do Lattes (opcional)
                  </Label>
                  <Input
                    id="edit-lattesLink"
                    value={currentEducator.lattesLink || ""}
                    onChange={(e) =>
                      setCurrentEducator({
                        ...currentEducator,
                        lattesLink: e.target.value,
                      })
                    }
                    placeholder="http://lattes.cnpq.br/..."
                  />
                  {errors.lattesLink && (
                    <span className="text-red-500 text-sm">
                      {errors.lattesLink}
                    </span>
                  )}
                </div>
              </div>
            )}
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                onClick={handleEditEducator}
              >
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de Exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Professor</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este professor? Esta ação não
                pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            {currentEducator && (
              <div className="py-4">
                <p className="font-medium">{currentEducator.name}</p>
                <p className="text-sm text-muted-foreground">
                  ID: {currentEducator.id}
                </p>
              </div>
            )}
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={handleDeleteEducator}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
