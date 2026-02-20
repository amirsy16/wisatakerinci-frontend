import Link from 'next/link'
import Image from 'next/image'
import { getDestinations } from '@/services/destinations'
import { getCategories } from '@/services/categories'
import HomeClient from '@/components/features/HomeClient'
import HeroSearchTrigger from '@/components/features/HeroSearchTrigger'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [destinationsRes, categoriesRes] = await Promise.allSettled([
    getDestinations({ per_page: 6, page: 1 }),
    getCategories(),
  ])

  const destinations = destinationsRes.status === 'fulfilled' ? destinationsRes.value.data : []
  const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data : []

  return (
    <>
      {/* ─── Hero (80vh — konten berikutnya sengaja mengintip) ───────────── */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpeg"
            alt="Gunung Kerinci"
            fill
            className="object-cover opacity-50"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/30 via-stone-900/10 to-stone-900/70" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-4 py-1.5 text-sm font-medium text-emerald-300">
            <span>🏔️</span> Selamat Datang di Kerinci
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
            Jelajahi Keindahan
            <br />
            <span className="text-emerald-400">Alam Kerinci</span>
          </h1>
          <p className="text-base sm:text-lg text-stone-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Gunung tertinggi di Sumatera, air terjun eksotis, danau vulkanik,
            dan kebun teh nan hijau menanti Anda.
          </p>

          {/* Search trigger — langsung di hero */}
          <div className="mx-auto max-w-lg">
            <HeroSearchTrigger categories={categories} />
          </div>
        </div>

        {/* Scroll hint — petunjuk visual ada konten di bawah */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── Search Bar + Categories + Destinations (client island) ────────── */}
      <HomeClient categories={categories} destinations={destinations} />

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-emerald-700 py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Sudah Pernah Berkunjung?</h2>
          <p className="text-emerald-200 mb-8 text-sm">
            Bagikan pengalaman wisata Anda dan bantu wisatawan lain merencanakan perjalanan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register"
              className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors min-h-[48px] flex items-center justify-center">
              Buat Akun Gratis
            </Link>
            <Link href="/wisata"
              className="rounded-xl border border-emerald-500 px-6 py-3.5 text-sm font-medium text-white hover:bg-emerald-600 transition-colors min-h-[48px] flex items-center justify-center">
              Lihat Destinasi
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
