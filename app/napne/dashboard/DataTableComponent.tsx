"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ChevronDown, Copy, Edit, MoreHorizontal } from "lucide-react"
import type { FC } from "react"
import { useState } from "react"

interface Solicitante {
  name: string
  username: string
  status: string
  requests: number
  firstRequestTime: string
  lastRequestTime: string
  typesRequested: string[]
  averageIntervalMinutes: number
  totalCompleted: number
  totalCancelled: number
}

interface DataTableComponentProps {
  solicitantes: Solicitante[]
}

export const DataTableComponent: FC<DataTableComponentProps> = ({ solicitantes }) => {
  const [visibleCount, setVisibleCount] = useState(5)
  const handleLoadMore = () => setVisibleCount((prev) => prev + 5)

  return (
    <Card className="bg-white border-[#eaecf0] w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CardTitle className="text-[#101828] text-lg font-medium">Solicitantes de hoje</CardTitle>
            <Badge className="bg-[#ecfdf3] text-[#027a48] text-xs px-2 py-1 font-medium">{solicitantes.length} usuários</Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-[#667085] p-1">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#eaecf0]">
                <th className="text-left py-3 px-6 text-[#667085] text-xs font-medium uppercase tracking-wider">Nome</th>
                <th className="text-left py-3 px-6 text-[#667085] text-xs font-medium uppercase tracking-wider">Última</th>
                <th className="text-left py-3 px-6 text-[#667085] text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-6 text-[#667085] text-xs font-medium uppercase tracking-wider">1ª Solicitação</th>
                <th className="text-left py-3 px-6 text-[#667085] text-xs font-medium uppercase tracking-wider">Solicitações</th>
                <th className="text-left py-3 px-6 text-[#667085] text-xs font-medium uppercase tracking-wider">Tipos</th>
              </tr>
            </thead>
            <tbody>
              {solicitantes.slice(0, visibleCount).map((person, idx) => (
                <tr key={person.username ?? idx} className="border-b border-[#f2f4f7] hover:bg-[#f9fafb] transition-colors">
                  <td className="py-4 px-6 text-[#101828] text-sm font-medium">{person.name}</td>
                  <td className="py-4 px-6 text-[#101828] text-sm">{person.lastRequestTime}</td>
                  <td className="py-4 px-6">
                    <Badge
                      className={`text-xs px-2 py-1 font-medium ${
                        person.status === "Completed"
                          ? "bg-[#ecfdf3] text-[#027a48]"
                          : person.status === "Cancelled"
                          ? "bg-[#fef3c7] text-[#92400e]"
                          : "bg-[#e0e7ff] text-[#3730a3]"
                      }`}
                    >
                      {person.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-[#101828] text-sm">{person.firstRequestTime}</td>
                  <td className="py-4 px-6 text-[#101828] text-sm font-medium">{person.requests}</td>
                  <td className="py-4 px-6 text-[#101828] text-sm flex gap-1">
                    {/* Badge para cada tipo presente */}
                    {person.typesRequested?.includes("video_call") && (
                      <Badge className="bg-[#dbeafe] text-[#1d4ed8] text-xs font-medium">Vídeo</Badge>
                    )}
                    {person.typesRequested?.includes("chat") && (
                      <Badge className="bg-[#f0fdf4] text-[#059669] text-xs font-medium">Chat</Badge>
                    )}
                    {person.typesRequested?.includes("dispatch") && (
                      <Badge className="bg-[#fef3c7] text-[#b45309] text-xs font-medium">Presencial</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botão Carregar mais */}
        {visibleCount < solicitantes.length && (
          <div className="flex justify-center mt-6 px-6">
            <Button variant="outline" onClick={handleLoadMore} className="text-[#344054] border-[#d0d5dd]">
              Carregar mais
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 