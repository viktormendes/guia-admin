'use server';

import { Block } from '@/app/dashboard/classrooms/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_URL_BACKEND;

export async function fetchBlocks(): Promise<Block[]> {
  const token = (await cookies()).get("jwt")?.value;
  if (!token) throw new Error("Token JWT não encontrado");
  try {
    const res = await fetch(`${API_URL}/blocks`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Erro: ${res.status}`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Dados recebidos não são um array");
    }
    return data;
  } catch (error) {
    console.error("Erro ao buscar blocos:", error);
    throw error;
  }
}

export async function getBlock(id: number): Promise<Block> {
  const token = (await cookies()).get("jwt")?.value;
  if (!token) throw new Error("Token JWT não encontrado");
  try {
    const response = await fetch(`${API_URL}/blocks/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch block');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching block:', error);
    throw error;
  }
}

export async function createBlock(data: { description: string; status: string, number_of_floors:number }): Promise<Block> {
  const token = (await cookies()).get("jwt")?.value;
  if (!token) throw new Error("Token JWT não encontrado");
  try {
    const response = await fetch(`${API_URL}/blocks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create block');
    }

    revalidatePath('/dashboard/blocks');
    return response.json();
  } catch (error) {
    console.error('Error creating block:', error);
    throw error;
  }
}

export async function updateBlock(id: number, data: { description?: string; status?: string, number_of_floors:number }): Promise<Block> {
  const token = (await cookies()).get("jwt")?.value;
  if (!token) throw new Error("Token JWT não encontrado");
  try {
    const response = await fetch(`${API_URL}/blocks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update block');
    }

    revalidatePath('/dashboard/blocks');
    return response.json();
  } catch (error) {
    console.error('Error updating block:', error);
    throw error;
  }
}

export async function deleteBlock(id: number): Promise<void> {
  const token = (await cookies()).get("jwt")?.value;
  if (!token) throw new Error("Token JWT não encontrado");
  try {
    const response = await fetch(`${API_URL}/blocks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete block');
    }

    revalidatePath('/dashboard/blocks');
  } catch (error) {
    console.error('Error deleting block:', error);
    throw error;
  }
} 