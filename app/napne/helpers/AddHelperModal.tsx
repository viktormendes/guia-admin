"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { toast } from "sonner"
import { z } from "zod"
import { getCookie } from "@/actions/cookies-actions"
import { useToast } from "@/hooks/use-toast"

interface AddHelperModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const schema = z.object({
  firstName: z.string().min(1, "Nome obrigatório"),
  lastName: z.string().min(1, "Sobrenome obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  occupation: z.enum(["professional", "volunteer"]),
  avatarUrl: z.string().url("URL inválida").optional().or(z.literal("")),
})

export default function AddHelperModal({ open, onOpenChange }: AddHelperModalProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [occupation, setOccupation] = useState("professional")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [k: string]: string }>({})
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("submit", { firstName, lastName, email, password, occupation, avatarUrl })
    setErrors({})
    const result = schema.safeParse({ firstName, lastName, email, password, occupation, avatarUrl })
    if (!result.success) {
      const fieldErrors: { [k: string]: string } = {}
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios corretamente.",
        variant: "destructive"
      })
      return
    }
    setLoading(true)
    try {
      const jwt = await getCookie("jwt")
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/helper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
        },
        body: JSON.stringify({ firstName, lastName, email, password, occupation, avatarUrl: avatarUrl || undefined })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Erro ao adicionar ajudante")
      }
      toast({
        title: "Sucesso",
        description: "Ajudante adicionado com sucesso!"
      })
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
      setOccupation("professional")
      setAvatarUrl("")
      setErrors({})
      onOpenChange(false)
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Ajudante</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input placeholder="Nome" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              {errors.firstName && <span className="text-xs text-red-500 ml-1">{errors.firstName}</span>}
            </div>
            <div className="flex-1">
              <Input placeholder="Sobrenome" value={lastName} onChange={e => setLastName(e.target.value)} required />
              {errors.lastName && <span className="text-xs text-red-500 ml-1">{errors.lastName}</span>}
            </div>
          </div>
          <div>
            <Input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
            {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email}</span>}
          </div>
          <div>
            <Input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
            {errors.password && <span className="text-xs text-red-500 ml-1">{errors.password}</span>}
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-[#344054]">Tipo:</label>
            <select value={occupation} onChange={e => setOccupation(e.target.value)} className="border rounded-md px-3 py-2 text-[#344054] border-[#d0d5dd] bg-white">
              <option value="professional">Profissional</option>
              <option value="volunteer">Voluntário</option>
            </select>
            {errors.occupation && <span className="text-xs text-red-500 ml-1">{errors.occupation}</span>}
          </div>
          <div>
            <Input placeholder="Avatar URL (opcional)" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} />
            {errors.avatarUrl && <span className="text-xs text-red-500 ml-1">{errors.avatarUrl}</span>}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-green-700 text-white">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 