// ─── Pagination ────────────────────────────────────────────────────────────────
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// ─── API Response Wrappers ──────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApiListResponse<T> {
  success: boolean
  message: string
  data: T[]
  meta: PaginationMeta
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
}

// ─── User ───────────────────────────────────────────────────────────────────────
export interface User {
  id: number
  name: string
  email: string
  avatar_url: string | null
  role: 'user' | 'admin'
}

// ─── Category ──────────────────────────────────────────────────────────────────
export interface Category {
  id: number
  name: string
  slug: string
}

// ─── Destination Image ─────────────────────────────────────────────────────────
export interface DestinationImage {
  id: number
  image_url: string
  is_primary: boolean
}

// ─── Destination (List View) ───────────────────────────────────────────────────
export interface Destination {
  id: number
  name: string
  slug: string
  description: string
  location: string
  map_url: string | null
  ticket_price: number
  open_hours: string | null
  status: 'active' | 'draft' | 'inactive'
  rating_avg: number | null
  review_count: number
  categories: Category[]
  images: DestinationImage[]
  created_at: string
}

// ─── Destination (Detail View) ─────────────────────────────────────────────────
export interface DestinationDetail extends Destination {
  images: DestinationImage[]
  reviews: Review[]
}

// ─── Review ─────────────────────────────────────────────────────────────────────
export interface Review {
  id: number
  rating: number
  comment: string
  approved_at: string | null
  user: User | null
  destination?: {
    id: number
    name: string
    slug: string
  }
  created_at: string
}

// ─── Auth ───────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  user: User
  token: string
}

// ─── Query Params ──────────────────────────────────────────────────────────────
export interface DestinationQueryParams {
  search?: string
  category?: string
  per_page?: number
  page?: number
}
