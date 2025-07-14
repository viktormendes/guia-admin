import { fetchData } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowLeft, CheckCircle, AlertCircle, Clock, Edit2, Stethoscope, Info, Eye, MapPinned, MessageCircle, Video, HeartHandshake } from "lucide-react"
import Link from "next/link"

function getStatusBadge(status: string) {
  if (status === "Concluído") return <Badge className="bg-[#ecfdf3] text-[#027a48] text-xs font-medium flex items-center gap-1"><CheckCircle className="h-4 w-4" />Concluído</Badge>
  if (status === "Pendente") return <Badge className="bg-[#fef3c7] text-[#b54708] text-xs font-medium flex items-center gap-1"><AlertCircle className="h-4 w-4" />Pendente</Badge>
  if (status === "Cancelado") return <Badge className="bg-[#fef2f2] text-[#b42318] text-xs font-medium flex items-center gap-1"><AlertCircle className="h-4 w-4" />Cancelado</Badge>
  return <Badge className="bg-[#e0e7ff] text-[#3730a3] text-xs font-medium">{status}</Badge>
}

export default async function HelperDetailsPage(props: { params: { id: string }, searchParams: { page?: string } }) {
  const { params, searchParams } = await props;
  const page = Number(searchParams.page) || 1;
  const url = `${process.env.NEXT_PUBLIC_URL_BACKEND}/helper/list/${params.id}?page=${page}&limit=8&sortBy=createdAt&sortOrder=DESC`;
  const data = await fetchData<any>(url);
  const helper = data.helper;
  const helps = data.helps.data;
  const pagination = data.helps.pagination;

  // Cards de resumo
  const total = helper.stats?.totalRequests ?? 0
  const presential = helper.stats?.byType?.presential ?? 0
  const chat = helper.stats?.byType?.chat ?? 0
  const video = helper.stats?.byType?.videoCall ?? 0

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center gap-2 px-8 pt-8 pb-2">
        <Link href="/napne/helpers">
          <Button variant="ghost" className="p-2 text-green-700"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-lg font-semibold text-green-700">Visualização do Ajudante</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-6 px-8">
        {/* Info do ajudante */}
        <div className="flex-1 bg-white rounded-xl p-6 flex flex-col gap-2 min-w-[320px]">
          <div className="flex flex-col items-start gap-2">
            <div className="flex flex-row items-center gap-2">
            <span className="font-semibold text-[#101828] text-3xl">{helper.firstName} {helper.lastName}</span>
            <span className="font-semibold text-gray-700 text-lg">{helper.email}</span>
            </div>
            <span className="flex items-start gap-1 text-lg font-medium text-gray-700">
              <Stethoscope className="h-6 w-6" />
              {helper.occupation === "professional" ? "Profissional" : "Voluntário"}
            </span>
            <div className="flex flex-row gap-2 mt-1">
              {helper.availability && (helper.availability.chat || helper.availability.videoCall || helper.availability.presential) ? (
                <>
                  {helper.availability.chat && <Badge className="bg-[#f0fdf4] text-[#059669] text-xs font-medium">Chat</Badge>}
                  {helper.availability.videoCall && <Badge className="bg-[#dbeafe] text-[#1d4ed8] text-xs font-medium">Vídeo</Badge>}
                  {helper.availability.presential && <Badge className="bg-[#fef3c7] text-[#b45309] text-xs font-medium">Presencial</Badge>}
                </>
              ) : (
                <span className="text-[#f04438] text-sm font-medium flex items-center gap-1">
                  <Info className="h-4 w-4" /> Sem disponibilidade ativa
                </span>
              )}
            </div>
          </div>
          <div className="text-[#475467] text-sm mt-1">{helper.description}</div>
        </div>
        {/* Cards de resumo */}
        <div className="flex flex-row gap-4 flex-wrap">
          <div className="bg-[#f0fdf4] rounded-xl p-4 flex flex-col items-center min-w-[120px]">
            <HeartHandshake className="h-6 w-6 text-green-700 mb-2" />
            <span className="text-2xl font-bold text-[#101828]">{total}</span>
            <span className="text-xs text-[#475467]">Solicitações</span>
          </div>
          <div className="bg-[#f0fdf4] rounded-xl p-4 flex flex-col items-center min-w-[120px]">
            <MapPinned className="h-6 w-6 text-green-700 mb-2" />
            <span className="text-2xl font-bold text-[#101828]">{presential}</span>
            <span className="text-xs text-[#475467]">Presencial</span>
          </div>
          <div className="bg-[#f0fdf4] rounded-xl p-4 flex flex-col items-center min-w-[120px]">
            <MessageCircle className="h-6 w-6 text-green-700 mb-2" />
            <span className="text-2xl font-bold text-[#101828]">{chat}</span>
            <span className="text-xs text-[#475467]">Chat</span>
          </div>
          <div className="bg-[#f0fdf4] rounded-xl p-4 flex flex-col items-center min-w-[120px]">
            <Video className="h-6 w-6 text-green-700 mb-2" />
            <span className="text-2xl font-bold text-[#101828]">{video}</span>
            <span className="text-xs text-[#475467]">Vídeo</span>
          </div>
        </div>
      </div>
      {/* DataTable de pacientes */}
      <div className="bg-white rounded-xl mx-8 mt-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-[#101828]">Lista de Pacientes <Badge className="bg-[#f0fdf4] text-[#027a48] ml-2">{pagination.total} pacientes</Badge></span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#eaecf0]">
                <th className="text-left py-3 px-4 text-[#667085] text-xs font-medium uppercase tracking-wider">Nome do paciente</th>
                <th className="text-left py-3 px-4 text-[#667085] text-xs font-medium uppercase tracking-wider">Tipo</th>
                <th className="text-left py-3 px-4 text-[#667085] text-xs font-medium uppercase tracking-wider">Data</th>
                <th className="text-left py-3 px-4 text-[#667085] text-xs font-medium uppercase tracking-wider">Horário</th>
                <th className="text-left py-3 px-4 text-[#667085] text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {helps.map((req: any, idx: number) => (
                <tr key={req.id || idx} className="border-b border-[#f2f4f7] hover:bg-[#f9fafb] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-[#101828] text-sm font-medium">{req.studentName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#101828] text-sm">
                    {req.helpType === "dispatch" ? "Presencial" : req.helpType === "chat" ? "Chat" : req.helpType === "video_call" ? "Vídeo" : req.helpType}
                  </td>
                  <td className="py-4 px-4 text-[#101828] text-sm">{req.createdAt ? new Date(req.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : ""}</td>
                  <td className="py-4 px-4 text-[#101828] text-sm">{req.time}</td>
                  <td className="py-4 px-4">{getStatusBadge(req.status === "completed" ? "Concluído" : req.status === "pending" ? "Pendente" : req.status === "cancelled" ? "Cancelado" : req.status)}</td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" size="sm" className="text-[#667085] p-2 hover:bg-[#f9fafb]">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Paginação */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            className="border-[#d0d5dd] text-[#344054]"
            disabled={!pagination.hasPrev}
            asChild={pagination.hasPrev}
          >
            {pagination.hasPrev ? (
              <a href={`?page=${pagination.page - 1}`}>Anterior</a>
            ) : (
              "Anterior"
            )}
          </Button>
          <div className="flex items-center space-x-1">
            {/* Primeira página */}
            <Button
              key={1}
              variant={pagination.page === 1 ? "default" : "outline"}
              size="sm"
              className={pagination.page === 1 ? "bg-green-700 text-white hover:bg-green-800" : "text-[#344054] border-[#d0d5dd]"}
              asChild
            >
              <a href={`?page=1`}>1</a>
            </Button>
            {/* Página atual (se diferente da primeira) */}
            {pagination.page !== 1 && pagination.page !== pagination.totalPages && (
              <Button
                key={pagination.page}
                variant="default"
                size="sm"
                className="bg-green-700 text-white hover:bg-green-800"
                asChild
              >
                <a href={`?page=${pagination.page}`}>{pagination.page}</a>
              </Button>
            )}
            {/* Reticências se houver "buraco" entre atual e próxima/última */}
            {pagination.page + 1 < pagination.totalPages && (
              <span className="px-2 text-[#667085]">...</span>
            )}
            {/* Próxima página (se houver e diferente da atual/última) */}
            {pagination.page + 1 < pagination.totalPages && (
              <Button
                key={pagination.page + 1}
                variant="outline"
                size="sm"
                className="text-[#344054] border-[#d0d5dd]"
                asChild
              >
                <a href={`?page=${pagination.page + 1}`}>{pagination.page + 1}</a>
              </Button>
            )}
            {/* Última página (se diferente da atual e próxima) */}
            {pagination.totalPages > 1 && pagination.page !== pagination.totalPages && pagination.page + 1 !== pagination.totalPages && (
              <Button
                key={pagination.totalPages}
                variant="outline"
                size="sm"
                className="text-[#344054] border-[#d0d5dd]"
                asChild
              >
                <a href={`?page=${pagination.totalPages}`}>{pagination.totalPages}</a>
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            className="border-[#d0d5dd] text-[#344054]"
            disabled={!pagination.hasNext}
            asChild={pagination.hasNext}
          >
            {pagination.hasNext ? (
              <a href={`?page=${pagination.page + 1}`}>Próximo</a>
            ) : (
              "Próximo"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 