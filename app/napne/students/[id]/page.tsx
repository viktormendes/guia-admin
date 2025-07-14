import { getStudentById } from '@/actions/student-actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Phone,
  Info,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR')
}

function getAge(dateStr?: string | null) {
  if (!dateStr) return null
  const birth = new Date(dateStr)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export default async function StudentDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    const student = await getStudentById(params.id)

    return (
      <div className="flex flex-col min-h-screen bg-white p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/napne/students" passHref legacyBehavior>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto text-sm text-[#027A48] hover:bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-[#027A48]">
            Lista de Usuários / {student.firstName} {student.lastName}
          </h1>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna esquerda */}
          <div className="flex flex-col items-center md:items-start gap-4">
            {/* Avatar + nome/idade/gênero */}
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={student.avatarUrl || '/placeholder-user.jpg'}
                  alt={student.firstName}
                />
                <AvatarFallback>
                  <User className="h-12 w-12 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <div className="text-lg font-semibold text-[#101828]">
                  {student.firstName} {student.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {getAge(student.birthDate)
                    ? `${getAge(student.birthDate)} anos, `
                    : ''}
                  {student.gender === 'male'
                    ? 'Homem'
                    : student.gender === 'female'
                    ? 'Mulher'
                    : 'Outro'}
                </div>
              </div>
            </div>
            {/* Linha divisória após avatar/nome/idade/gênero */}
            <div className="h-px w-full bg-gray-200 my-1" />
            {/* Dados de contato em grid 2 colunas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500 mt-4 w-full">
              <div>
                <div className="text-xs mb-1">Email</div>
                <div className="flex gap-2 items-center text-gray-900">
                  <span>{student.email}</span>
                </div>
              </div>
              <div>
                <div className="text-xs mb-1">Número</div>
                <div className="flex gap-2 items-center text-gray-900">
                  <span>{student.phoneNumber || '-'}</span>
                </div>
              </div>
              <div>
                <div className="text-xs mb-1">Aniversário</div>
                <div className="flex gap-2 items-center text-gray-900">
                  <span>{student.birthDate}</span>
                </div>
              </div>
              <div>
                <div className="text-xs mb-1">Última Solicitação</div>
                <div className="flex gap-2 items-center text-gray-900">
                  <span>Chat</span>
                </div>
              </div>
            </div>
            {/* Linha divisória após dados de contato */}
            <div className="h-px w-full bg-gray-200 my-1" />

            {/* Necessidades especiais */}
            <div className="w-full">
              <span className="text-xs text-gray-500">
                Necessidades Especiais
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {student.specialNeeds?.map((n: any) => (
                  <Badge
                    key={n.specialNeedSubcategoryId}
                    className="bg-[#ECFDF3] text-[#027A48] rounded-full px-3 py-1 text-sm font-medium"
                  >
                    {n.specialNeedName}
                    {n.specialNeedSubcategoryName && (
                      <span className="ml-1 text-xs text-gray-600">
                        ({n.specialNeedSubcategoryName})
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Endereço */}
            <div className="w-full">
              <span className="text-xs text-gray-500">Endereço</span>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-700"
                  value={
                    [student.street, student.number, student.neighborhood, student.city]
                      .filter(Boolean)
                      .join(', ') || '-'
                  }
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Coluna direita: observações e notas */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Observações para Apoio
              </label>
              <textarea
                disabled
                value={student.observations || ''}
                className="w-full min-h-[60px] bg-gray-100 border rounded-md px-3 py-2 text-sm text-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Notas para revisão
              </label>
              <textarea
                disabled
                value={student.supportNotes || ''}
                className="w-full min-h-[60px] bg-gray-100 border rounded-md px-3 py-2 text-sm text-gray-700"
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                className="border-[#027A48] text-[#027A48] hover:bg-[#F0FDF4] font-medium"
              >
                + Editar Usuário
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
