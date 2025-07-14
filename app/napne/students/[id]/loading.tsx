import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col gap-2 px-8 pt-8 pb-2">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="flex flex-col gap-6 px-8 pb-8">
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informações detalhadas */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Histórico de atividades */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Skeleton className="h-8 w-8 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 