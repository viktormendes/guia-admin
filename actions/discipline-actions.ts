"use server";

import type { IDiscipline } from "@/types/Discipline";
import { revalidatePath, revalidateTag } from "next/cache";
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
import { fetchData } from "@/lib/api";
import { getCookie } from "./cookies-actions";
import { cookies } from "next/headers";

const API_URL = `${process.env.NEXT_PUBLIC_URL_BACKEND}`;

/**
 * Busca todas as disciplinas
 */
export async function fetchAllDisciplines(): Promise<IDiscipline[]> {
  return fetchData<IDiscipline[]>(`${API_URL}/discipline`, {
    cache: "no-store",
    next: { tags: ["discipline"] },
  });
}

/**
 * Busca uma disciplina pelo ID
 */
export async function fetchDisciplineById(
  id: number
): Promise<IDiscipline | null> {
  return fetchData<IDiscipline>(`${API_URL}/discipline/${id}`, {
    cache: "no-store",
    next: { tags: ["discipline"] },
  });
}

/**
 * Busca todas as disciplinas com horários
 */
export async function fetchDisciplinesWithHours(): Promise<IDiscipline[]> {
  return fetchData<IDiscipline[]>(`${API_URL}/discipline/hours`, {
    cache: "no-store",
    next: { tags: ["discipline"] },
  });
}

/**
 * Cria uma nova disciplina
 */
export async function createDiscipline(data: DisciplineFormValues): Promise<IDiscipline | null> {
  try {
    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");

    const validatedData = disciplineSchema.parse(data);

    const response = await fetch(`${API_URL}/discipline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro: ${errorData.message || response.status}`);
    }

    const newDiscipline = await response.json();

    // ✅ Garante que o revalidateTag só acontece após a criação ser bem-sucedida
    revalidateTag("disciplines");

    return newDiscipline;
  } catch (error) {
    console.error("Erro ao criar disciplina:", error);
    return null;
  }
}

/**
 * Atualiza uma disciplina existente
 */
export async function updateDiscipline(
  id: number,
  data: Partial<DisciplineFormValues>
): Promise<IDiscipline | null> {
  try {
    const token = (await cookies()).get("jwt")?.value;

    if (!token) {
      throw new Error("Token JWT não encontrado");
    }

    // Valida os dados com Zod (parcial para permitir atualizações parciais)
    const validatedData = disciplineSchema.partial().parse(data);

    const response = await fetch(`${API_URL}/discipline/${id}`, {
      method: "PATCH", // Use PATCH para atualizações parciais
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro: ${errorData.message || response.status}`);
    }

    const updatedDiscipline = await response.json();
    revalidatePath("/dashboard/disciplines"); // Revalida o cache
    return updatedDiscipline;
  } catch (error) {
    console.error(`Erro ao atualizar disciplina ${id}:`, error);
    return null;
  }
}

/**
 * Remove uma disciplina
 */
export async function deleteDiscipline(id: number): Promise<boolean> {
  try {
    const token = (await cookies()).get("jwt")?.value;

    if (!token) {
      throw new Error("Token JWT não encontrado");
    }

    const response = await fetch(`${API_URL}/discipline/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    // Revalida o cache para atualizar a interface
    revalidatePath("/dashboard/disciplines");
    return true;
  } catch (error) {
    console.error(`Erro ao excluir disciplina ${id}:`, error);
    return false;
  }
}