'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm pl-3 pr-4 py-2 text-sm font-medium text-white hover:bg-black/60 transition-colors min-h-[44px]"
      aria-label="Kembali"
    >
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span>Kembali</span>
    </button>
  )
}
