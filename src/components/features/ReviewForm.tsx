'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { submitReview } from '@/services/reviews'
import StarRating from '@/components/ui/StarRating'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Link from 'next/link'

interface ReviewFormProps {
  destinationId: number
}

export default function ReviewForm({ destinationId }: ReviewFormProps) {
  const router = useRouter()
  const { token } = useAuthStore()

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-6 text-center">
        <p className="text-stone-700 text-sm mb-3">
          Anda harus masuk untuk memberikan ulasan.
        </p>
        <Link href="/login"
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
          Masuk Sekarang
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
        <svg className="mx-auto h-10 w-10 text-emerald-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium text-emerald-800">Ulasan berhasil dikirim!</p>
        <p className="text-sm text-emerald-600 mt-1">Ulasan Anda sedang menunggu persetujuan admin.</p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (rating === 0) { setError('Pilih rating bintang terlebih dahulu.'); return }
    if (comment.trim().length < 10) { setError('Komentar minimal 10 karakter.'); return }

    setLoading(true)
    try {
      await submitReview(destinationId, rating, comment)
      setSuccess(true)
      router.refresh()
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        setError(axiosErr.response?.data?.message ?? 'Gagal mengirim ulasan.')
      } else {
        setError('Gagal mengirim ulasan.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white border border-stone-100 p-6 shadow-sm space-y-4">
      <h3 className="font-semibold text-stone-800">Tulis Ulasan</h3>

      <div className="space-y-1">
        <p className="text-sm font-medium text-stone-700">Rating</p>
        <StarRating value={rating} interactive onChange={setRating} size="lg" />
      </div>

      <Textarea
        label="Komentar"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Ceritakan pengalaman Anda di destinasi ini..."
        rows={4}
        minLength={10}
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <Button type="submit" loading={loading} className="w-full">
        Kirim Ulasan
      </Button>
    </form>
  )
}
