interface MapEmbedProps {
  mapUrl: string | null
  name: string
}

export default function MapEmbed({ mapUrl, name }: MapEmbedProps) {
  if (!mapUrl) return null

  // Convert Maps URL to embed format if needed
  // If it's a standard maps.google.com URL with coordinates, extract them for embed
  const embedSrc = (() => {
    // Already an embed URL
    if (mapUrl.includes('maps/embed')) return mapUrl
    // Standard Google Maps URL
    const coordMatch = mapUrl.match(/q=([^&]+)/)
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]}&output=embed`
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(name)}&output=embed`
  })()

  return (
    <div className="rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
      <iframe
        src={embedSrc}
        title={`Peta ${name}`}
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
