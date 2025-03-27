'use server';

import { CreateRoomDto, Room, UpdateRoomDto } from '@/app/dashboard/classrooms/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_URL_BACKEND

export async function fetchClassrooms(): Promise<Room[]> {
    try {
        const token = (await cookies()).get("jwt")?.value;
        if (!token) throw new Error("Token JWT não encontrado");
        const res = await fetch(`${API_URL}/rooms`, {
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
        console.error("Erro ao buscar salas:", error);
        throw error;
      }
}

export async function getRoom(id: number): Promise<Room> {
    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");
  try {
    const response = await fetch(`${API_URL}/rooms/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch room');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching room:', error);
    throw error;
  }
}

export async function createRoom(data: CreateRoomDto): Promise<Room> {
  const token = (await cookies()).get("jwt")?.value;
  if (!token) throw new Error("Token JWT não encontrado");
  try {
    const response = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create room');
    }

    revalidatePath('/dashboard/classrooms');
    return response.json();
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
}

export async function updateRoom(id: number, data: UpdateRoomDto): Promise<Room> {
  const token = (await cookies()).get("jwt")?.value;
  if (!token) throw new Error("Token JWT não encontrado");
  try {
    const response = await fetch(`${API_URL}/rooms/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update room');
    }

    revalidatePath('/dashboard/classrooms');
    return response.json();
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
}

export async function deleteRoom(id: number): Promise<void> {
  const token = (await cookies()).get("jwt")?.value;
  if (!token) throw new Error("Token JWT não encontrado");
  try {
    const response = await fetch(`${API_URL}/rooms/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete room');
    }

    revalidatePath('/dashboard/classrooms');
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
}

export async function getRoomsByBlock(blockId: number): Promise<Room[]> {
    const token = (await cookies()).get("jwt")?.value;
    if (!token) throw new Error("Token JWT não encontrado");
    try {
    const response = await fetch(`${API_URL}/rooms/block/${blockId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rooms by block');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching rooms by block:', error);
    throw error;
  }
} 