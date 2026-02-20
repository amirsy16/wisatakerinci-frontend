# Image System Guide — Explore Kerinci Frontend

> **Untuk AI Agent Frontend**: Dokumen ini menjelaskan secara lengkap bagaimana sistem gambar bekerja di backend dan cara menanganinya di frontend Next.js.

---

## 1. Cara Kerja `image_url` di API

Backend **selalu** mengembalikan `image_url` sebagai **URL lengkap** atau `null`.  
Frontend **tidak perlu** menyambung base URL apapun.

### 3 Kemungkinan Nilai `image_url`

| Kondisi | Contoh nilai `image_url` |
|---------|--------------------------|
| Gambar asli destinasi (dari git) | `https://wisatakerinci-backend-production.up.railway.app/images/destinations/danaukerinci.jpg` |
| Gambar URL eksternal | `https://images.unsplash.com/photo-xxx?w=800&q=80` |
| Gambar tidak ditemukan | `null` |

### Contoh Response API
```json
{
  "id": 2,
  "name": "Danau Kerinci",
  "images": [
    {
      "id": 4,
      "image_url": "https://wisatakerinci-backend-production.up.railway.app/images/destinations/danaukerinci.jpg",
      "is_primary": true
    }
  ]
}
```

---

## 2. Daftar Gambar yang Tersedia

Gambar berikut tersimpan permanen di server (bagian dari repo git):

| Destinasi | `image_url` |
|-----------|-------------|
| Danau Kerinci | `.../images/destinations/danaukerinci.jpg` |
| Air Terjun Telun Berasap | `.../images/destinations/airterjun.jpg` |
| Kebun Teh Kayu Aro | `.../images/destinations/kayuaro.jpg` |
| Danau Gunung Tujuh | `.../images/destinations/gunungtujuh.jpg` |
| Air Terjun Pancuran Rayo | `.../images/destinations/pancuranrayo.jpg` |
| Bukit Kayangan | `.../images/destinations/bukitkayangan1.jpg` |
| Gunung Kerinci | URL Unsplash eksternal |

---

## 3. Wajib: Konfigurasi `next.config.js`

Tambahkan semua hostname sumber gambar agar Next.js `<Image>` tidak error:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Gambar utama dari Railway (public folder)
        protocol: 'https',
        hostname: 'wisatakerinci-backend-production.up.railway.app',
      },
      {
        // Gambar Unsplash (Gunung Kerinci)
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig
```

---

## 4. Cara Tampilkan Gambar di Next.js

### Helper: Ambil Primary Image

```typescript
// lib/image.ts
export const getPrimaryImage = (images: { image_url: string | null; is_primary: boolean }[]) => {
  if (!images || images.length === 0) return null
  const primary = images.find(img => img.is_primary && img.image_url)
  return primary?.image_url ?? images.find(img => img.image_url)?.image_url ?? null
}
```

### Komponen Gambar Destinasi

```tsx
// components/DestinationImage.tsx
import Image from 'next/image'
import { getPrimaryImage } from '@/lib/image'

interface Props {
  images: { image_url: string | null; is_primary: boolean }[]
  name: string
  className?: string
}

export default function DestinationImage({ images, name, className }: Props) {
  const imageUrl = getPrimaryImage(images)

  // Jika tidak ada gambar, tampilkan placeholder UI (bukan gambar)
  if (!imageUrl) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Tidak ada gambar</span>
      </div>
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={name}
      fill
      className={`object-cover ${className}`}
    />
  )
}
```

### Penggunaan di Halaman List Destinasi

```tsx
// app/destinations/page.tsx
import DestinationImage from '@/components/DestinationImage'

export default function DestinationsPage() {
  // ... fetch data

  return (
    <div className="grid grid-cols-3 gap-4">
      {destinations.map((destination) => (
        <div key={destination.id} className="rounded-lg overflow-hidden shadow">
          {/* Wrapper div wajib ada position: relative untuk Next.js Image fill */}
          <div className="relative h-48 w-full">
            <DestinationImage
              images={destination.images}
              name={destination.name}
            />
          </div>
          <div className="p-4">
            <h2>{destination.name}</h2>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Penggunaan di Halaman Detail (Gallery)

```tsx
// app/destinations/[slug]/page.tsx

// Tampilkan semua gambar, filter yang image_url-nya null
const validImages = destination.images.filter(img => img.image_url !== null)

return (
  <div>
    {/* Hero image — primary */}
    {validImages.length > 0 && (
      <div className="relative h-96 w-full">
        <Image
          src={validImages.find(img => img.is_primary)?.image_url ?? validImages[0].image_url}
          alt={destination.name}
          fill
          className="object-cover"
          priority  // prioritas load untuk hero image
        />
      </div>
    )}

    {/* Gallery grid */}
    <div className="grid grid-cols-3 gap-2 mt-4">
      {validImages.map((image) => (
        <div key={image.id} className="relative h-32">
          <Image
            src={image.image_url!}
            alt={destination.name}
            fill
            className="object-cover rounded"
          />
        </div>
      ))}
    </div>
  </div>
)
```

---

## 5. TypeScript Interface

```typescript
// types/index.ts

export interface DestinationImage {
  id: number
  image_url: string | null  // BISA NULL — selalu handle kemungkinan ini
  is_primary: boolean
}

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
```

---

## 6. Aturan Penting

1. **`image_url` bisa `null`** — selalu cek sebelum render, jangan langsung pakai sebagai `src`
2. **Gunakan `fill` + `position: relative` pada parent** untuk responsive image di Next.js
3. **Jangan tambahkan base URL** — `image_url` sudah URL lengkap
4. **Filter gambar null** sebelum render gallery: `images.filter(img => img.image_url !== null)`
5. **Tambahkan `priority`** pada hero image / gambar pertama yang muncul di viewport
6. **Semua hostname wajib** didaftarkan di `next.config.js` — Railway + Unsplash

---

*Backend: wisatakerinci-backend-production.up.railway.app | Updated: Feb 20, 2026*
