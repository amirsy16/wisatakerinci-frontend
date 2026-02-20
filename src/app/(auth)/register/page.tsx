'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { register } from '@/services/auth'
import { useAuthStore } from '@/store/authStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
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
    if (!form.name.trim()) newErrors.name = 'Nama wajib diisi.'
    if (!form.email) newErrors.email = 'Email wajib diisi.'
    if (!form.password || form.password.length < 8) newErrors.password = 'Password minimal 8 karakter.'
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = 'Konfirmasi password tidak cocok.'
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }

    setLoading(true)
    try {
      const res = await register(form.name, form.email, form.password, form.password_confirmation)
      setAuth(res.data.user, res.data.token)
      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } }
        if (axiosErr.response?.status === 422 && axiosErr.response.data?.errors) {
          const apiErrors: Record<string, string> = {}
          for (const [key, msgs] of Object.entries(axiosErr.response.data.errors)) {
            apiErrors[key] = msgs[0]
          }
          setErrors(apiErrors)
        } else {
          setGlobalError(axiosErr.response?.data?.message ?? 'Pendaftaran gagal.')
        }
      } else {
        setGlobalError('Gagal terhubung ke server.')
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
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-700 font-bold text-xl mb-4">
            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
            Explore Kerinci
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">Buat Akun Baru</h1>
          <p className="text-sm text-stone-500 mt-1">Gratis dan mudah!</p>
        </div>

        {globalError && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            type="text"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Nama Anda"
            autoComplete="name"
            error={errors.name}
          />
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
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            error={errors.password}
          />
          <Input
            label="Konfirmasi Password"
            type="password"
            value={form.password_confirmation}
            onChange={(e) => setField('password_confirmation', e.target.value)}
            placeholder="Ulangi password"
            autoComplete="new-password"
            error={errors.password_confirmation}
          />
          <Button type="submit" loading={loading} className="w-full mt-2">
            Daftar Sekarang
          </Button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
