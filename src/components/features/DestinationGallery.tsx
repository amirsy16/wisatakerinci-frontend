'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { DestinationImage } from '@/types'

interface DestinationGalleryProps {
  images: DestinationImage[]
  name: string
}

export default function DestinationGallery({ images, name }: DestinationGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Normalize http → https (Railway backend kadang return http)
  const normalizeUrl = (url: string) => url?.replace(/^http:\/\//, 'https://')

  if (images.length === 0) {
    return (
      <div className="w-full h-80 bg-stone-100 rounded-2xl flex items-center justify-center">
        <svg className="h-14 w-14 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  const active = images[activeIndex]

  function prev() { setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1)) }
  function next() { setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1)) }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative w-full h-80 md:h-[28rem] rounded-2xl overflow-hidden bg-stone-100 cursor-pointer"
        onClick={() => setLightboxOpen(true)}>
        <Image
          src={normalizeUrl(active.image_url)}
          alt={`${name} - foto ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
              aria-label="Foto sebelumnya">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
              aria-label="Foto berikutnya">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs rounded-full px-2.5 py-1">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={['relative h-16 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all',
                idx === activeIndex ? 'border-emerald-500' : 'border-transparent opacity-60 hover:opacity-100'].join(' ')}
            >
              <Image src={normalizeUrl(img.image_url)} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white"
            aria-label="Tutup">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-4xl w-full max-h-[90vh] aspect-video" onClick={(e) => e.stopPropagation()}>
            <Image src={normalizeUrl(active.image_url)} alt={`${name} - foto ${activeIndex + 1}`} fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </div>
  )
}
