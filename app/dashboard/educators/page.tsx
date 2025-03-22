// Adicionar tratamento de erros e configuração para renderização dinâmica
import EducatorsContent from "@/components/educator-content"
import { fetchEducators } from "@/actions/educator-actions"

// Forçar renderização dinâmica para evitar problemas de pré-renderização
export const dynamic = "force-dynamic"

export default async function EducatorsPage() {
  try {
    const educators = await fetchEducators()

    return <EducatorsContent initialEducators={educators} />
  } catch (error) {
    console.error("Error loading educators page:", error)
    // Renderizar um estado de fallback em caso de erro
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Erro ao carregar dados</h2>
          <p className="text-muted-foreground">Tente novamente mais tarde</p>
        </div>
      </div>
    )
  }
}

