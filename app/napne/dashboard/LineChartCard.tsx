"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Info } from "lucide-react"
import type { FC } from "react"

interface LineChartCardProps {
  title: string
  data: Array<{ hour: string; presential: number; chat: number; video: number }>
  type: "presential" | "chat" | "video"
}

export const LineChartCard: FC<LineChartCardProps> = ({ title, data, type }) => {
  // Garante que data é um array
  const safeData = Array.isArray(data) ? data : []
  // Extrai os labels e valores conforme o tipo
  const timeLabels = safeData.map((item) => item.hour)
  const values = safeData.map((item) => item[type])
  // Soma total do tipo no dia
  const totalValue = values.reduce((acc, v) => acc + v, 0)
  // Crescimento em relação à última hora
  const last = values[values.length - 1] ?? 0
  const penultimate = values.length > 1 ? values[values.length - 2] : 0
  const growthPercent = penultimate !== 0 ? (((last - penultimate) / penultimate) * 100).toFixed(1) : (last !== 0 ? 100 : 0)
  const diff = last - penultimate

  // Gera path SVG dinâmico (simplificado, pode ser melhorado)
  const max = Math.max(...values, 1)
  const points = values.map((v, i) => `${(i / (values.length - 1)) * 400},${80 - (v / max) * 50}`).join(" ")

  return (
    <Card className="bg-white border-[#eaecf0] w-full max-w-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-[#101828] text-lg font-medium">{title}</h3>
            <Info className="h-4 w-4 text-[#98a2b3]" />
          </div>
          <div className="flex items-center space-x-2">
            <div className={
              `flex items-center space-x-1 text-sm font-medium ` +
              (diff > 0 ? "text-[#12b76a]" : diff < 0 ? "text-red-500" : "text-[#98a2b3]")
            }>
              <TrendingUp className="h-4 w-4" />
              <span>{diff > 0 ? `+${growthPercent}%` : `${growthPercent}%`}</span>
            </div>
          </div>
        </div>
        <div className="flex items-baseline justify-between mb-6">
          <div className="text-4xl font-semibold text-[#101828]">{totalValue}</div>
          <div className="text-[#667085] text-lg">{diff > 0 ? `+${diff}` : diff}</div>
        </div>
        <div className="relative h-20 mb-4">
          <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* Área de fundo (simples, baseada nos valores) */}
            <polyline
              fill="url(#areaGradient)"
              stroke="none"
              points={`0,80 ${points} 400,80`}
            />
            {/* Linha principal */}
            <polyline
              fill="none"
              stroke="#1f2937"
              strokeWidth="2"
              strokeLinecap="round"
              points={points}
            />
            {/* Ponto final */}
            <circle cx="400" cy={80 - (last / max) * 50} r="3" fill="#1f2937" />
          </svg>
        </div>
        <div className="flex justify-between text-xs text-[#667085]">
          {timeLabels.map((time, index) => (
            <span key={index}>{time}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 