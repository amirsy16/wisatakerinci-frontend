import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDestinationBySlug } from '@/services/destinations'
import DestinationGallery from '@/components/features/DestinationGallery'
import ReviewList from '@/components/features/ReviewList'
import ReviewForm from '@/components/features/ReviewForm'
import MapEmbed from '@/components/features/MapEmbed'
import BackButton from '@/components/features/BackButton'
import StickyDetailCTA from '@/components/features/StickyDetailCTA'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import { formatRupiah, formatRating } from '@/lib/format'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const res = await getDestinationBySlug(slug)
    const dest = res.data
    return {
      title: dest.name,
      description: dest.description.slice(0, 160),
    }
  } catch {
    return { title: 'Destinasi Tidak Ditemukan' }
  }
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { slug } = await params

  let destination
  try {
    const res = await getDestinationBySlug(slug)
    destination = res.data
  } catch {
    notFound()
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ─── Hero Gallery (full-width, no margin) ─────────────────────────── */}
      <div className="relative">
        <BackButton />
        <DestinationGallery images={destination.images} name={destination.name} />
      </div>

      {/* ─── Content ──────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 pb-8 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Info + Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title block */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {destination.categories.map((cat) => (
                  <Badge key={cat.id} variant="emerald">{cat.name}</Badge>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">{destination.name}</h1>
              <p className="flex items-center gap-1.5 text-sm text-stone-500 mt-2">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {destination.location}
              </p>
            </div>

            {/* Rating (mobile) */}
            {destination.rating_avg !== null && (
              <div className="lg:hidden flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-100 p-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">{destination.rating_avg}</p>
                  <p className="text-xs text-amber-500">dari 5</p>
                </div>
                <div>
                  <StarRating value={Math.round(destination.rating_avg)} />
                  <p className="text-xs text-stone-500 mt-1">{destination.review_count} ulasan</p>
                </div>
              </div>
            )}

            {/* Info pills (mobile) */}
            <div className="lg:hidden flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-stone-50 border border-stone-100 px-4 py-2.5">
                <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span className="text-sm font-medium text-stone-800">{formatRupiah(destination.ticket_price)}</span>
              </div>
              {destination.open_hours && (
                <div className="flex items-center gap-2 rounded-xl bg-stone-50 border border-stone-100 px-4 py-2.5">
                  <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-stone-800">{destination.open_hours}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-2">Tentang Destinasi</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{destination.description}</p>
            </div>

            {/* Map (mobile — below description) */}
            <div className="lg:hidden space-y-3">
              <MapEmbed mapUrl={destination.map_url} name={destination.name} />
              {destination.map_url && (
                <a href={destination.map_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors min-h-[48px]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Buka di Google Maps
                </a>
              )}
            </div>

            {/* Reviews */}
            <section id="form-ulasan">
              <h2 className="text-xl font-bold text-stone-900 mb-5">
                Ulasan Pengunjung
                {destination.review_count > 0 && (
                  <span className="ml-2 text-sm font-normal text-stone-500">
                    ({destination.review_count})
                  </span>
                )}
              </h2>
              <div className="space-y-6">
                <ReviewForm destinationId={destination.id} />
                <ReviewList reviews={destination.reviews} />
              </div>
            </section>
          </div>

          {/* Right: Info sidebar (desktop only) */}
          <aside className="hidden lg:block space-y-6">
            {destination.rating_avg !== null && (
              <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-100 p-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">{destination.rating_avg}</p>
                  <p className="text-xs text-amber-500">dari 5</p>
                </div>
                <div>
                  <StarRating value={Math.round(destination.rating_avg)} />
                  <p className="text-xs text-stone-500 mt-1">{destination.review_count} ulasan</p>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-stone-100 bg-stone-50 divide-y divide-stone-100">
              <div className="flex items-center gap-3 px-4 py-3">
                <svg className="h-5 w-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <div>
                  <p className="text-xs text-stone-500">Harga Tiket</p>
                  <p className="text-sm font-semibold text-stone-800">{formatRupiah(destination.ticket_price)}</p>
                </div>
              </div>
              {destination.open_hours && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <svg className="h-5 w-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-stone-500">Jam Buka</p>
                    <p className="text-sm font-semibold text-stone-800">{destination.open_hours}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 px-4 py-3">
                <svg className="h-5 w-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-xs text-stone-500">Lokasi</p>
                  <p className="text-sm font-semibold text-stone-800">{destination.location}</p>
                </div>
              </div>
            </div>

            <MapEmbed mapUrl={destination.map_url} name={destination.name} />

            {destination.map_url && (
              <a href={destination.map_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors min-h-[48px]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Buka di Google Maps
              </a>
            )}
          </aside>
        </div>
      </div>

      {/* ─── Sticky Bottom CTA (mobile only, appears on scroll) ─────────── */}
      <StickyDetailCTA price={destination.ticket_price} mapUrl={destination.map_url} />
    </div>
  )
}
