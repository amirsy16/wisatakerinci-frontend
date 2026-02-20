'use client'

import { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Suspense } from 'react'
import useSWR from 'swr'
import {
  adminGetReviews,
  adminApproveReview,
  adminRejectReview,
  adminDeleteReview,
} from '@/services/admin'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import Modal from '@/components/ui/Modal'
import { formatDate } from '@/lib/format'
import type { Review } from '@/types'

function ReviewsContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const statusParam = searchParams.get('status') as 'pending' | 'approved' | null
  const [page, setPage] = useState(1)

  const { data, isLoading, mutate } = useSWR(
    ['admin-reviews', statusParam, page],
    () => adminGetReviews(statusParam ?? undefined, page)
  )

  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  function setStatus(val: string) {
    const params = new URLSearchParams()
    if (val) params.set('status', val)
    setPage(1)
    router.push(`${pathname}?${params.toString()}`)
  }

  async function handleApprove(id: number) {
    setActionLoading(id)
    try { await adminApproveReview(id); await mutate() }
    catch { setError('Gagal menyetujui ulasan.') }
    finally { setActionLoading(null) }
  }

  async function handleReject(id: number) {
    setActionLoading(id)
    try { await adminRejectReview(id); await mutate() }
    catch { setError('Gagal menolak ulasan.') }
    finally { setActionLoading(null) }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try { await adminDeleteReview(deleteTarget.id); await mutate(); setDeleteTarget(null) }
    catch { setError('Gagal menghapus ulasan.') }
    finally { setDeleting(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Moderasi Ulasan</h2>
        <p className="text-sm text-stone-500">Setujui atau tolak ulasan pengunjung</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 bg-stone-100 rounded-xl p-1 w-fit">
        {[['', 'Semua'], ['pending', 'Pending'], ['approved', 'Disetujui']].map(([val, label]) => (
          <button key={val} onClick={() => setStatus(val)}
            className={[
              'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
              (statusParam ?? '') === val ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500 hover:text-stone-700',
            ].join(' ')}>
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        {isLoading || !data ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : data.data.length === 0 ? (
          <p className="text-center text-stone-500 py-16">Tidak ada ulasan ditemukan.</p>
        ) : (
          <div className="divide-y divide-stone-50">
            {data.data.map((review) => (
              <div key={review.id} className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-stone-800 text-sm">
                        {review.user?.name ?? 'Pengguna'}
                      </span>
                      <span className="text-xs text-stone-400">{formatDate(review.created_at)}</span>
                      <Badge variant={review.approved_at ? 'green' : 'amber'}>
                        {review.approved_at ? 'Disetujui' : 'Pending'}
                      </Badge>
                    </div>
                    {review.destination && (
                      <p className="text-xs text-stone-400 mt-0.5">
                        Destinasi: <span className="text-emerald-600">{review.destination.name}</span>
                      </p>
                    )}
                    <StarRating value={review.rating} size="sm" />
                    <p className="text-sm text-stone-700 mt-2">{review.comment}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {!review.approved_at && (
                    <Button size="sm" variant="primary" loading={actionLoading === review.id}
                      onClick={() => handleApprove(review.id)}>
                      Setujui
                    </Button>
                  )}
                  {review.approved_at && (
                    <Button size="sm" variant="outline" loading={actionLoading === review.id}
                      onClick={() => handleReject(review.id)}>
                      Kembalikan ke Pending
                    </Button>
                  )}
                  <Button size="sm" variant="danger" onClick={() => setDeleteTarget(review)}>Hapus</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {data && data.meta.last_page > 1 && (
          <div className="py-5 flex justify-center border-t border-stone-100">
            <Pagination currentPage={page} lastPage={data.meta.last_page} onPageChange={setPage} />
          </div>
        )}
      </div>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Ulasan"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Hapus</Button>
          </>
        }
      >
        <p className="text-sm text-stone-600">
          Yakin ingin menghapus ulasan dari <strong>{deleteTarget?.user?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  )
}

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><Spinner /></div>}>
      <ReviewsContent />
    </Suspense>
  )
}
