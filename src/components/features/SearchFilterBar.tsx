'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import type { Category } from '@/types'
import BottomSheet from '@/components/ui/BottomSheet'
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
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react'

interface SearchFilterBarProps {
  categories: Category[]
  initialSearch?: string
  initialCategory?: string
}

export default function SearchFilterBar({ categories, initialSearch = '', initialCategory = '' }: SearchFilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)
  const [filterOpen, setFilterOpen] = useState(false)
  const [pendingCategory, setPendingCategory] = useState(initialCategory)

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const current = new URLSearchParams(searchParams.toString())
      Object.entries(params).forEach(([key, value]) => {
        if (value) current.set(key, value)
        else current.delete(key)
      })
      current.delete('page')
      return current.toString()
    },
    [searchParams]
  )

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`${pathname}?${createQueryString({ search, category })}`)
    }, 400)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  function handleCategoryChange(val: string) {
    setCategory(val)
    router.push(`${pathname}?${createQueryString({ search, category: val })}`)
  }

  function applyFilter() {
    setCategory(pendingCategory)
    router.push(`${pathname}?${createQueryString({ search, category: pendingCategory })}`)
    setFilterOpen(false)
  }

  function handleReset() {
    setSearch('')
    setCategory('')
    setPendingCategory('')
    router.push(pathname)
  }

  const hasFilter = search || category

  return (
    <>
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari destinasi..."
            className="w-full rounded-xl border border-stone-200 bg-white pl-9 pr-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-200 min-h-[48px]"
          />
        </div>

        {/* Filter button (mobile: opens BottomSheet; desktop: shows inline select) */}
        <button
          onClick={() => { setPendingCategory(category); setFilterOpen(true) }}
          className={[
            'sm:hidden flex items-center gap-2 rounded-xl border px-3.5 py-3 text-sm font-medium transition-colors min-h-[48px]',
            category
              ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
              : 'border-stone-200 bg-white text-stone-600',
          ].join(' ')}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
          {category && <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />}
        </button>

        {/* Desktop: category select */}
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="hidden sm:block rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-200 cursor-pointer min-h-[48px]"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>

        {/* Reset */}
        {hasFilter && (
          <button
            onClick={handleReset}
            className="rounded-xl border border-stone-200 px-3.5 py-3 text-sm text-stone-500 hover:bg-stone-50 transition-colors whitespace-nowrap min-h-[48px]"
          >
            Reset
          </button>
        )}
      </div>

      {/* Mobile Filter BottomSheet */}
      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter Kategori">
        <div className="space-y-2 pb-4">
          <button
            onClick={() => setPendingCategory('')}
            className={[
              'w-full flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium text-left transition-colors min-h-[52px]',
              pendingCategory === ''
                ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                : 'border-stone-100 bg-stone-50 text-stone-700',
            ].join(' ')}
          >
            <LayoutGrid className="h-5 w-5" /> Semua Kategori
          </button>
          {categories.map((cat) => {
            const CatIcon = getIcon(cat.slug)
            return (
              <button
                key={cat.id}
                onClick={() => setPendingCategory(cat.slug)}
                className={[
                  'w-full flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium text-left transition-colors min-h-[52px]',
                  pendingCategory === cat.slug
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                    : 'border-stone-100 bg-stone-50 text-stone-700',
                ].join(' ')}
              >
                <CatIcon className="h-5 w-5" />
                {cat.name}
              </button>
            )
          })}
        </div>
        <button
          onClick={applyFilter}
          className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 text-sm transition-colors min-h-[52px] mt-2"
        >
          Terapkan Filter
        </button>
      </BottomSheet>
    </>
  )
}

const categoryIconMap: Record<string, LucideIcon> = {
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

function getIcon(slug: string): LucideIcon {
  return categoryIconMap[slug] ?? MapPin
}
