import { fetchData } from "@/lib/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Plus, Clock, Calendar, Info, Stethoscope } from "lucide-react"
import HelpersFiltersClient from "./HelpersFiltersClient"
import HelpersClientActions from "./HelpersClientActions"

const PAGE_SIZE = 12

export default async function HelpersPage({ searchParams }: { searchParams: { page?: string, occupation?: string, search?: string } }) {
  const page = Number(searchParams.page) || 1
  // occupation pode ser undefined, "professional", "volunteer" ou ""
  const occupation = searchParams.occupation ?? ""
  const search = searchParams.search || ""

  // Monta a URL removendo occupation se for vazio ou "todos"
  let url = `${process.env.NEXT_PUBLIC_URL_BACKEND}/helper/list?page=${page}&limit=${PAGE_SIZE}`
  if (occupation && occupation !== "todos") url += `&occupation=${occupation}`
  if (search) url += `&search=${encodeURIComponent(search)}`

  const data = await fetchData<any>(url)
  const helpers = data.data
  const pagination = data.pagination

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row justify-between mr-8">

      <div className="flex flex-col gap-2 px-8 pt-8 pb-2">
        <h1 className="text-2xl font-semibold text-[#101828]">Visualização Ajudantes</h1>
        <span className="text-sm text-[#667085]">Mostrando: Todas as consultas para ajudantes</span>
      </div>
        <HelpersFiltersClient
          searchDefault={search}
          occupationDefault={occupation}
          page={page}
        />
      </div>
      <div className="flex flex-col gap-3 px-8 pb-4">
        {helpers.map((h: any) => (
          <div key={h.id} className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-[#eaecf0] rounded-xl px-6 py-4 mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="font-semibold text-[#101828] text-base">{h.firstName} {h.lastName}</span>
                <span className="text-[#475467] text-sm">{h.email}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="flex flex-row items-center gap-2 text-gray-700 text-sm">
                  <Stethoscope size={16}/>
                  {h.occupation === "professional" ? "Profissional" : "Voluntário"}
                </div>
                {/* Disponibilidade */}
                {h.availability && (h.availability.chat || h.availability.videoCall || h.availability.presential) ? (
                  <>
                    {h.availability.chat && <Badge className="bg-[#f0fdf4] text-[#059669] text-xs font-medium">Chat</Badge>}
                    {h.availability.videoCall && <Badge className="bg-[#dbeafe] text-[#1d4ed8] text-xs font-medium">Vídeo</Badge>}
                    {h.availability.presential && <Badge className="bg-[#fef3c7] text-[#b45309] text-xs font-medium">Presencial</Badge>}
                  </>
                ) : (
                  <span className="text-[#f04438] text-sm font-medium flex items-center gap-1">
                    <Info className="h-4 w-4" /> Sem disponibilidade ativa
                  </span>
                )}
              </div>
              <div className="text-[#475467] text-sm mt-2">Cadastrado em: {new Date(h.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <Link href={`/napne/helpers/${h.id}`} passHref legacyBehavior>
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
              <a href={`?page=${pagination.page - 1}${occupation ? `&occupation=${occupation}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}>Anterior</a>
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
                <a href={`?page=${num}${occupation ? `&occupation=${occupation}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}>{num}</a>
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
              <a href={`?page=${pagination.page + 1}${occupation ? `&occupation=${occupation}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}>Próximo</a>
            ) : (
              "Próximo"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 