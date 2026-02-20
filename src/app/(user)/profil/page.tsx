'use client'

import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import { getProfile, updateProfile, getUserReviews } from '@/services/user'
import { useAuthStore } from '@/store/authStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import StarRating from '@/components/ui/StarRating'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/format'
import type { Review } from '@/types'

export default function ProfilPage() {
  const { setAuth, user: storeUser } = useAuthStore()

  // Profile
  const { data: profileRes, mutate: mutateProfile } = useSWR('profile', getProfile)
  const user = profileRes?.data ?? storeUser

  // Reviews
  const [reviewPage, setReviewPage] = useState(1)
  const { data: reviewsRes, isLoading: reviewsLoading } = useSWR(
    ['reviews', reviewPage],
    () => getUserReviews(reviewPage)
  )

  // Form state
  const [form, setForm] = useState({ name: '', email: '', current_password: '', password: '', password_confirmation: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [updating, setUpdating] = useState(false)
  const [success, setSuccess] = useState('')
  const [globalError, setGlobalError] = useState('')
  const avatarRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setForm((prev) => ({ ...prev, name: user.name, email: user.email }))
    }
  }, [user])

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')
    setSuccess('')

    const fd = new FormData()
    if (form.name) fd.append('name', form.name)
    if (form.email) fd.append('email', form.email)
    if (avatarRef.current?.files?.[0]) fd.append('avatar', avatarRef.current.files[0])
    if (form.password) {
      fd.append('current_password', form.current_password)
      fd.append('password', form.password)
      fd.append('password_confirmation', form.password_confirmation)
    }

    setUpdating(true)
    try {
      const res = await updateProfile(fd)
      setAuth(res.data, localStorage.getItem('token') ?? '')
      await mutateProfile()
      setSuccess('Profil berhasil diperbarui!')
      setForm((prev) => ({ ...prev, current_password: '', password: '', password_confirmation: '' }))
      setAvatarPreview(null)
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
          setGlobalError(axiosErr.response?.data?.message ?? 'Gagal memperbarui profil.')
        }
      } else {
        setGlobalError('Gagal terhubung ke server.')
      }
    } finally {
      setUpdating(false)
    }
  }

  if (!user) return (
    <div className="flex items-center justify-center py-32">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <h1 className="text-2xl font-bold text-stone-900">Profil Saya</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h2 className="font-semibold text-stone-800 mb-6">Edit Profil</h2>

            {success && (
              <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}
            {globalError && (
              <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {globalError}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
                  {avatarPreview ? (
                    <Image src={avatarPreview} alt="Avatar baru" width={64} height={64} className="object-cover h-16 w-16" />
                  ) : user.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.name} width={64} height={64} className="object-cover h-16 w-16" />
                  ) : (
                    <span className="text-2xl font-bold text-emerald-700">{user.name[0]}</span>
                  )}
                </div>
                <div>
                  <Button type="button" variant="outline" size="sm" onClick={() => avatarRef.current?.click()}>
                    Ganti Foto
                  </Button>
                  <p className="text-xs text-stone-400 mt-1">JPG, PNG, max 2MB</p>
                  <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
              </div>

              <Input label="Nama Lengkap" value={form.name} onChange={(e) => setField('name', e.target.value)} error={errors.name} />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} error={errors.email} />

              <hr className="border-stone-100" />
              <p className="text-sm font-medium text-stone-600">Ubah Password (opsional)</p>

              <Input
                label="Password Saat Ini"
                type="password"
                value={form.current_password}
                onChange={(e) => setField('current_password', e.target.value)}
                error={errors.current_password}
                placeholder="Password lama Anda"
              />
              <Input
                label="Password Baru"
                type="password"
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                error={errors.password}
                placeholder="Minimal 8 karakter"
              />
              <Input
                label="Konfirmasi Password Baru"
                type="password"
                value={form.password_confirmation}
                onChange={(e) => setField('password_confirmation', e.target.value)}
                error={errors.password_confirmation}
                placeholder="Ulangi password baru"
              />

              <Button type="submit" loading={updating}>Simpan Perubahan</Button>
            </form>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 text-center">
            <div className="h-20 w-20 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center mx-auto mb-3">
              {user.avatar_url ? (
                <Image src={user.avatar_url} alt={user.name} width={80} height={80} className="object-cover h-20 w-20" />
              ) : (
                <span className="text-3xl font-bold text-emerald-700">{user.name[0]}</span>
              )}
            </div>
            <p className="font-semibold text-stone-800">{user.name}</p>
            <p className="text-sm text-stone-500">{user.email}</p>
            <div className="mt-2">
              <Badge variant={user.role === 'admin' ? 'green' : 'gray'}>
                {user.role === 'admin' ? 'Administrator' : 'Member'}
              </Badge>
            </div>
            {user.role === 'admin' && (
              <Link href="/admin"
                className="mt-4 block text-sm font-medium text-emerald-600 hover:text-emerald-700">
                → Buka Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <h2 className="font-semibold text-stone-800 mb-5">Riwayat Ulasan Saya</h2>
        {reviewsLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : !reviewsRes?.data?.length ? (
          <p className="text-sm text-stone-500 text-center py-8">Anda belum memberikan ulasan.</p>
        ) : (
          <>
            <div className="space-y-4">
              {reviewsRes.data.map((review: Review) => (
                <div key={review.id} className="rounded-xl bg-stone-50 border border-stone-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {review.destination && (
                        <Link href={`/wisata/${review.destination.slug}`}
                          className="text-sm font-semibold text-emerald-700 hover:underline">
                          {review.destination.name}
                        </Link>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating value={review.rating} size="sm" />
                        <span className="text-xs text-stone-400">{formatDate(review.created_at)}</span>
                      </div>
                      <p className="text-sm text-stone-600 mt-2">{review.comment}</p>
                    </div>
                    <Badge variant={review.approved_at ? 'green' : 'amber'}>
                      {review.approved_at ? 'Disetujui' : 'Menunggu'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            {reviewsRes.meta.last_page > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={reviewPage}
                  lastPage={reviewsRes.meta.last_page}
                  onPageChange={setReviewPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
