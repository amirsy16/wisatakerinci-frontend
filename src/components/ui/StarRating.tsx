'use client'

interface StarRatingProps {
  value: number
  max?: number
  interactive?: boolean
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-6 w-6' }

export default function StarRating({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = 'md',
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} dari ${max} bintang`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i + 1 <= value
        return interactive ? (
          <button
            key={i}
            type="button"
            onClick={() => onChange?.(i + 1)}
            className="focus:outline-none"
            aria-label={`Beri ${i + 1} bintang`}
          >
            <svg
              className={[sizeMap[size], filled ? 'text-amber-400' : 'text-stone-300', 'transition-colors hover:text-amber-400'].join(' ')}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ) : (
          <svg
            key={i}
            className={[sizeMap[size], filled ? 'text-amber-400' : 'text-stone-300'].join(' ')}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      })}
    </div>
  )
}
