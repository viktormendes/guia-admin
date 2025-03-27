import { z } from "zod"
import { RoomType } from "@/app/dashboard/classrooms/types"

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
  disciplineId: z.number(),
  educatorId: z.number(),
  days: z.string(),
  hours: z.string(),
  roomId: z.number(),
})

export type TimetableFormValues = z.infer<typeof timetableSchema>

// Schema para criação e atualização de horários
export const educatorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  lattesLink: z.string().optional(),
})

export type EducatorFormValues = z.infer<typeof educatorSchema>

// Schema para criação e atualização de blocos
export const blockSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  status: z.enum(["ACTIVE", "INACTIVE", "BUILDING"], {
    required_error: "Status é obrigatório",
  }),
  number_of_floors: z.number().int().min(1, "Número de andares deve ser maior que 0"),
})

export type BlockFormValues = z.infer<typeof blockSchema>

// Schema para criação e atualização de salas
export const roomSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  floor: z.number().int().min(0, "Andar deve ser maior ou igual a 0"),
  block_id: z.number().int().positive("Bloco é obrigatório"),
  capacity: z.number().int().min(1, "Capacidade deve ser maior que 0"),
  type: z.nativeEnum(RoomType, {
    required_error: "Tipo é obrigatório",
  }),
})

export type RoomFormValues = z.infer<typeof roomSchema>

