import apiClient from './api'
import type { ApiResponse, Review } from '@/types'

export async function submitReview(
  destination_id: number,
  rating: number,
  comment: string
): Promise<ApiResponse<Review>> {
  const { data } = await apiClient.post<ApiResponse<Review>>('/reviews', {
    destination_id,
    rating,
    comment,
  })
  return data
}
