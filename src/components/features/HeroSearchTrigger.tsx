'use client'

import { useState } from 'react'
import SearchModal from './SearchModal'
import type { Category } from '@/types'

export default function HeroSearchTrigger({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-4 text-left hover:bg-white/30 transition-all group min-h-[56px]"
      >
        <svg className="h-5 w-5 text-white/70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="flex-1 text-white/70 text-sm sm:text-base">Mau ke mana di Kerinci hari ini?</span>
        <span className="text-xs text-white/60 bg-white/10 rounded-lg px-2.5 py-1 shrink-0 hidden sm:inline">Cari</span>
      </button>
      <SearchModal open={open} onClose={() => setOpen(false)} categories={categories} />
    </>
  )
}
