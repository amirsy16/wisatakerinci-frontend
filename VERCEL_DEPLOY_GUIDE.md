# Vercel Deployment Guide — Explore Kerinci Frontend (Next.js)

> **Untuk AI Agent Frontend**: Dokumen ini adalah panduan lengkap untuk men-deploy frontend Next.js ke Vercel dan menghubungkannya ke backend Laravel di Railway.  
> Baca seluruh dokumen ini sebelum memulai setup.

---

## 1. Overview Stack

| Item | Value |
|------|-------|
| Frontend Framework | Next.js (App Router atau Pages Router) |
| Backend | Laravel 12 di Railway |
| Backend Base URL (production) | `https://wisatakerinci-backend-production.up.railway.app` |
| Frontend Domain (production) | `https://gokerinci.vercel.app` |
| Auth Method | Bearer Token (Sanctum) — simpan di `localStorage` |
| CORS | Sudah dikonfigurasi di backend untuk `gokerinci.vercel.app` |

---

## 2. Backend Production URL

Backend Laravel sudah di-deploy ke Railway. URL production tersedia di Railway Dashboard:

- Buka [railway.app](https://railway.app) → project → service **wisatakerinci-backend** → tab **Settings** → **Networking**
- Format URL: `https://wisatakerinci-backend-production.up.railway.app`

**Gunakan URL ini sebagai nilai `NEXT_PUBLIC_API_URL` di environment variables Vercel.**

---

## 3. Environment Variables yang Diperlukan

Buat file `.env.local` di root project Next.js:

```env
NEXT_PUBLIC_API_URL=https://wisatakerinci-backend-production.up.railway.app
```

> **Catatan:** Prefix `NEXT_PUBLIC_` wajib agar variable bisa diakses di browser (client-side).  
> Jangan tambahkan `/api` di akhir URL — sudah di-handle di helper API.

---

## 4. Setup API Helper (Wajib Dibuat)

Buat file `lib/api.js` (atau `lib/api.ts`) di project Next.js:

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Helper untuk request tanpa auth
export const publicFetch = async (endpoint: string, options?: RequestInit) => {
  const res = await fetch(`${BASE_URL}/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  const data = await res.json()

  if (!res.ok) {
    throw { status: res.status, ...data }
  }

  return data
}

// Helper untuk request dengan auth token
export const authFetch = async (endpoint: string, options?: RequestInit) => {
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE_URL}/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  })

  // Handle 401 — token expired/invalid
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    return
  }

  const data = await res.json()

  if (!res.ok) {
    throw { status: res.status, ...data }
  }

  return data
}

// Helper untuk upload file (multipart/form-data)
export const uploadFetch = async (endpoint: string, formData: FormData) => {
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE_URL}/api${endpoint}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      // JANGAN set Content-Type — biarkan browser set otomatis dengan boundary
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  if (res.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    return
  }

  const data = await res.json()

  if (!res.ok) {
    throw { status: res.status, ...data }
  }

  return data
}
```

---

## 5. Konfigurasi next.config.js

Tambahkan konfigurasi berikut untuk mengizinkan gambar dari Railway:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wisatakerinci-backend-production.up.railway.app',
        pathname: '/storage/**',
      },
      {
        // untuk development lokal
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/storage/**',
      },
    ],
  },
}

module.exports = nextConfig
```

---

## 6. Langkah Deploy ke Vercel

### Step 1: Push ke GitHub
Pastikan project Next.js sudah di GitHub repository yang terpisah dari backend.

```bash
git add .
git commit -m "feat: initial next.js frontend"
git push
```

### Step 2: Import ke Vercel
1. Buka [vercel.com](https://vercel.com) → **Add New Project**
2. **Import Git Repository** → pilih repo frontend Next.js
3. Vercel akan otomatis detect framework Next.js

### Step 3: Set Environment Variables di Vercel
Sebelum klik **Deploy**, klik **Environment Variables** dan tambahkan:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://wisatakerinci-backend-production.up.railway.app` |

> Centang semua environment: **Production**, **Preview**, **Development**

### Step 4: Deploy
Klik **Deploy** — Vercel akan build dan deploy otomatis.

### Step 5: Verifikasi Domain
Setelah deploy selesai:
- Domain production: `https://gokerinci.vercel.app`
- Pastikan domain ini sudah dikonfigurasi di Vercel (Settings → Domains)

---

## 7. Konfigurasi Image URL di Frontend

`image_url` dan `avatar_url` dari backend sudah berupa **URL lengkap**.  
Di production, URL tersebut dalam format:
```
https://wisatakerinci-backend-production.up.railway.app/storage/destinations/filename.jpg
https://wisatakerinci-backend-production.up.railway.app/storage/avatars/filename.jpg
```

Gunakan langsung sebagai `src` di Next.js Image component:

```tsx
import Image from 'next/image'

// Pastikan hostname sudah didaftarkan di next.config.js (step 5)
<Image
  src={destination.images[0]?.image_url}
  alt={destination.name}
  width={400}
  height={300}
/>
```

---

## 8. Contoh Penggunaan API di Next.js

### Fetch List Destinations (Server Component)
```typescript
// app/destinations/page.tsx
import { publicFetch } from '@/lib/api'

export default async function DestinationsPage({
  searchParams
}: {
  searchParams: { search?: string; category?: string; page?: string }
}) {
  const params = new URLSearchParams()
  if (searchParams.search) params.set('search', searchParams.search)
  if (searchParams.category) params.set('category', searchParams.category)
  if (searchParams.page) params.set('page', searchParams.page)

  const { data, meta } = await publicFetch(`/destinations?${params}`)

  return (
    <div>
      {data.map((destination) => (
        <div key={destination.id}>{destination.name}</div>
      ))}
      {/* Pagination: gunakan meta.current_page dan meta.last_page */}
    </div>
  )
}
```

### Login (Client Component)
```typescript
'use client'
import { publicFetch } from '@/lib/api'

const handleLogin = async (email: string, password: string) => {
  try {
    const { data } = await publicFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    // redirect ke home
  } catch (err) {
    // err.message berisi pesan error dari backend
    console.error(err.message)
  }
}
```

### Submit Review (Client Component)
```typescript
'use client'
import { authFetch } from '@/lib/api'

const handleSubmitReview = async (destinationId: number, rating: number, comment: string) => {
  const { data } = await authFetch('/reviews', {
    method: 'POST',
    body: JSON.stringify({ destination_id: destinationId, rating, comment }),
  })
  // data = review yang baru dibuat (status pending)
}
```

### Upload Avatar (Client Component)
```typescript
'use client'
import { uploadFetch } from '@/lib/api'

const handleUploadAvatar = async (file: File) => {
  const formData = new FormData()
  formData.append('avatar', file)

  const { data } = await uploadFetch('/user/profile', formData)
  // data = user profile yang sudah diupdate
}
```

---

## 9. Routing Struktur yang Direkomendasikan

```
app/
├── page.tsx                          → Home / Landing page
├── destinations/
│   ├── page.tsx                      → List destinasi (filter + search + pagination)
│   └── [slug]/
│       └── page.tsx                  → Detail destinasi
├── login/
│   └── page.tsx                      → Login
├── register/
│   └── page.tsx                      → Register
├── profile/
│   └── page.tsx                      → User profile (protected)
└── admin/
    ├── page.tsx                      → Admin dashboard (role: admin)
    ├── destinations/
    │   └── page.tsx                  → CRUD destinasi
    ├── reviews/
    │   └── page.tsx                  → Approve/reject reviews
    └── categories/
        └── page.tsx                  → CRUD kategori
```

---

## 10. Akun Testing

| Email | Password | Role |
|-------|----------|------|
| `admin@wisker.test` | `password` | admin |
| (user biasa) | `password` | user |

Gunakan endpoint `POST /api/auth/login` untuk login dan dapatkan token.

---

## 11. Checklist Sebelum Deploy

- [ ] File `.env.local` sudah berisi `NEXT_PUBLIC_API_URL` yang benar
- [ ] `next.config.js` sudah dikonfigurasi untuk `remotePatterns` Railway
- [ ] `lib/api.js` sudah dibuat dengan helper `publicFetch`, `authFetch`, `uploadFetch`
- [ ] Environment variable `NEXT_PUBLIC_API_URL` sudah diset di Vercel dashboard
- [ ] Test API menggunakan URL Railway sebelum deploy
- [ ] Handle state `null` untuk `avatar_url`, `map_url`, `open_hours`, `rating_avg`

---

## 12. Troubleshooting

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `CORS error` | Domain frontend tidak diizinkan backend | Pastikan `gokerinci.vercel.app` ada di `CORS_ALLOWED_ORIGINS` Railway |
| `401 Unauthorized` | Token tidak dikirim atau expired | Cek header `Authorization: Bearer {token}` |
| `Image not loading` | Hostname Railway belum di-allow | Tambahkan ke `remotePatterns` di `next.config.js` |
| `API URL undefined` | Env var tidak di-set di Vercel | Tambahkan `NEXT_PUBLIC_API_URL` di Vercel dashboard → Settings → Environment Variables |
| `fetch failed` | Backend Railway sedang sleep/down | Cek status di Railway dashboard |

---

*Backend version: 1.0.0 | API: 25 endpoints | Backend: Railway | Frontend: Vercel | Updated: Feb 20, 2026*
