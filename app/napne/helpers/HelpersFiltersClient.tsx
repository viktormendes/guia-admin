"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter, Plus } from "lucide-react"
import HelpersClientActions from "./HelpersClientActions"

interface Props {
  searchDefault: string
  occupationDefault: string
  page: number
}

export default function HelpersFiltersClient({ searchDefault, occupationDefault, page }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchDefault)
  const [occupation, setOccupation] = useState(occupationDefault || "todos")
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Atualiza search na URL com debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (search) {
        params.set("search", search)
      } else {
        params.delete("search")
      }
      params.set("page", "1") // Sempre volta para página 1 ao pesquisar
      if (occupation && occupation !== "todos") {
        params.set("occupation", occupation)
      } else {
        params.delete("occupation")
      }
      router.push(`?${params.toString()}`)
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // Atualiza occupation na URL imediatamente
  const handleOccupationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setOccupation(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "todos") {
      params.set("occupation", value)
    } else {
      params.delete("occupation")
    }
    params.set("page", "1") // Sempre volta para página 1 ao filtrar
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mt-2">
      <div className="flex flex-1 gap-2">
        <Input
          placeholder="Procure por nome ou email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-md bg-white border-[#d0d5dd] text-[#101828]"
        />
        <select
          value={occupation}
          onChange={handleOccupationChange}
          className="border rounded-md px-3 py-2 text-[#344054] border-[#d0d5dd] bg-white hover:cursor-pointer"
        >
          <option value="todos">Todos</option>
          <option value="professional">Profissional</option>
          <option value="volunteer">Voluntário</option>
        </select>
      </div>
      <HelpersClientActions />
    </div>
  )
} 