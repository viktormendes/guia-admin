import EducatorsContent from "@/components/educator-content"
import { fetchEducators } from "@/actions/educator-actions"
import { fetchClassrooms } from "@/actions/rooms-actions"
import ClassroomsContent from "@/components/classroom-content"
import { fetchBlocks } from "@/actions/block-actions"
import { fetchUserData } from "@/actions/discipline-actions"
import BlocksContent from "@/components/blocks-content"

export const dynamic = "force-dynamic"

export default async function BlocksPage() {
  try {
    const [classrooms, blocks, userData] = await Promise.all([
      fetchClassrooms(),
      fetchBlocks(),
      fetchUserData(),
    ])

    if (!classrooms || !blocks) {
      throw new Error("Erro ao carregar dados")
    }

    return <BlocksContent initialBlocks={blocks} initialUserData={userData} />
  } catch (error) {
    console.error("Erro ao carregar página de salas:", error)
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

