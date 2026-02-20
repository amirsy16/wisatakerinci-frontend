import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-stone-50 flex items-center justify-center py-12 px-4">
        {children}
      </main>
      <Footer />
    </div>
  )
}
