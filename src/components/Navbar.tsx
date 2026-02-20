'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { logout } from '@/services/auth'
import Image from 'next/image'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { user, token, clearAuth, hydrate, hydrated } = useAuthStore()

  useEffect(() => {
    if (!hydrated) hydrate()
  }, [hydrate, hydrated])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogout() {
    try { await logout() } catch {}
    clearAuth()
    router.push('/')
    setDropdownOpen(false)
  }

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/wisata', label: 'Destinasi' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-emerald-700">
            <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
            <span className="text-lg tracking-tight">Explore Kerinci</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-emerald-700'
                    : 'text-stone-600 hover:text-emerald-700',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {token && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full pr-3 pl-1 py-1 hover:bg-stone-50 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center">
                    {user.avatar_url ? (
                      <Image src={user.avatar_url} alt={user.name} width={32} height={32} className="object-cover h-8 w-8" />
                    ) : (
                      <span className="text-sm font-semibold text-emerald-700">{user.name[0]}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-stone-700 max-w-[120px] truncate">{user.name}</span>
                  <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-52 rounded-xl border border-stone-100 bg-white shadow-lg py-1 z-50">
                    <Link href="/profil" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profil Saya
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-stone-100" />
                    <button onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login"
                  className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition-colors">
                  Masuk
                </Link>
                <Link href="/register"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
                  Daftar
                </Link>
              </>
            )}
            <Image src="/mylogo.png" alt="Logo" width={36} height={36} className="h-9 w-auto object-contain ml-2" />
          </div>

          {/* Mobile: logo + bell icon — nav handled by BottomNav */}
          <div className="md:hidden flex items-center gap-1">
            <button
              className="p-2 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
              aria-label="Notifikasi"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <Image src="/mylogo.png" alt="Logo" width={32} height={32} className="h-8 w-auto object-contain" />
          </div>
        </div>
      </div>
    </header>
  )
}
