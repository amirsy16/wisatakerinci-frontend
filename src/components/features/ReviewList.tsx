import type { Review } from '@/types'
import { formatDate } from '@/lib/format'
import StarRating from '@/components/ui/StarRating'
import Image from 'next/image'

interface ReviewListProps {
  reviews: Review[]
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl bg-stone-50 border border-stone-100 px-6 py-10 text-center">
        <svg className="mx-auto h-10 w-10 text-stone-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <p className="text-stone-500 text-sm">Belum ada ulasan untuk destinasi ini.</p>
        <p className="text-stone-400 text-xs mt-1">Jadilah yang pertama memberikan ulasan!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article key={review.id} className="rounded-xl bg-white border border-stone-100 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="h-9 w-9 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
              {review.user?.avatar_url ? (
                <Image
                  src={review.user.avatar_url}
                  alt={review.user.name}
                  width={36}
                  height={36}
                  className="object-cover h-9 w-9"
                />
              ) : (
                <span className="text-sm font-semibold text-emerald-700">
                  {review.user?.name?.[0] ?? '?'}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-medium text-stone-800 text-sm">
                  {review.user?.name ?? 'Pengguna'}
                </span>
                <span className="text-xs text-stone-400">{formatDate(review.created_at)}</span>
              </div>
              <StarRating value={review.rating} size="sm" />
              <p className="mt-2 text-sm text-stone-700 leading-relaxed">{review.comment}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
