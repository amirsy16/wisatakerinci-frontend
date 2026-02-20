'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import type { Category } from '@/types'

const categoryIcons: Record<string, string> = {
  'alam-pegunungan': '🏔️',
  'air-terjun': '💧',
  'danau-sungai': '🏞️',
  'wisata-budaya': '🏛️',
  'agrowisata': '🌿',
  'ekowisata': '🌱',
  'petualangan': '🧗',
}

interface SearchModalProps {
  open: boolean
  onClose: () => void
  categories: Category[]
}

export default function SearchModal({ open, onClose, categories }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 80)
    } else {
      document.body.style.overflow = ''
      setQuery('')
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/wisata?search=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  function handleCategory(slug: string) {
    router.push(`/wisata?category=${slug}`)
    onClose()
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[70] bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-stone-100 shrink-0">
        <button
          onClick={onClose}
          className="p-2 -ml-1 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Tutup"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Mau ke mana di Kerinci hari ini?"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-9 pr-3 py-3 text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-200 min-h-[48px]"
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim()}
            className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors min-h-[48px]"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
          Jelajahi Kategori
        </p>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.slug)}
              className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3.5 text-sm font-medium text-stone-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-all text-left min-h-[52px]"
            >
              <span className="text-2xl leading-none">{categoryIcons[cat.slug] ?? '🌄'}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}
