import type { ApiResponse, Category } from '@/types'

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  const res = await fetch(`${BASE_URL}/categories`, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}
