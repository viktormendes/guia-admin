"use server";

import type { IDiscipline } from "@/types/Discipline";
import { revalidatePath } from "next/cache";
import {
  disciplineSchema,
  educatorSchema,
  prerequisiteSchema,
  timetableSchema,
} from "@/lib/schemas";
import type {
  DisciplineFormValues,
  EducatorFormValues,
  PrerequisiteFormValues,
  TimetableFormValues,
} from "@/lib/schemas";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_URL_BACKEND;

/**
 * Busca todos os horários
 */
export async function fetchEducators(): Promise<
  { id: number; name: string; lattesLink: string }[]
> {
  try {
    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");

    const res = await fetch(`${API_URL}/educator`, {
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

export async function createEducator(
  data: EducatorFormValues
): Promise<boolean> {
  try {
    // Validar dados com Zod
    const validatedData = educatorSchema.parse(data);
    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");

    const res = await fetch(`${API_URL}/educator`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    revalidatePath("/dashboard/disciplines");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// actions/educator-actions.ts
export async function updateEducator(
  educatorId: number,
  data: EducatorFormValues
): Promise<boolean> {
  try {
    const validatedData = educatorSchema.parse(data);
    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");
    const res = await fetch(`${API_URL}/educator/${educatorId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(validatedData),
    });
    revalidatePath("/dashboard/educators");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar educador:", error);
    return false;
  }
}

export async function deleteEducator(educatorId: number): Promise<boolean> {
  try {
    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");
    const res = await fetch(`${API_URL}/educator/${educatorId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    revalidatePath("/dashboard/disciplines");
    return true;
  } catch (error) {
    console.error(`Erro ao excluir pré-requisito:`, error);
    return false;
  }
}
