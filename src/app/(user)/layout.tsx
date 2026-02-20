'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Spinner from '@/components/ui/Spinner'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { token, hydrated } = useAuthStore()

  useEffect(() => {
    if (hydrated && !token) {
      router.replace('/login')
    }
  }, [hydrated, token, router])

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!token) return null

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-stone-50 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
    </div>
  )
}
