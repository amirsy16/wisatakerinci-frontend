# 🏔️ Frontend Development Guide: Explore Kerinci

> **Vibe Check:** Modern, fast, SEO-optimized, and modular component design.
> **Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Axios, Zustand (State Management).

## 📌 1. Aturan Main (Core Directives)
Sebagai AI Assistant, saat menulis kode untuk *frontend* ini, kamu **WAJIB** mematuhi aturan berikut:
* **App Router First:** Gunakan pola App Router (`app/`). Jangan gunakan `pages/`.
* **RSC (React Server Components) by Default:** Biarkan komponen menjadi *Server Component* untuk performa dan SEO yang maksimal (terutama untuk halaman daftar wisata dan detail wisata).
* **"use client" dengan Bijak:** Hanya gunakan directive `"use client"` di baris paling atas JIKA komponen tersebut membutuhkan interaktivitas (seperti `useState`, `useEffect`, *event listener* `onClick`, atau form input).
* **TypeScript Strict Mode:** Selalu definisikan *Interface* atau *Type* untuk setiap *props* komponen dan respons API. Jangan gunakan `any`.
* **Styling:** Gunakan Tailwind CSS. Pisahkan komponen UI yang sering dipakai (seperti *Button*, *Input*, *Card*) ke dalam folder `components/ui`.

## 📁 2. Struktur Folder (The Architecture)
Gunakan struktur berbasis fitur dan modularitas seperti ini di dalam direktori `src/`:

```text
src/
├── app/                  # Routing Next.js App Router
│   ├── (public)/         # Rute publik (/, /wisata, /wisata/[slug])
│   ├── (auth)/           # Rute autentikasi (/login, /register)
│   ├── (user)/           # Rute user biasa (/profil)
│   └── admin/            # Rute admin dashboard (/admin/destinations)
├── components/           # Reusable UI components
│   ├── ui/               # Button, Input, Modal (Atomic)
│   └── features/         # DestinationCard, ReviewForm, MapView
├── lib/                  # Utility functions (formatDate, formatCurrency)
├── services/             # Konfigurasi API (Axios instance, fetchers)
├── store/                # Global state (Zustand untuk data user/auth)
└── types/                # TypeScript interfaces (Destination, User, Review)
🛣️ 3. Peta Routing (Next.js App Router)
Public Pages (SEO Friendly - Server Fetched):

app/page.tsx -> Homepage (Hero, Top Destinasi).

app/wisata/page.tsx -> Direktori wisata dengan search/filter.

app/wisata/[slug]/page.tsx -> Detail wisata & ulasan pengunjung.

Protected Pages (Client Side Auth Check):

app/admin/layout.tsx -> Layout khusus admin (Sidebar, Header).

app/admin/page.tsx -> Dashboard statistik.

app/profil/page.tsx -> Manajemen profil pengunjung.

🔌 4. Standar Integrasi API (Laravel to Next.js)
Axios Instance (src/services/api.ts): Buat satu instance Axios yang sudah dikonfigurasi dengan Base URL Laravel (http://localhost:8000/api).

Interceptor: Gunakan Axios Interceptor untuk otomatis menyisipkan Bearer Token dari cookies atau local storage ke setiap request yang membutuhkan autentikasi.

Data Fetching:

Untuk data statis/SEO (Detail Wisata): Gunakan native fetch() bawaan Next.js di Server Component agar bisa di-cache.

Untuk data dinamis/Interaksi (Kirim Review, Dashboard Admin): Gunakan SWR atau TanStack React Query via Client Component.

🛠️ 5. Workflow Eksekusi AI (SOP)
Jika saya memberikan prompt: "Buatkan halaman detail wisata", kerjakan dengan urutan logis ini:

Definisikan Type: Buat/update interface TypeScript di folder types/ (misal: DestinationDetail).

Buat Fetcher: Tulis fungsi API call di folder services/ untuk memanggil GET /api/destinations/{slug}.

Bangun UI Components: Buat komponen modular di components/features/ (misal: DestinationGallery.tsx, ReviewList.tsx). Pastikan pemisahan Server dan Client Component tepat.

Rakit di Page: Panggil semua komponen tersebut di dalam app/wisata/[slug]/page.tsx.

State & Error Handling: Tambahkan loading state (bisa pakai loading.tsx Next.js) dan tampilkan error jika API gagal dipanggil.

