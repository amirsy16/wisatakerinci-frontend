import apiClient from './api'
import type { ApiResponse, AuthResponse } from '@/types'

export async function login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', { email, password })
  return data
}

export async function register(
  name: string,
  email: string,
  password: string,
  password_confirmation: string
): Promise<ApiResponse<AuthResponse>> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', {
    name,
    email,
    password,
    password_confirmation,
  })
  return data
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}
