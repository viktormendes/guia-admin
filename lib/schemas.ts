import { z } from "zod"

// Schema para criação e atualização de disciplinas
export const disciplineSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  semester: z.number().int().min(1, "Semestre deve ser maior que 0"),
  workload: z.union([z.literal(40), z.literal(80)]),
  type: z.union([z.literal("OBG"), z.literal("OPT")]),
  code: z.string().min(1, "Código é obrigatório"),
})

export type DisciplineFormValues = z.infer<typeof disciplineSchema>

// Schema para criação de pré-requisitos
export const prerequisiteSchema = z.object({
  disciplineId: z.number().int().positive(),
  prerequisiteId: z.number().int().positive(),
})

export type PrerequisiteFormValues = z.infer<typeof prerequisiteSchema>

// Schema para criação e atualização de horários
export const timetableSchema = z.object({
  disciplineId: z.number().int().positive(),
  educatorId: z.number().int().positive(),
  days: z.string().min(1, "Dias são obrigatórios"),
  hours: z.string().min(1, "Horas são obrigatórias"),
})

export type TimetableFormValues = z.infer<typeof timetableSchema>

// Schema para criação e atualização de horários
export const educatorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  lattesLink: z.string().optional(),
})

export type EducatorFormValues = z.infer<typeof educatorSchema>

