"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import type { FC } from "react"

interface HelperData {
  month: string
  video: number
  chat: number
  presential: number
}

interface StackedBarChartProps {
  data: HelperData[]
}

export const StackedBarChart: FC<StackedBarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.video + d.chat + d.presential), 1)
  const topValue = Math.ceil(maxValue / 50) * 50
  const yAxisLabels = Array.from({ length: 6 }, (_, i) => Math.round((i * topValue) / 5))

  return (
    <Card className="bg-white border-[#eaecf0] w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#101828] text-lg font-medium">Ajudantes</CardTitle>
          <Button variant="outline" size="sm" className="bg-white border-[#d0d5dd] text-[#344054] text-sm">
            Mês
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#a7f3d0] rounded-sm"></div>
              <span className="text-[#667085]">Vídeo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#10b981] rounded-sm"></div>
              <span className="text-[#667085]">Chat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#065f46] rounded-sm"></div>
              <span className="text-[#667085]">Presencial</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-[#667085] -ml-14 w-14 items-end">
            {[...yAxisLabels].reverse().map((label, idx) => (
              <span key={idx}>{label}</span>
            ))}
          </div>
          <div className="ml-8 h-64 flex items-end justify-between space-x-4">
            {data.map((d, index) => {
              const videoHeight = (d.video / topValue) * 240
              const chatHeight = (d.chat / topValue) * 240
              const presencialHeight = (d.presential / topValue) * 240
              return (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-full max-w-12 flex flex-col">
                    <div className="bg-[#a7f3d0] w-full rounded-t-sm" style={{ height: `${videoHeight}px` }}></div>
                    <div className="bg-[#10b981] w-full" style={{ height: `${chatHeight}px` }}></div>
                    <div className="bg-[#065f46] w-full rounded-b-sm" style={{ height: `${presencialHeight}px` }}></div>
                  </div>
                  <span className="text-xs text-[#667085] mt-2">{d.month}</span>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-4">
            <span className="text-sm text-[#667085]">Mês</span>
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 -ml-8">
            <span className="text-sm text-[#667085]">Ajudantes Ativos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 