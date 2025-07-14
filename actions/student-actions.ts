'use server'
import { getCookie } from './cookies-actions'
import { revalidatePath } from 'next/cache'

export async function createStudent(data: any) {
  const jwt = await getCookie('jwt')
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/student`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Erro ao cadastrar estudante')
  }
  await revalidatePath('/napne/students')
  return await res.json()
}

export async function searchSpecialNeeds(search: string) {
  const jwt = await getCookie('jwt')
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/special-needs?search=${encodeURIComponent(search)}`, {
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
  })
  if (!res.ok) throw new Error('Erro ao buscar necessidades')
  return (await res.json()).data || []
}

export async function searchSpecialNeedSubcategories(specialNeedId: string, search: string) {
  const jwt = await getCookie('jwt')
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/special-need-subcategories?specialNeedId=${specialNeedId}&search=${encodeURIComponent(search)}`, {
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
  })
  if (!res.ok) throw new Error('Erro ao buscar subcategorias')
  return (await res.json()).data || []
}

export async function getStudentById(id: string | number) {
  const jwt = await getCookie('jwt')
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/student/${id}`, {
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Erro ao buscar estudante')
  }
  return await res.json()
} 