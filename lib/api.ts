import { cookies } from "next/headers";

export async function fetchData<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const token = (await cookies()).get('jwt')?.value;
    
      if (!token) {
        throw new Error('Token JWT não encontrado');
      }
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify({ message: data.message || "Error", statusCode: response.status }));
    }
    
    return data;
  } catch (error: any) {
    throw JSON.parse(error.message);
  }
}