import Image from 'next/image'
import Link from 'next/link'
import type { Destination } from '@/types'
import { formatRating } from '@/lib/format'
import Badge from '@/components/ui/Badge'

interface DestinationCardProps {
  destination: Destination
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const primaryImage = destination.images.find((img) => img.is_primary) ?? destination.images[0]
  // Normalize http → https (Railway backend kadang return http)
  const imageUrl = primaryImage?.image_url?.replace(/^http:\/\//, 'https://')

  return (
    <Link href={`/wisata/${destination.slug}`} className="group block">
      <article className="rounded-2xl overflow-hidden bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative h-52 bg-stone-100 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={destination.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <svg className="h-12 w-12 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Categories */}
          {destination.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {destination.categories.slice(0, 2).map((cat) => (
                <Badge key={cat.id} variant="emerald">{cat.name}</Badge>
              ))}
            </div>
          )}

          <h3 className="font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {destination.name}
          </h3>

          {/* Location */}
          <p className="flex items-center gap-1 text-xs text-stone-500">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{destination.location}</span>
          </p>

          {/* Rating & Hours */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <div className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{destination.rating_avg !== null ? `${destination.rating_avg} (${destination.review_count})` : 'Belum ada ulasan'}</span>
            </div>
            {destination.open_hours && (
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {destination.open_hours}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
