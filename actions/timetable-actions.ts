"use server";

import type { IDiscipline } from "@/types/Discipline";
import { revalidatePath } from "next/cache";
import {
  disciplineSchema,
  prerequisiteSchema,
  timetableSchema,
} from "@/lib/schemas";
import type {
  DisciplineFormValues,
  PrerequisiteFormValues,
  TimetableFormValues,
} from "@/lib/schemas";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_URL_BACKEND

/**
 * Busca todos os horários
 */
export async function fetchTimetables(): Promise<
  {
    id: number;
    disciplineId: number;
    days: string;
    hours: string;
    educator: { id: number; name: string; lattesLink: string };
  }[]
> {
  try {
    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");
    const res = await fetch(`${API_URL}/timetable`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Erro: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Erro ao buscar horários:", error);
    return [];
  }
}

/**
 * Cria um novo horário
 */
export async function createTimetable(data: TimetableFormValues): Promise<any> {
  try {
    // Validar dados com Zod
    const validatedData = timetableSchema.parse(data);

    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");

    const res = await fetch(`${API_URL}/timetable`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    if (!res.ok) {
      throw new Error(`Erro: ${res.status}`);
    }

    const newTimetable = await res.json();
    revalidatePath("/dashboard/disciplines");
    revalidatePath("/dashboard/timetable");
    return newTimetable;
  } catch (error) {
    console.error("Erro ao criar horário:", error);
    return null;
  }
}

/**
 * Atualiza um horário existente
 */
export async function updateTimetable(
  id: number,
  data: Partial<TimetableFormValues>
): Promise<any> {
  try {
    // Validar dados com Zod (parcial para permitir atualizações parciais)
    const validatedData = timetableSchema.partial().parse(data);
    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");

    const res = await fetch(`${API_URL}/timetable/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    if (!res.ok) {
      throw new Error(`Erro: ${res.status}`);
    }

    const updatedTimetable = await res.json();
    revalidatePath("/dashboard/disciplines");
    revalidatePath("/dashboard/timetable");
    return updatedTimetable;
  } catch (error) {
    console.error(`Erro ao atualizar horário ${id}:`, error);
    return null;
  }
}

/**
 * Remove um horário
 */
export async function deleteTimetable(id: number): Promise<boolean> {
  try {
    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");
    const res = await fetch(`${API_URL}/timetable/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Erro: ${res.status}`);
    }

    revalidatePath("/dashboard/disciplines");
    revalidatePath("/dashboard/timetable");
    return true;
  } catch (error) {
    console.error(`Erro ao excluir horário ${id}:`, error);
    return false;
  }
}
