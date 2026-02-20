'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Pagination from '@/components/ui/Pagination'

interface ClientPaginationProps {
  currentPage: number
  lastPage: number
}

export default function ClientPagination({ currentPage, lastPage }: ClientPaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Pagination
      currentPage={currentPage}
      lastPage={lastPage}
      onPageChange={handlePageChange}
    />
  )
}
