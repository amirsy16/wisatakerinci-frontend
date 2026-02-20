'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { logout } from '@/services/auth'
import Spinner from '@/components/ui/Spinner'
import Image from 'next/image'

interface SidebarProps {
  pathname: string
  user: { name: string; email: string; avatar_url?: string | null; role: string } | null
  onNavigate: () => void
  onLogout: () => void
}

function Sidebar({ pathname, user, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className="flex h-full flex-col bg-stone-900 w-64">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-stone-800">
        <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
        <span className="font-bold text-white">Admin Panel</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              onClick={onNavigate}
              className={[
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-emerald-600 text-white'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white',
              ].join(' ')}>
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-stone-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-emerald-700 flex items-center justify-center shrink-0">
            {user?.avatar_url ? (
              <Image src={user.avatar_url} alt={user.name} width={32} height={32} className="object-cover rounded-full h-8 w-8" />
            ) : (
              <span className="text-sm font-semibold text-white">{user?.name[0]}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-stone-400 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="flex-1 rounded-lg bg-stone-800 hover:bg-stone-700 px-3 py-1.5 text-xs text-center text-stone-300 transition-colors">
            Beranda
          </Link>
          <button onClick={onLogout}
            className="flex-1 rounded-lg bg-stone-800 hover:bg-red-900 px-3 py-1.5 text-xs text-stone-300 hover:text-red-300 transition-colors">
            Keluar
          </button>
        </div>
      </div>
    </aside>
  )
}

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/admin/destinations',
    label: 'Destinasi',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/reviews',
    label: 'Ulasan',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    href: '/admin/categories',
    label: 'Kategori',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, token, hydrated, hydrate, clearAuth } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!hydrated) hydrate()
  }, [hydrated, hydrate])

  useEffect(() => {
    if (hydrated && (!token || user?.role !== 'admin')) {
      router.replace(token ? '/' : '/login')
    }
  }, [hydrated, token, user, router])

  if (!hydrated || !token || user?.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  async function handleLogout() {
    try { await logout() } catch {}
    clearAuth()
    router.push('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-stone-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar pathname={pathname} user={user} onNavigate={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex h-full w-64">
            <Sidebar pathname={pathname} user={user} onNavigate={() => setSidebarOpen(false)} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <div className="flex h-16 items-center gap-4 bg-white border-b border-stone-200 px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100"
            aria-label="Buka sidebar">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-stone-600">
              {navItems.find((n) =>
                n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href)
              )?.label ?? 'Admin Panel'}
            </h1>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
