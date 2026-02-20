import apiClient from './api'
import type { ApiListResponse, ApiResponse, Category, Destination, DestinationDetail, Review } from '@/types'

// ─── Admin Destinations ────────────────────────────────────────────────────────
export async function adminGetDestinations(page = 1): Promise<ApiListResponse<Destination>> {
  const { data } = await apiClient.get<ApiListResponse<Destination>>(`/admin/destinations?page=${page}`)
  return data
}

export async function adminGetDestination(id: number): Promise<ApiResponse<DestinationDetail>> {
  const { data } = await apiClient.get<ApiResponse<DestinationDetail>>(`/admin/destinations/${id}`)
  return data
}

export interface DestinationPayload {
  name?: string
  description?: string
  location?: string
  map_url?: string | null
  ticket_price?: number
  open_hours?: string | null
  status?: 'active' | 'draft' | 'inactive'
  categories?: number[]
}

export async function adminCreateDestination(payload: DestinationPayload): Promise<ApiResponse<Destination>> {
  const { data } = await apiClient.post<ApiResponse<Destination>>('/admin/destinations', payload)
  return data
}

export async function adminUpdateDestination(id: number, payload: DestinationPayload): Promise<ApiResponse<Destination>> {
  const { data } = await apiClient.put<ApiResponse<Destination>>(`/admin/destinations/${id}`, payload)
  return data
}

export async function adminDeleteDestination(id: number): Promise<void> {
  await apiClient.delete(`/admin/destinations/${id}`)
}

// ─── Admin Categories ──────────────────────────────────────────────────────────
export interface CategoryWithCount extends Category {
  destinations_count?: number
}

export async function adminGetCategories(): Promise<ApiResponse<CategoryWithCount[]>> {
  const { data } = await apiClient.get<ApiResponse<CategoryWithCount[]>>('/admin/categories')
  return data
}

export async function adminCreateCategory(name: string): Promise<ApiResponse<Category>> {
  const { data } = await apiClient.post<ApiResponse<Category>>('/admin/categories', { name })
  return data
}

export async function adminUpdateCategory(id: number, name: string): Promise<ApiResponse<Category>> {
  const { data } = await apiClient.put<ApiResponse<Category>>(`/admin/categories/${id}`, { name })
  return data
}

export async function adminDeleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/admin/categories/${id}`)
}

// ─── Admin Reviews ─────────────────────────────────────────────────────────────
export async function adminGetReviews(status?: 'pending' | 'approved', page = 1): Promise<ApiListResponse<Review>> {
  const query = new URLSearchParams({ page: String(page) })
  if (status) query.set('status', status)
  const { data } = await apiClient.get<ApiListResponse<Review>>(`/admin/reviews?${query}`)
  return data
}

export async function adminApproveReview(id: number): Promise<ApiResponse<Review>> {
  const { data } = await apiClient.patch<ApiResponse<Review>>(`/admin/reviews/${id}/approve`)
  return data
}

export async function adminRejectReview(id: number): Promise<ApiResponse<Review>> {
  const { data } = await apiClient.patch<ApiResponse<Review>>(`/admin/reviews/${id}/reject`)
  return data
}

export async function adminDeleteReview(id: number): Promise<void> {
  await apiClient.delete(`/admin/reviews/${id}`)
}
