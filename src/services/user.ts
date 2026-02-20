import apiClient from './api'
import type { ApiListResponse, ApiResponse, Review, User } from '@/types'

export async function getProfile(): Promise<ApiResponse<User>> {
  const { data } = await apiClient.get<ApiResponse<User>>('/user/profile')
  return data
}

export async function updateProfile(formData: FormData): Promise<ApiResponse<User>> {
  const { data } = await apiClient.post<ApiResponse<User>>('/user/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function getUserReviews(page = 1): Promise<ApiListResponse<Review>> {
  const { data } = await apiClient.get<ApiListResponse<Review>>(`/user/reviews?page=${page}`)
  return data
}
