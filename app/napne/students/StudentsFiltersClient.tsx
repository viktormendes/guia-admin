"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter, Plus } from "lucide-react"
import StudentsClientActions from "./StudentsClientActions"

interface Props {
  searchDefault: string
  page: number
}

export default function StudentsFiltersClient({ searchDefault, page }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchDefault)
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
      router.push(`?${params.toString()}`)
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mt-2">
      <div className="flex flex-1 gap-2">
        <Input
          placeholder="Procure por nome ou email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-md bg-white border-[#d0d5dd] text-[#101828]"
        />
      </div>
      <StudentsClientActions />
    </div>
  )
} 