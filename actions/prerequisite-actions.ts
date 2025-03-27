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

const API_URL = process.env.NEXT_PUBLIC_URL_BACKEND;

/**
 * Busca todos os pré-requisitos
 */
export async function fetchPrerequisites(): Promise<
  { id: number; disciplineId: number; prerequisiteId: number }[]
> {
  try {
    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");
    const res = await fetch(`${API_URL}/prerequisites`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error(`Erro: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Erro ao buscar pré-requisitos:", error);
    return [];
  }
}

/**
 * Cria um novo pré-requisito
 */
export async function createPrerequisite(
  data: PrerequisiteFormValues
): Promise<boolean> {
  try {
    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");
    // Validar dados com Zod
    const validatedData = prerequisiteSchema.parse(data);

    const res = await fetch(`${API_URL}/prerequisites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(validatedData),
    });

    if (!res.ok) {
      throw new Error(`Erro: ${res.status}`);
    }

    revalidatePath("/dashboard/disciplines");
    return true;
  } catch (error) {
    console.error("Erro ao criar pré-requisito:", error);
    return false;
  }
}

/**
 * Remove um pré-requisito
 */
export async function deletePrerequisite(
  prerequisiteId: number
): Promise<boolean> {
  try {
    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");
    const res = await fetch(
      `${API_URL}/prerequisites/${prerequisiteId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    revalidatePath("/dashboard/disciplines");
    return true;
  } catch (error) {
    console.error(`Erro ao excluir pré-requisito:`, error);
    return false;
  }
}
