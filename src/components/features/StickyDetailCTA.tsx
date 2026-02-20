'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { formatRupiah } from '@/lib/format'
import { useEffect, useState } from 'react'

interface StickyDetailCTAProps {
  price: number | null
  mapUrl: string | null
}

export default function StickyDetailCTA({ price, mapUrl }: StickyDetailCTAProps) {
  const { token, hydrated, hydrate } = useAuthStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!hydrated) hydrate()
    const onScroll = () => setVisible(window.scrollY > 240)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [hydrated, hydrate])

  // Sits above the BottomNav (bottom-16 = 64px). Hidden on desktop.
  return (
    <div
      className={`lg:hidden fixed inset-x-0 z-40 bg-white border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 64px)' }}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-stone-400 leading-none mb-0.5">Harga Tiket</p>
          <p className="font-bold text-stone-900 text-base leading-tight">{formatRupiah(price ?? 0)}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 min-h-[48px]"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Maps
            </a>
          )}
          <Link
            href={token ? '#form-ulasan' : '/login'}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors min-h-[48px]"
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Tulis Ulasan
          </Link>
        </div>
      </div>
    </div>
  )
}
