export const dynamic = 'force-dynamic'
import { fetchData } from "@/lib/api"
import { DataTableComponent } from "./DataTableComponent"
import { LineChartCard } from "./LineChartCard"
import { StackedBarChart } from "./StackedBarChart"
import { CircularProgressChart } from "./CircularProgressChart"

export default async function NapneDashboardPage() {
  const data = await fetchData<any>(`${process.env.NEXT_PUBLIC_URL_BACKEND}/help/analytics/dashboard`)

  // Transforma o objeto byHour em array de objetos { hour, presential, chat, video }
  const byHourArray = Object.entries(data.requests.byHour || {}).map(([hour, values]) => ({
    hour,
    ...(values as any),
  }))

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Topo: 3 gráficos de linha (cards) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <LineChartCard
          title="Presencial"
          data={byHourArray}
          type="presential"
        />
        <LineChartCard
          title="Chat"
          data={byHourArray}
          type="chat"
        />
        <LineChartCard
          title="Vídeo"
          data={byHourArray}
          type="video"
        />
      </div>
      {/* Meio: Gráfico de barras e pizza */}
      <div className="flex flex-col md:flex-row gap-4">
        <StackedBarChart data={data.activeHelpers} />
        <CircularProgressChart byType={data.requests.byType} total={data.requests.total} />
      </div>
      {/* Tabela de solicitações */}
      <DataTableComponent solicitantes={data.todayRequesters} />
    </div>
  )
} 