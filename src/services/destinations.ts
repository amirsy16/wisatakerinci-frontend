import type { ApiListResponse, ApiResponse, Destination, DestinationDetail, DestinationQueryParams } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const BASE_URL = API_URL ? `${API_URL}/api` : null

// Used in Server Components (native fetch with Next.js caching)
export async function getDestinations(params?: DestinationQueryParams): Promise<ApiListResponse<Destination>> {
  if (!BASE_URL) return { success: false, message: 'API URL not configured', data: [], meta: { current_page: 1, last_page: 1, total: 0, per_page: 9 } }

  const query = new URLSearchParams()
  if (params?.search) query.set('search', params.search)
  if (params?.category) query.set('category', params.category)
  if (params?.per_page) query.set('per_page', String(params.per_page))
  if (params?.page) query.set('page', String(params.page))

  const url = `${BASE_URL}/destinations${query.toString() ? `?${query}` : ''}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to fetch destinations')
  return res.json()
}

export async function getDestinationBySlug(slug: string): Promise<ApiResponse<DestinationDetail>> {
  if (!BASE_URL) throw new Error('API URL not configured')
  const res = await fetch(`${BASE_URL}/destinations/${slug}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Destination not found')
  return res.json()
}
