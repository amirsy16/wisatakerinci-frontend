# Cloudinary Image Upload Guide — WisataKerinci Admin Panel

Dokumen ini menjelaskan cara kerja sistem upload foto destinasi menggunakan Cloudinary di frontend admin panel.

---

## Overview

Foto destinasi disimpan di **Cloudinary** (bukan server Railway).  
Keuntungan: gambar **persisten**, tidak hilang saat redeploy, dan URL langsung bisa digunakan di `<img>`.

---

## API Endpoints

Base URL: `https://wisatakerinci-backend-production.up.railway.app`

### Upload Foto
```
POST /api/admin/destinations/{id}/photos
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data
```

**Form fields:**
| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| `photo` | file | ✅ | Gambar (jpeg/png/jpg/webp, max 5MB) |
| `is_primary` | boolean | ❌ | Jadikan foto utama destinasi (default: false) |

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Foto berhasil diunggah.",
  "data": {
    "id": 1,
    "image_url": "https://res.cloudinary.com/dd65x4nds/image/upload/v.../wisatakerinci/destinations/abc123.jpg",
    "is_primary": true
  }
}
```

---

### Hapus Foto
```
DELETE /api/admin/destinations/{destinationId}/photos/{photoId}
Authorization: Bearer {admin_token}
```

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Foto berhasil dihapus."
}
```

---

## Cara Upload dari Frontend (Next.js/React)

### Komponen Upload Foto

```tsx
// components/admin/PhotoUploader.tsx

async function uploadPhoto(
  destinationId: number,
  file: File,
  isPrimary: boolean = false,
  token: string
) {
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('is_primary', isPrimary ? 'true' : 'false');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/destinations/${destinationId}/photos`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // JANGAN set Content-Type manual — biarkan browser set boundary-nya
      },
      body: formData,
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Upload gagal');
  }

  return res.json(); // { success, message, data: { id, image_url, is_primary } }
}
```

### Komponen Delete Foto

```tsx
async function deletePhoto(
  destinationId: number,
  photoId: number,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/destinations/${destinationId}/photos/${photoId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) throw new Error('Hapus foto gagal');
  return res.json();
}
```

---

## Format image_url di Response API

Foto yang sudah diupload akan muncul di endpoint destinasi:

```
GET /api/destinations/{slug}
```

Field `images` dalam response:
```json
{
  "images": [
    {
      "id": 1,
      "image_url": "https://res.cloudinary.com/dd65x4nds/image/upload/v.../wisatakerinci/destinations/abc123.jpg",
      "is_primary": true
    }
  ]
}
```

`image_url` selalu berupa **full HTTPS URL** dari Cloudinary — langsung pakai di `<img src={image_url} />`.

---

## Next.js Config (next.config.js)

Tambahkan domain Cloudinary agar `next/image` bisa load foto:

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dd65x4nds/**',
      },
      {
        protocol: 'https',
        hostname: 'wisatakerinci-backend-production.up.railway.app',
      },
    ],
  },
};
```

---

## Aturan Penting

1. **Endpoint upload & delete hanya untuk admin** — butuh token admin (role: `admin`)
2. **Jangan set `Content-Type` manual** saat upload — biarkan browser/fetch atur `multipart/form-data` + boundary otomatis
3. **Maksimal 5MB per foto**, format: jpeg, png, jpg, webp
4. **Foto primary** — hanya satu per destinasi; kirim `is_primary: true` untuk mengganti foto utama
5. Saat hapus foto, file otomatis dihapus dari Cloudinary (tidak ada file orphan)
6. **`image_url` bisa `null`** jika destinasi belum punya foto — handle di frontend

---

## Alur Admin Panel Upload Foto

```
[Admin pilih file] 
      ↓
[Frontend kirim POST multipart/form-data ke backend]
      ↓
[Backend upload ke Cloudinary]
      ↓
[Cloudinary return secure_url + public_id]
      ↓
[Backend simpan URL ke database]
      ↓
[Frontend tampilkan gambar dari Cloudinary URL]
```

---

## Environment Variable Frontend

```env
NEXT_PUBLIC_API_URL=https://wisatakerinci-backend-production.up.railway.app
```
