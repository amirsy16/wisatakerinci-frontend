'use client'

import Link from 'next/link'
import DestinationCard from './DestinationCard'
import type { Category, Destination } from '@/types'
import {
  Mountain,
  Droplets,
  Waves,
  Landmark,
  Leaf,
  TreePine,
  Compass,
  Binoculars,
  MapPin,
  type LucideIcon,
} from 'lucide-react'

const categoryIcons: Record<string, LucideIcon> = {
  'alam-pegunungan': Mountain,
  'air-terjun': Droplets,
  'danau-sungai': Waves,
  'wisata-budaya': Landmark,
  'agrowisata': Leaf,
  'ekowisata': TreePine,
  'petualangan': Compass,
  'bukit-pandang': Binoculars,
  'bukit-kayangan': Binoculars,
}

interface HomeClientProps {
  categories: Category[]
  destinations: Destination[]
}

export default function HomeClient({ categories, destinations }: HomeClientProps) {
  return (
    <>


      {/* ─── Categories (swipeable on mobile, grid on desktop) ────────────── */}
      <section className="bg-stone-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Kategori Wisata</h2>
              <p className="mt-0.5 text-sm text-stone-500">Pilih jenis aktivitas wisata</p>
            </div>
            <Link href="/wisata" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 shrink-0">
              Semua →
            </Link>
          </div>

          {/* Mobile: 2-row 3-col grid; desktop: single row grid */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
              {categories.map((cat: Category) => (
                <Link
                  key={cat.id}
                  href={`/wisata?category=${cat.slug}`}
                  className="flex flex-col items-center gap-2 rounded-xl bg-white border border-stone-200 p-4 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group"
                >
                  {(() => { const Icon = categoryIcons[cat.slug] ?? MapPin; return <Icon className="h-7 w-7 text-emerald-600 group-hover:text-emerald-700 transition-colors" /> })()}
                  <span className="text-xs font-medium text-stone-700 text-center group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Destinations (swipeable on mobile, grid on desktop) ─── */}
      <section className="py-10 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Destinasi Unggulan</h2>
              <p className="mt-0.5 text-sm text-stone-500">Tempat wajib dikunjungi</p>
            </div>
            <Link href="/wisata" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0">
              Lihat semua
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="sm:hidden overflow-x-auto scrollbar-none -mx-4 px-4">
            <div className="flex gap-4 w-max pb-2">
              {destinations.map((dest) => (
                <div key={dest.id} className="w-[280px] shrink-0">
                  <DestinationCard destination={dest} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
