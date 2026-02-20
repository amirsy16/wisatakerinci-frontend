import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getDestinations } from '@/services/destinations'
import { getCategories } from '@/services/categories'
import DestinationCard from '@/components/features/DestinationCard'
import SearchFilterBar from '@/components/features/SearchFilterBar'
import ClientPagination from './ClientPagination'
import Spinner from '@/components/ui/Spinner'

export const metadata: Metadata = {
  title: 'Destinasi Wisata',
  description: 'Temukan semua destinasi wisata di Kabupaten Kerinci, Jambi.',
}

interface PageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    page?: string
    per_page?: string
  }>
}

export default async function WisataPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const per_page = Number(params.per_page ?? 9)
  const search = params.search ?? ''
  const category = params.category ?? ''

  const [destinationsRes, categoriesRes] = await Promise.allSettled([
    getDestinations({ search, category, page, per_page }),
    getCategories(),
  ])

  const { data: destinations, meta } = destinationsRes.status === 'fulfilled'
    ? destinationsRes.value
    : { data: [], meta: { current_page: 1, last_page: 1, total: 0, per_page: 9, from: 0, to: 0 } }
  const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data : []

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-stone-900">Destinasi Wisata Kerinci</h1>
          <p className="text-stone-500 mt-1">
            {meta.total} destinasi ditemukan
            {search ? ` untuk "${search}"` : ''}
            {category ? ` dalam kategori "${category}"` : ''}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-12 bg-stone-100 rounded-xl animate-pulse" />}>
            <SearchFilterBar
              categories={categories}
              initialSearch={search}
              initialCategory={category}
            />
          </Suspense>
        </div>

        {/* Results */}
        {destinations.length === 0 ? (
          <div className="text-center py-20">
            <svg className="mx-auto h-14 w-14 text-stone-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-stone-500 font-medium">Tidak ada destinasi ditemukan.</p>
            <p className="text-stone-400 text-sm mt-1">Coba ubah kata kunci atau hapus filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="mt-10 flex justify-center">
            <ClientPagination currentPage={meta.current_page} lastPage={meta.last_page} />
          </div>
        )}
      </div>
    </div>
  )
}
