'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login } from '@/services/auth'
import { useAuthStore } from '@/store/authStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')

    const newErrors: Record<string, string> = {}
    if (!form.email) newErrors.email = 'Email wajib diisi.'
    if (!form.password) newErrors.password = 'Password wajib diisi.'
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }

    setLoading(true)
    try {
      const res = await login(form.email, form.password)
      setAuth(res.data.user, res.data.token)
      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        setGlobalError(axiosErr.response?.data?.message ?? 'Login gagal.')
      } else {
        setGlobalError('Login gagal. Periksa koneksi Anda.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Back to home */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-emerald-600 transition-colors mb-4 group"
      >
        <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Beranda
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-700 font-bold text-xl mb-4">
            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
            Explore Kerinci
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">Masuk ke Akun</h1>
          <p className="text-sm text-stone-500 mt-1">Selamat datang kembali!</p>
        </div>

        {globalError && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="nama@email.com"
            autoComplete="email"
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
            placeholder="Masukkan password"
            autoComplete="current-password"
            error={errors.password}
          />
          <Button type="submit" loading={loading} className="w-full mt-2">
            Masuk
          </Button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-700">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
