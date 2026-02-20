import Button from './Button'

interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null

  const pages: (number | '...')[] = []
  for (let i = 1; i <= lastPage; i++) {
    if (i === 1 || i === lastPage || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Navigasi halaman">
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Halaman sebelumnya"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-stone-400 select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={[
              'h-8 w-8 rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-emerald-600 text-white'
                : 'text-stone-600 hover:bg-stone-100',
            ].join(' ')}
          >
            {page}
          </button>
        )
      )}

      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Halaman berikutnya"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </nav>
  )
}
