import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import BottomNav from '@/components/BottomNav'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Explore Kerinci — Wisata Alam Kerinci, Jambi',
    template: '%s | Explore Kerinci',
  },
  description:
    'Temukan destinasi wisata terbaik di Kabupaten Kerinci, Jambi. Gunung, air terjun, danau, kebun teh, dan petualangan alam menanti Anda.',
  keywords: ['wisata kerinci', 'gunung kerinci', 'danau kerinci', 'air terjun jambi', 'wisata alam jambi'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        <AuthProvider>
          {children}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  )
}
