# Explore Kerinci — Frontend Guide for AI Agent

> **Untuk AI Agent**: Dokumen ini adalah referensi lengkap backend API yang sudah production-ready.
> Semua endpoint sudah diuji dan stabil. Bacalah seluruh dokumen ini sebelum mulai membuat frontend.

---

## 1. Backend Overview

| Item | Value |
|------|-------|
| Framework | Laravel 12 |
| Auth | Laravel Sanctum (Bearer Token) |
| Database | MySQL 8 |
| Base URL (dev) | `http://127.0.0.1:8000` |
| API Prefix | `/api` |
| Swagger UI | `http://127.0.0.1:8000/api/documentation` |
| Encoding | UTF-8, JSON |
| Timezone | UTC (tampilkan dalam WIB di frontend) |

---

## 2. Konvensi Response API

Semua endpoint **selalu** mengembalikan JSON dengan struktur konsisten:

### Success Response
```json
{
  "success": true,
  "message": "Pesan dalam Bahasa Indonesia.",
  "data": { ... }
}
```

### Success Response + Pagination
```json
{
  "success": true,
  "message": "...",
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 12,
    "total": 30
  }
}
```

### Error Response (selalu konsisten)
```json
{
  "success": false,
  "message": "Pesan error.",
  "errors": {                  // hanya ada di 422
    "field_name": ["pesan error validasi"]
  }
}
```

### HTTP Status Codes
| Code | Kondisi |
|------|---------|
| 200 | OK |
| 201 | Created |
| 401 | Unauthenticated (token tidak ada / expired) |
| 403 | Forbidden (bukan admin, akses ditolak) |
| 404 | Resource tidak ditemukan |
| 422 | Validasi gagal |
| 500 | Server error |

---

## 3. Authentication

Backend menggunakan **Sanctum Bearer Token** — bukan session/cookie.

### Flow Login
```
POST /api/auth/login
  → terima { token: "1|abc..." }
  → simpan token di localStorage / Secure Storage
  → setiap request berikutnya kirim header:
    Authorization: Bearer 1|abc...
```

### Saat Token Expired / Invalid
Backend mengembalikan `401`. Frontend harus redirect ke halaman login.

### User Roles
- `"role": "user"` — pengguna biasa (akses: auth + user routes)
- `"role": "admin"` — administrator (akses: semua routes termasuk admin)

---

## 4. Data Models

### User
```typescript
interface User {
  id: number
  name: string
  email: string
  avatar_url: string | null  // URL lengkap, misal: "http://...storage/avatars/x.jpg"
  role: "user" | "admin"
}
```

### Category
```typescript
interface Category {
  id: number
  name: string     // contoh: "Alam & Pegunungan"
  slug: string     // contoh: "alam-pegunungan"
}
```

### DestinationImage
```typescript
interface DestinationImage {
  id: number
  image_url: string    // URL lengkap
  is_primary: boolean
}
```

### Destination (List View — tanpa reviews)
```typescript
interface Destination {
  id: number
  name: string
  slug: string
  description: string
  location: string
  map_url: string | null
  ticket_price: number       // dalam Rupiah (integer)
  open_hours: string | null  // contoh: "07:00 - 17:00"
  status: "active" | "draft" | "inactive"
  rating_avg: number | null  // 1 desimal, contoh: 4.8
  review_count: number
  categories: Category[]
  images: DestinationImage[] // hanya primary image di list view
  created_at: string         // ISO 8601
}
```

### Destination (Detail View — dengan reviews)
```typescript
interface DestinationDetail extends Destination {
  images: DestinationImage[]  // semua images
  reviews: Review[]           // hanya yang approved
}
```

### Review
```typescript
interface Review {
  id: number
  rating: number        // 1-5
  comment: string
  approved_at: string | null  // null = pending
  user: User | null           // null jika tidak di-load
  destination?: {             // hanya ada di /api/user/reviews
    id: number
    name: string
    slug: string
  }
  created_at: string
}
```

---

## 5. Semua API Endpoints

### 5.1 Authentication (Public)

#### Register
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}

Response 201:
{
  "success": true,
  "message": "Registrasi berhasil.",
  "data": {
    "user": { User },
    "token": "1|abc123xyz..."
  }
}

Error 422 (contoh):
{
  "success": false,
  "message": "Validasi gagal.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "admin@wisker.test",
  "password": "password"
}

Response 200:
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "user": { User },
    "token": "1|abc123xyz..."
  }
}

Error 401:
{
  "success": false,
  "message": "Email atau password salah."
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Logout berhasil."
}
```

---

### 5.2 Destinations (Public)

#### List Destinations
```
GET /api/destinations
GET /api/destinations?search=gunung
GET /api/destinations?category=alam-pegunungan
GET /api/destinations?per_page=6&page=2

Query Parameters:
  search      (string)  - cari di nama & deskripsi
  category    (string)  - filter by category slug
  per_page    (int)     - items per page, default: 12
  page        (int)     - halaman, default: 1

Response 200:
{
  "success": true,
  "message": "Data destinasi berhasil diambil.",
  "data": [
    {
      "id": 1,
      "name": "Gunung Kerinci",
      "slug": "gunung-kerinci",
      "description": "...",
      "location": "Kayu Aro, Kerinci, Jambi",
      "map_url": "https://maps.google.com/?q=-1.697,101.264",
      "ticket_price": 25000,
      "open_hours": "06:00 - 18:00",
      "status": "active",
      "rating_avg": 4.8,
      "review_count": 30,
      "categories": [ { Category } ],
      "images": [ { DestinationImage (primary only) } ],
      "reviews": [],
      "created_at": "2026-02-19T06:22:44.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 12,
    "total": 6
  }
}
```

#### Get Destination Detail
```
GET /api/destinations/{slug}
Contoh: GET /api/destinations/gunung-kerinci

Response 200:
{
  "success": true,
  "message": "Detail destinasi berhasil diambil.",
  "data": {
    "id": 1,
    "name": "Gunung Kerinci",
    ...semua field Destination...,
    "images": [ semua images ],
    "reviews": [ hanya approved reviews dengan user ],
    "rating_avg": 4.8,
    "review_count": 30
  }
}

Error 404:
{
  "success": false,
  "message": "Resource tidak ditemukan."
}
```

---

### 5.3 Categories (Public)

#### List Categories
```
GET /api/categories

Response 200:
{
  "success": true,
  "message": "Data kategori berhasil diambil.",
  "data": [
    { "id": 1, "name": "Alam & Pegunungan", "slug": "alam-pegunungan" },
    { "id": 2, "name": "Air Terjun",         "slug": "air-terjun" },
    { "id": 3, "name": "Agrowisata",         "slug": "agrowisata" },
    { "id": 4, "name": "Danau & Sungai",     "slug": "danau-sungai" },
    { "id": 5, "name": "Ekowisata",          "slug": "ekowisata" },
    { "id": 6, "name": "Petualangan",        "slug": "petualangan" },
    { "id": 7, "name": "Wisata Budaya",      "slug": "wisata-budaya" }
  ]
}
```

---

### 5.4 Reviews (Protected — user)

#### Submit Review
```
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "destination_id": 1,
  "rating": 5,
  "comment": "Pemandangan sangat menakjubkan! Wajib dikunjungi."
}

Validasi:
  destination_id  required, must exist in destinations table
  rating          required, integer, min:1, max:5
  comment         required, string, min:10 characters

Response 201:
{
  "success": true,
  "message": "Ulasan berhasil dikirim dan menunggu persetujuan.",
  "data": {
    "id": 51,
    "rating": 5,
    "comment": "Pemandangan sangat menakjubkan! Wajib dikunjungi.",
    "approved_at": null,   ← null karena masih pending
    "user": { User },
    "created_at": "..."
  }
}
```

---

### 5.5 Photos Upload (Protected — user)

#### Upload Photo
```
POST /api/destinations/{id}/photos
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
  photo       (file, required)   - image, max 5MB
  is_primary  (boolean, optional) - true/false, default false

PENTING: Kirim is_primary sebagai string "true" atau "false" (bukan boolean JS)
         karena menggunakan multipart/form-data

Response 201:
{
  "success": true,
  "message": "Foto berhasil diunggah.",
  "data": {
    "id": 20,
    "image_url": "http://127.0.0.1:8000/storage/destinations/xyz.jpg",
    "is_primary": true
  }
}
```

---

### 5.6 User Profile (Protected — user)

#### Get Profile
```
GET /api/user/profile
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Profil berhasil diambil.",
  "data": {
    "id": 1,
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "avatar_url": "http://127.0.0.1:8000/storage/avatars/abc.jpg",  // atau null
    "role": "user"
  }
}
```

#### Update Profile
```
POST /api/user/profile
Authorization: Bearer {token}
Content-Type: multipart/form-data

CATATAN: Gunakan POST (bukan PUT) dengan form-data karena ada upload file.
         Semua field bersifat opsional — hanya kirim yang ingin diubah.

Form Data (semua opsional):
  name                    (string)
  email                   (string, email)
  avatar                  (file, image, max 2MB)
  current_password        (string, diperlukan jika mengubah password)
  password                (string, min:8)
  password_confirmation   (string, harus sama dengan password)

Response 200:
{
  "success": true,
  "message": "Profil berhasil diperbarui.",
  "data": { User (updated) }
}
```

#### Get User's Reviews
```
GET /api/user/reviews
GET /api/user/reviews?page=2
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Riwayat ulasan berhasil diambil.",
  "data": [
    {
      "id": 51,
      "rating": 5,
      "comment": "...",
      "approved_at": "2026-02-19T10:30:00.000000Z",
      "user": null,
      "destination": {
        "id": 1,
        "name": "Gunung Kerinci",
        "slug": "gunung-kerinci"
      },
      "created_at": "..."
    }
  ],
  "meta": { PaginationMeta }
}
```

---

### 5.7 Admin Endpoints (Protected — admin only)

> Semua endpoint admin memerlukan `Authorization: Bearer {admin_token}`.
> Jika bukan admin akan mendapat error 403.

#### Admin: Destinations

```
GET    /api/admin/destinations           - List semua destinasi (semua status)
GET    /api/admin/destinations?page=2
POST   /api/admin/destinations           - Buat destinasi baru
GET    /api/admin/destinations/{id}      - Detail destinasi
PUT    /api/admin/destinations/{id}      - Update destinasi
DELETE /api/admin/destinations/{id}      - Hapus destinasi
```

POST/PUT Body (JSON):
```json
{
  "name": "Nama Destinasi",         // required (POST only)
  "description": "Deskripsi...",    // required (POST only)
  "location": "Kab. Kerinci",       // required (POST only)
  "map_url": "https://...",          // nullable
  "ticket_price": 25000,             // required (POST), default 0
  "open_hours": "07:00 - 17:00",    // nullable
  "status": "active",               // "active"|"draft"|"inactive"
  "categories": [1, 2, 3]           // array of category IDs
}
```

#### Admin: Categories

```
GET    /api/admin/categories         - List + jumlah destinasi per kategori
POST   /api/admin/categories         - Buat kategori baru
PUT    /api/admin/categories/{id}    - Update kategori
DELETE /api/admin/categories/{id}    - Hapus kategori
```

POST Body:
```json
{ "name": "Nama Kategori" }
// slug di-generate otomatis dari name
```

#### Admin: Reviews

```
GET    /api/admin/reviews                        - Semua review
GET    /api/admin/reviews?status=pending         - Hanya pending
GET    /api/admin/reviews?status=approved        - Hanya approved
PATCH  /api/admin/reviews/{id}/approve           - Setujui review
PATCH  /api/admin/reviews/{id}/reject            - Tolak review (kembali ke pending)
DELETE /api/admin/reviews/{id}                   - Hapus permanen
```

---

## 6. Seed Data untuk Testing

### Akun Default
| Email | Password | Role |
|-------|----------|------|
| `admin@wisker.test` | `password` | admin |
| (10 user random) | `password` | user |

### Destinasi Tersedia (slug)
| Slug | Nama |
|------|------|
| `gunung-kerinci` | Gunung Kerinci |
| `danau-kerinci` | Danau Kerinci |
| `air-terjun-telun-berasap` | Air Terjun Telun Berasap |
| `kebun-teh-kayu-aro` | Kebun Teh Kayu Aro |
| `danau-gunung-tujuh` | Danau Gunung Tujuh |
| `air-terjun-pancuran-rayo` | Air Terjun Pancuran Rayo |

### Kategori Tersedia (slug)
`alam-pegunungan` · `air-terjun` · `danau-sungai` · `wisata-budaya` · `agrowisata` · `ekowisata` · `petualangan`

---

## 7. Cara Menjalankan Backend

```bash
# Masuk ke folder backend
cd d:\laragon\www\wisatakerinci\wisker_backend

# Jalankan server
php artisan serve
# → http://127.0.0.1:8000

# Buka Swagger UI (opsional)
# http://127.0.0.1:8000/api/documentation

# Reset & seed ulang database (HATI-HATI: menghapus semua data)
php artisan migrate:fresh --seed
```

---

## 8. Tips Frontend Development

### Handling Token
```javascript
// Simpan token setelah login
localStorage.setItem('token', data.token)

// Buat helper untuk request
const api = {
  get: (url) => fetch(BASE_URL + url, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  }),
  post: (url, body) => fetch(BASE_URL + url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}
```

### Format Harga (Rupiah)
```javascript
const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
    .format(amount)
// formatRupiah(25000) → "Rp 25.000"
```

### Format Rating (Bintang)
```javascript
// rating_avg bisa null (belum ada review)
const displayRating = (avg) => avg ? `★ ${avg}` : 'Belum ada ulasan'
```

### Upload File (avatar / foto)
```javascript
const formData = new FormData()
formData.append('photo', fileInput.files[0])
formData.append('is_primary', 'true')  // PENTING: string, bukan boolean

fetch(BASE_URL + '/api/destinations/1/photos', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  // JANGAN tambahkan Content-Type header — biarkan browser set secara otomatis
  body: formData
})
```

### Pagination
```javascript
// Backend returns meta.current_page, meta.last_page, meta.total
// Gunakan ?page=N untuk navigasi
GET /api/destinations?page=2&per_page=6
```

### Handle 401 globally (React example)
```javascript
// Intercept semua response 401
if (response.status === 401) {
  localStorage.removeItem('token')
  window.location.href = '/login'
}
```

---

## 9. CORS

CORS sudah dikonfigurasi dan mengizinkan **semua origin** di development.  
Untuk production, ubah `CORS_ALLOWED_ORIGINS` di `.env`:
```
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

---

## 10. Catatan Penting untuk AI Agent

1. **Semua API sudah diuji dan working** — jangan ubah backend kecuali ada bug baru
2. **Gunakan slug (bukan ID) untuk navigasi** ke detail destinasi
3. **Image URL sudah lengkap** — langsung pakai `image_url` dan `avatar_url` sebagai `src`
4. **Review pending tidak muncul** di halaman publik — hanya approved reviews yang tampil di `GET /api/destinations/{slug}`
5. **Admin panel** seharusnya jadi halaman terpisah atau sub-route `/admin/*`
6. **Cek `role` dari user profile** untuk menampilkan/menyembunyikan menu admin
7. **`open_hours` bisa null** untuk data lama — handle dengan optional chaining
8. **`ticket_price: 0`** berarti gratis

---

## 11. Arsitektur yang Direkomendasikan untuk Frontend

```
Frontend App
├── /                    → Landing page / Home (featured destinations)
├── /destinations        → List semua destinasi (filter + search + pagination)
├── /destinations/[slug] → Detail destinasi (gallery, reviews, map)
├── /login               → Login page
├── /register            → Register page
├── /profile             → User profile (edit profil, riwayat review)
├── /admin               → Admin dashboard (role: admin only)
│   ├── /admin/destinations → CRUD destinasi
│   ├── /admin/reviews      → Approve/reject reviews
│   └── /admin/categories   → CRUD kategori
└── 404                  → Not found page
```

Teknologi yang cocok:
- **Mobile**: Flutter (Dart) — `http` atau `dio` package
- **Web**: Next.js (React) — `fetch` atau `axios`
- **Web (ringan)**: Vue.js atau vanilla JS

---

*Generated: Feb 19, 2026 | Backend version: 1.0.0 | 25 endpoints | Stable*
