import type { ApiResponse, Category } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const BASE_URL = API_URL ? `${API_URL}/api` : null

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  if (!BASE_URL) return { success: false, message: 'API URL not configured', data: [] }
  const res = await fetch(`${BASE_URL}/categories`, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}
