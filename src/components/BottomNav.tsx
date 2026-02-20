'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Image from 'next/image'
import { useEffect } from 'react'

export default function BottomNav() {
  const pathname = usePathname()
  const { user, token, hydrated, hydrate } = useAuthStore()

  useEffect(() => {
    if (!hydrated) hydrate()
  }, [hydrated, hydrate])

  // Hide on admin and auth pages
  if (
    pathname.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return null
  }

  const profileHref = token ? '/profil' : '/login'
  const ulasanHref = token ? '/profil' : '/login'

  const isHome = pathname === '/'
  const isWisata = pathname.startsWith('/wisata')
  const isProfil = pathname === '/profil'

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200">
      <div className="grid grid-cols-4">
        {/* Beranda */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-0.5 h-16 transition-colors ${isHome ? 'text-emerald-600' : 'text-stone-400'}`}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill={isHome ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isHome ? 0 : 1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-medium leading-none">Beranda</span>
        </Link>

        {/* Eksplor */}
        <Link
          href="/wisata"
          className={`flex flex-col items-center justify-center gap-0.5 h-16 transition-colors ${isWisata ? 'text-emerald-600' : 'text-stone-400'}`}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isWisata ? 2.5 : 1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[10px] font-medium leading-none">Eksplor</span>
        </Link>

        {/* Ulasan */}
        <Link
          href={ulasanHref}
          className={`flex flex-col items-center justify-center gap-0.5 h-16 transition-colors ${isProfil && !!token ? 'text-emerald-600' : 'text-stone-400'}`}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isProfil && !!token ? 2.5 : 1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <span className="text-[10px] font-medium leading-none">Ulasan</span>
        </Link>

        {/* Profil */}
        <Link
          href={profileHref}
          className={`flex flex-col items-center justify-center gap-0.5 h-16 transition-colors ${(isProfil && !!token) || pathname === '/login' ? 'text-emerald-600' : 'text-stone-400'}`}
        >
          {hydrated && token && user?.avatar_url ? (
            <div className={`h-7 w-7 rounded-full overflow-hidden border-2 ${isProfil ? 'border-emerald-500' : 'border-stone-200'}`}>
              <Image src={user.avatar_url} alt={user.name} width={28} height={28} className="object-cover w-full h-full" />
            </div>
          ) : (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill={(isProfil && !!token) || pathname === '/login' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
          <span className="text-[10px] font-medium leading-none">Profil</span>
        </Link>
      </div>
      {/* iOS safe area spacer */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
