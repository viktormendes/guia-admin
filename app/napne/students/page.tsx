import { fetchData } from "@/lib/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Plus, Clock, Calendar, Info, User } from "lucide-react"
import StudentsFiltersClient from "./StudentsFiltersClient"
import StudentsClientActions from "./StudentsClientActions"
import { Suspense } from "react"

const PAGE_SIZE = 12

export default async function StudentsPage({ searchParams }: { searchParams: { page?: string, search?: string } }) {
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ""

  // Monta a URL para estudantes
  let url = `${process.env.NEXT_PUBLIC_URL_BACKEND}/student/list?page=${page}&limit=${PAGE_SIZE}`
  if (search) url += `&search=${encodeURIComponent(search)}`

  const data = await fetchData<any>(url)
  const students = data.data
  const pagination = data.pagination

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row justify-between mr-8">
        <div className="flex flex-col gap-2 px-8 pt-8 pb-2">
          <h1 className="text-2xl font-semibold text-[#101828]">Visualização Estudantes</h1>
          <span className="text-sm text-[#667085]">Mostrando: Todos os estudantes cadastrados</span>
        </div>
        <Suspense fallback={null}>
          <StudentsFiltersClient
            searchDefault={search}
            page={page}
          />
        </Suspense>
      </div>
      <div className="flex flex-col gap-3 px-8 pb-4">
        {students.map((s: any) => (
          <div key={s.id} className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-[#eaecf0] rounded-xl px-6 py-4 mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="font-semibold text-[#101828] text-base">{s.firstName} {s.lastName}</span>
                <span className="text-[#475467] text-sm">{s.email}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="flex flex-row items-center gap-2 text-gray-700 text-sm">
                  <User size={16}/>
                  Estudante
                </div>
                <Badge className="bg-[#f0fdf4] text-[#059669] text-xs font-medium">Ativo</Badge>
              </div>
              <div className="text-[#475467] text-sm mt-2">Cadastrado em: {new Date(s.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <Link href={`/napne/students/${s.id}`} passHref legacyBehavior>
                <Button variant="outline" className="border-[#d0d5dd] text-[#344054] font-medium">Visualizar Detalhes</Button>
              </Link>
            </div>
          </div>
        ))}
        {/* Paginação */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            className="border-[#d0d5dd] text-[#344054]"
            disabled={!pagination.hasPrev}
            asChild={pagination.hasPrev}
          >
            {pagination.hasPrev ? (
              <a href={`?page=${pagination.page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}>Anterior</a>
            ) : (
              "Anterior"
            )}
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(num => (
              <Button
                key={num}
                variant={num === pagination.page ? "default" : "outline"}
                size="sm"
                className={
                  num === pagination.page
                    ? "bg-green-700 text-white hover:bg-green-800"
                    : "text-[#344054] border-[#d0d5dd]"
                }
                asChild
              >
                <a href={`?page=${num}${search ? `&search=${encodeURIComponent(search)}` : ""}`}>{num}</a>
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            className="border-[#d0d5dd] text-[#344054]"
            disabled={!pagination.hasNext}
            asChild={pagination.hasNext}
          >
            {pagination.hasNext ? (
              <a href={`?page=${pagination.page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}>Próximo</a>
            ) : (
              "Próximo"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 