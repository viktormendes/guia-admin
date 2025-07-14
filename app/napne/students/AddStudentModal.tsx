"use client"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { z } from "zod"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { createStudent } from "@/actions/student-actions"
import { getCookie } from "@/actions/cookies-actions"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command"
import { searchSpecialNeeds, searchSpecialNeedSubcategories } from "@/actions/student-actions"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

const genderOptions = [
  { label: "Masculino", value: "male" },
  { label: "Feminino", value: "female" },
  { label: "Outro", value: "other" },
]
const maritalStatusOptions = [
  { label: "Solteiro", value: "single" },
  { label: "Casado", value: "married" },
  { label: "Divorciado", value: "divorced" },
  { label: "Viúvo", value: "widowed" },
  { label: "Separado", value: "separated" },
]
const needDurationOptions = [
  { label: "Permanente", value: "permanent" },
  { label: "Temporária", value: "temporary" },
]

const steps = ["Documentação", "Necessidade", "Endereço"]

const schemaStep1 = z.object({
  firstName: z.string().min(1, "Nome obrigatório"),
  lastName: z.string().min(1, "Sobrenome obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha obrigatória"),
  phoneNumber: z.string().max(11, "Celular deve ter no máximo 11 dígitos").optional(),
  birthDate: z.string().optional(),
  cpf: z.string().max(11, "CPF deve ter no máximo 11 dígitos").optional(),
  rg: z.string().max(14, "RG deve ter no máximo 14 caracteres").optional(),
  gender: z.enum(["male", "female", "other"]),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed", "separated"]),
})
const schemaStep2 = z.object({
  specialNeedId: z.string().optional(),
  specialNeedSubcategoryId: z.string().optional(),
  observations: z.string().optional(),
  supportNotes: z.string().optional(),
  needDuration: z.enum(["permanent", "temporary"]).optional(),
})
const schemaStep3 = z.object({
  cep: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  isStudent: z.boolean().optional(),
})

const UF_LIST = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
]

export default function AddStudentModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [specialNeeds, setSpecialNeeds] = useState<any[]>([])
  const [specialNeedSubcategories, setSpecialNeedSubcategories] = useState<any[]>([])
  const [form, setForm] = useState<any>({
    gender: "male",
    maritalStatus: "single",
    isStudent: true,
  })
  const [errors, setErrors] = useState<any>({})
  const [cities, setCities] = useState<string[]>([])
  const [needSearch, setNeedSearch] = useState("")
  const [needLoading, setNeedLoading] = useState(false)
  const [needOptions, setNeedOptions] = useState<any[]>([])
  const [subcatSearch, setSubcatSearch] = useState("")
  const [subcatLoading, setSubcatLoading] = useState(false)
  const [subcatOptions, setSubcatOptions] = useState<any[]>([])
  const [needsList, setNeedsList] = useState<any[]>([])
  const needDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const subcatDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const [pendingCity, setPendingCity] = useState<string | null>(null)

  // Busca necessidades especiais (com JWT)
  useEffect(() => {
    async function fetchSpecialNeeds() {
      const jwt = await getCookie("jwt")
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/special-needs`, {
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
      })
      const data = await res.json()
      setSpecialNeeds(data.data || [])
    }
    if (step === 1 && specialNeeds.length === 0) {
      fetchSpecialNeeds()
    }
  }, [step])

  // Busca subcategorias ao selecionar necessidade (com JWT)
  useEffect(() => {
    async function fetchSubcategories() {
      if (form.specialNeedId) {
        const jwt = await getCookie("jwt")
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/special-need-subcategories?specialNeedId=${form.specialNeedId}`, {
          headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
        })
        const data = await res.json()
        setSpecialNeedSubcategories(data.data || [])
      } else {
        setSpecialNeedSubcategories([])
      }
    }
    fetchSubcategories()
  }, [form.specialNeedId])

  // Auto-preenchimento de endereço via CEP
  useEffect(() => {
    async function fetchCep() {
      if (form.cep && form.cep.length >= 8) {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${form.cep.replace(/\D/g, "")}/json/`)
          if (!res.ok) return
          const data = await res.json()
          if (data.erro) return
          setForm((f: any) => ({
            ...f,
            street: data.logradouro || f.street,
            neighborhood: data.bairro || f.neighborhood,
            state: data.uf || f.state,
            complement: data.complemento || f.complement
          }))
          // Buscar cidades e aguardar para setar cidade
          if (data.uf) {
            setPendingCity(data.localidade)
          }
        } catch {}
      }
    }
    fetchCep()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.cep])

  // Quando cidades mudarem e pendingCity existir, setar cidade
  useEffect(() => {
    if (pendingCity && cities.length > 0) {
      const cidadeViaCep = pendingCity.toLowerCase().trim()
      const cidadeMatch = cities.find((c: any) => c.toLowerCase().trim() === cidadeViaCep)
      if (cidadeMatch) {
        setForm((f: any) => ({ ...f, city: cidadeMatch }))
        setPendingCity(null)
      }
    }
  }, [cities, pendingCity])

  // Buscar cidades ao selecionar UF
  useEffect(() => {
    if (form.state) {
      fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${form.state}?providers=dados-abertos-br,gov`)
        .then(r => r.json())
        .then(data => setCities(data.map((c: any) => c.nome)))
    } else {
      setCities([])
    }
  }, [form.state])

  // Autocomplete necessidade
  useEffect(() => {
    if (needDebounceRef.current) clearTimeout(needDebounceRef.current)
    needDebounceRef.current = setTimeout(async () => {
      setNeedLoading(true)
      try {
        const data = await searchSpecialNeeds(needSearch)
        setNeedOptions(data)
      } catch {
        setNeedOptions([])
      }
      setNeedLoading(false)
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needSearch])

  // Autocomplete subcategoria
  useEffect(() => {
    if (!form.specialNeedId) return setSubcatOptions([])
    if (subcatDebounceRef.current) clearTimeout(subcatDebounceRef.current)
    subcatDebounceRef.current = setTimeout(async () => {
      setSubcatLoading(true)
      try {
        const data = await searchSpecialNeedSubcategories(form.specialNeedId, subcatSearch)
        setSubcatOptions(data)
      } catch {
        setSubcatOptions([])
      }
      setSubcatLoading(false)
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subcatSearch, form.specialNeedId])

  // Log para depuração do ciclo de vida
  useEffect(() => {
    console.log("[AddStudentModal] Render - step:", step, "open:", open)
  })

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target
    setForm((f: any) => ({ ...f, [name]: type === "checkbox" ? checked : value }))
  }

  // Handler para aceitar apenas números em campos específicos
  function handleNumberInput(e: any) {
    const { name, value } = e.target
    if (/^[0-9]*$/.test(value)) {
      setForm((f: any) => ({ ...f, [name]: value }))
    }
  }

  // Navegação livre: nextStep e goToStep não validam mais
  function nextStep() {
    setErrors({})
    setStep(s => Math.min(s + 1, steps.length - 1))
  }
  function prevStep() {
    setErrors({})
    setStep(s => Math.max(s - 1, 0))
  }
  function goToStep(idx: number) {
    setErrors({})
    setStep(idx)
  }

  // Impedir duplicidade de necessidade+subcategoria
  function handleAddNeed() {
    if (!form.specialNeedId || !form.specialNeedSubcategoryId) return
    // Impedir duplicidade de subcategoria (comparar necessidade+subcategoria)
    if (needsList.some(n => String(n.specialNeedId) === String(form.specialNeedId) && String(n.specialNeedSubcategoryId) === String(form.specialNeedSubcategoryId))) {
      toast.error("Essa necessidade e subcategoria já foram adicionadas!")
      return
    }
    const need = needOptions.find(n => String(n.id) === String(form.specialNeedId))
    const subcat = subcatOptions.find(s => String(s.id) === String(form.specialNeedSubcategoryId))
    setNeedsList((list: any[]) => [...list, {
      specialNeedId: need?.id,
      specialNeedName: need?.name,
      specialNeedSubcategoryId: subcat?.id,
      specialNeedSubcategoryName: subcat?.name
    }])
    setForm((f: any) => ({ ...f, specialNeedId: "", specialNeedSubcategoryId: "" }))
    setNeedSearch("")
    setSubcatSearch("")
  }
  function handleRemoveNeed(idx: number) {
    setNeedsList(list => list.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: any) {
    console.log('[AddStudentModal] handleSubmit chamado')
    e.preventDefault()
    setLoading(true)
    setErrors({})
    // Validação final - apenas verificar se os campos obrigatórios estão preenchidos
    const result1 = schemaStep1.safeParse(form)
    if (!result1.success) {
      const fieldErrors: any = {}
      result1.error.errors.forEach((err: any) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      setStep(0) // Redirecionar para Documentação
      toast.error("Preencha todos os campos obrigatórios corretamente.")
      setLoading(false)
      return
    }
    try {
      // Montar payload apenas com os campos válidos do DTO
      const {
        needPopoverOpen,
        subcatPopoverOpen,
        specialNeedId,
        specialNeedSubcategoryId,
        ...formClean
      }: {
        needPopoverOpen?: any,
        subcatPopoverOpen?: any,
        specialNeedId?: any,
        specialNeedSubcategoryId?: any,
        [key: string]: any
      } = form
      const payload = {
        ...formClean,
        specialNeedSubcategories: needsList.map(n => Number(n.specialNeedSubcategoryId))
      }
      console.log('[AddStudentModal] Enviando payload:', payload)
      await createStudent(payload)
      console.log('[AddStudentModal] Cadastro realizado com sucesso!')
      toast.success("Estudante cadastrado com sucesso!")
      onOpenChange(false)
      // Resetar tudo aqui após sucesso
      setForm({ gender: "male", maritalStatus: "single", isStudent: true })
      setStep(0)
      setNeedsList([])
      setErrors({})
    } catch (err: any) {
      console.error('[AddStudentModal] Erro ao cadastrar estudante:', err)
      if (err instanceof Error) {
        toast.error(err.message)
      } else if (typeof err === 'string') {
        toast.error(err)
      } else {
        toast.error('Erro desconhecido ao cadastrar estudante.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cadastrar um Usuário</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          {steps.map((label, idx) => (
            <Button
              key={label}
              variant={step === idx ? "default" : "outline"}
              className={step === idx ? "bg-green-700 text-white" : "bg-green-50 text-green-700"}
              onClick={() => goToStep(idx)}
              type="button"
            >
              {label}
            </Button>
          ))}
        </div>
        {step < steps.length - 1 ? (
          <div className="flex flex-col gap-4">
            {step === 0 && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input name="firstName" placeholder="Nome" value={form.firstName || ""} onChange={handleChange} required style={{ maxWidth: 320 }} />
                    {errors.firstName && <span className="text-red-500 text-xs ml-1">{errors.firstName}</span>}
                  </div>
                  <div>
                    <Input name="lastName" placeholder="Sobrenome" value={form.lastName || ""} onChange={handleChange} required style={{ maxWidth: 320 }} />
                    {errors.lastName && <span className="text-red-500 text-xs ml-1">{errors.lastName}</span>}
                  </div>
                  <div>
                    <Input name="email" placeholder="Email" value={form.email || ""} onChange={handleChange} required style={{ maxWidth: 320 }} />
                    {errors.email && <span className="text-red-500 text-xs ml-1">{errors.email}</span>}
                  </div>
                  <div>
                    <Input name="phoneNumber" placeholder="Número de celular" value={form.phoneNumber || ""} onChange={handleNumberInput} inputMode="numeric" pattern="[0-9]*" style={{ maxWidth: 320 }} />
                    {errors.phoneNumber && <span className="text-red-500 text-xs ml-1">{errors.phoneNumber}</span>}
                  </div>
                  <div>
                    <Input name="birthDate" type="date" placeholder="Data de Nascimento" value={form.birthDate || ""} onChange={handleChange} style={{ maxWidth: 320 }} />
                  </div>
                  <div>
                    <Input name="cpf" placeholder="CPF" value={form.cpf || ""} onChange={handleNumberInput} inputMode="numeric" pattern="[0-9]*" style={{ maxWidth: 320 }} />
                    {errors.cpf && <span className="text-red-500 text-xs ml-1">{errors.cpf}</span>}
                  </div>
                  <div>
                    <Input name="rg" placeholder="RG" value={form.rg || ""} onChange={handleNumberInput} inputMode="numeric" pattern="[0-9]*" style={{ maxWidth: 320 }} />
                    {errors.rg && <span className="text-red-500 text-xs ml-1">{errors.rg}</span>}
                  </div>
                  <div>
                    <Input name="password" type="password" placeholder="Senha" value={form.password || ""} onChange={handleChange} required style={{ maxWidth: 320 }} />
                    {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password}</span>}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-2">
                  <div className="flex gap-2 items-center flex-wrap">
                    <span>Sexo:</span>
                    <RadioGroup value={form.gender} onValueChange={(value) => setForm((f: any) => ({ ...f, gender: value }))} className="flex flex-row gap-2 flex-wrap">
                      {genderOptions.map(opt => (
                        <div key={opt.value} className="flex items-center gap-1">
                          <RadioGroupItem value={opt.value} id={opt.value} />
                          <label htmlFor={opt.value} className={form.gender === opt.value ? "font-semibold text-green-700" : "text-gray-700"}>{opt.label}</label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.gender && <span className="text-red-500 text-xs ml-1">{errors.gender}</span>}
                  </div>
                  <div className="flex gap-2 items-center flex-wrap">
                    <span>Estado Civil:</span>
                    <RadioGroup value={form.maritalStatus} onValueChange={(value) => setForm((f: any) => ({ ...f, maritalStatus: value }))} className="flex flex-row gap-2 flex-wrap">
                      {maritalStatusOptions.map(opt => (
                        <div key={opt.value} className="flex items-center gap-1">
                          <RadioGroupItem value={opt.value} id={opt.value} />
                          <label htmlFor={opt.value} className={form.maritalStatus === opt.value ? "font-semibold text-green-700" : "text-gray-700"}>{opt.label}</label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.maritalStatus && <span className="text-red-500 text-xs ml-1">{errors.maritalStatus}</span>}
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Necessidade</label>
                      <Popover open={form.needPopoverOpen} onOpenChange={open => setForm((f: any) => ({ ...f, needPopoverOpen: open }))}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            {needOptions.find(n => n.id == form.specialNeedId)?.name || "Selecione ou busque a necessidade"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar necessidade..." value={needSearch} onValueChange={setNeedSearch} />
                            <CommandList>
                              {needLoading ? (
                                <CommandItem disabled>Carregando...</CommandItem>
                              ) : needOptions.length === 0 ? (
                                <CommandEmpty>Nenhuma necessidade encontrada</CommandEmpty>
                              ) : (
                                needOptions.map((n) => (
                                  <CommandItem key={n.id} value={n.id} onSelect={() => {
                                    setForm((f: any) => ({ ...f, specialNeedId: n.id, needPopoverOpen: false }))
                                    setNeedSearch("")
                                  }}>{n.name}</CommandItem>
                                ))
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Subcategoria</label>
                      <Popover open={form.subcatPopoverOpen} onOpenChange={open => setForm((f: any) => ({ ...f, subcatPopoverOpen: open }))}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between" disabled={!form.specialNeedId}>
                            {subcatOptions.find(s => s.id == form.specialNeedSubcategoryId)?.name || "Selecione ou busque a subcategoria"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar subcategoria..." value={subcatSearch} onValueChange={setSubcatSearch} disabled={!form.specialNeedId} />
                            <CommandList>
                              {subcatLoading ? (
                                <CommandItem disabled>Carregando...</CommandItem>
                              ) : subcatOptions.length === 0 ? (
                                <CommandEmpty>Nenhuma subcategoria encontrada</CommandEmpty>
                              ) : (
                                subcatOptions.map((s) => (
                                  <CommandItem key={s.id} value={s.id} onSelect={() => {
                                    // Impedir duplicidade aqui também
                                    if (needsList.some(n => String(n.specialNeedId) === String(form.specialNeedId) && String(n.specialNeedSubcategoryId) === String(s.id))) {
                                      toast.error("Essa necessidade e subcategoria já foram adicionadas!")
                                      return
                                    }
                                    setForm((f: any) => ({ ...f, specialNeedSubcategoryId: s.id, subcatPopoverOpen: false }))
                                    // Adiciona necessidade+subcategoria ao selecionar
                                    const need = needOptions.find(n => n.id == form.specialNeedId)
                                    setNeedsList((list: any[]) => [...list, {
                                      specialNeedId: need?.id,
                                      specialNeedName: need?.name,
                                      specialNeedSubcategoryId: s.id,
                                      specialNeedSubcategoryName: s.name
                                    }])
                                    setForm((f: any) => ({ ...f, specialNeedId: "", specialNeedSubcategoryId: "" }))
                                    setNeedSearch("")
                                    setSubcatSearch("")
                                  }}>{s.name}</CommandItem>
                                ))
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Input name="observations" placeholder="Observações" value={form.observations || ""} onChange={handleChange} />
                    <Input name="supportNotes" placeholder="Notas de Apoio" value={form.supportNotes || ""} onChange={handleChange} />
                    <div>
                      <label className="block text-sm mb-1">Tempo de necessidade</label>
                      <Select value={form.needDuration || ""} onValueChange={(value) => setForm((f: any) => ({ ...f, needDuration: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {needDurationOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                {/* BADGES DE NECESSIDADE */}
                {needsList.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {needsList.map((n, idx) => (
                      <Badge key={idx} className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        {n.specialNeedName}
                        {n.specialNeedSubcategoryName && <span className="ml-1 text-xs text-gray-600">({n.specialNeedSubcategoryName})</span>}
                        <button type="button" className="ml-2 text-red-500 hover:text-red-700" onClick={() => handleRemoveNeed(idx)}>×</button>
                      </Badge>
                    ))}
                  </div>
                )}
              </>
            )}
            <DialogFooter className="flex flex-row justify-between mt-4">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={prevStep}>Voltar</Button>
              ) : <span />}
              <Button type="button" onClick={() => nextStep()} className="bg-green-700 text-white">Ir para {steps[step + 1]}</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="cep" placeholder="CEP" value={form.cep || ""} onChange={handleChange} />
                <Select value={form.state || ""} onValueChange={value => setForm((f: any) => ({ ...f, state: value, city: "" }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {UF_LIST.map(uf => (
                      <SelectItem key={uf.value} value={uf.value}>{uf.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={form.city || ""} onValueChange={value => setForm((f: any) => ({ ...f, city: value }))} disabled={!form.state}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input name="neighborhood" placeholder="Bairro" value={form.neighborhood || ""} onChange={handleChange} />
                <Input name="street" placeholder="Rua" value={form.street || ""} onChange={handleChange} />
                <Input name="number" placeholder="Número" value={form.number || ""} onChange={handleNumberInput} inputMode="numeric" pattern="[0-9]*" />
                <Input name="complement" placeholder="Complemento" value={form.complement || ""} onChange={handleChange} />
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" name="isStudent" checked={form.isStudent || false} onChange={handleChange} />
                  <span>É um aluno</span>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-row justify-between mt-4">
              <Button type="button" variant="outline" onClick={prevStep}>Voltar</Button>
              <Button type="submit" className="bg-green-700 text-white" disabled={loading}>{loading ? "Cadastrando..." : "Concluir Cadastro"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 