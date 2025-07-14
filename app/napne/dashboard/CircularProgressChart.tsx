"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import type { FC } from "react"

interface ByType {
  video: number
  chat: number
  presential: number
}

interface CircularProgressChartProps {
  byType: ByType
  total: number
}

export const CircularProgressChart: FC<CircularProgressChartProps> = ({ byType, total }) => {
  const videoValue = byType.video || 0
  const chatValue = byType.chat || 0
  const presencialValue = byType.presential || 0
  const totalValue = total || (videoValue + chatValue + presencialValue)

  // Calculate percentages for the circle segments
  const videoPercentage = (videoValue / totalValue) * 100
  const chatPercentage = (chatValue / totalValue) * 100
  const presencialPercentage = (presencialValue / totalValue) * 100

  const radius = 45
  const circumference = 2 * Math.PI * radius

  // Calculate stroke dash arrays for each segment
  const videoStroke = (videoPercentage / 100) * circumference
  const chatStroke = (chatPercentage / 100) * circumference
  const presencialStroke = (presencialPercentage / 100) * circumference

  return (
    <Card className="bg-white border-[#eaecf0] w-full max-w-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#101828] text-lg font-medium">Solicitações</CardTitle>
          <Button variant="outline" size="sm" className="bg-white border-[#d0d5dd] text-[#344054] text-sm">
            Mês
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-8">
        <div className="relative w-56 h-56 mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circles */}
            <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f9ff" strokeWidth="12" />
            <circle cx="60" cy="60" r="38" fill="none" stroke="#e0f2fe" strokeWidth="8" />
            <circle cx="60" cy="60" r="26" fill="none" stroke="#f0fdf4" strokeWidth="6" />

            {/* Progress segments */}
            {/* Presencial (darkest green) - outermost */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#065f46"
              strokeWidth="12"
              strokeDasharray={`${presencialStroke} ${circumference - presencialStroke}`}
              strokeLinecap="round"
              strokeDashoffset="0"
            />

            {/* Chat (medium green) - middle */}
            <circle
              cx="60"
              cy="60"
              r="38"
              fill="none"
              stroke="#059669"
              strokeWidth="8"
              strokeDasharray={`${chatStroke * 0.76} ${circumference * 0.76 - chatStroke * 0.76}`}
              strokeLinecap="round"
              strokeDashoffset="0"
            />

            {/* Video (lightest green) - innermost */}
            <circle
              cx="60"
              cy="60"
              r="26"
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeDasharray={`${videoStroke * 0.52} ${circumference * 0.52 - videoStroke * 0.52}`}
              strokeLinecap="round"
              strokeDashoffset="0"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-sm text-[#667085] mb-1">Solicitações</div>
            <div className="text-4xl font-semibold text-[#101828]">{totalValue}</div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
            <span className="text-[#667085]">{videoValue} Vídeo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#059669] rounded-full"></div>
            <span className="text-[#667085]">{chatValue} Chat</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#065f46] rounded-full"></div>
            <span className="text-[#667085]">{presencialValue} Presencial</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 