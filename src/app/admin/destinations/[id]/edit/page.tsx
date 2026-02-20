'use client'

import { use } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { adminGetDestination } from '@/services/admin'
import DestinationForm from '../../DestinationForm'
import Spinner from '@/components/ui/Spinner'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditDestinationPage({ params }: PageProps) {
  const { id } = use(params)
  const { data, isLoading } = useSWR(['admin-destination', id], () => adminGetDestination(Number(id)))

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/destinations" className="text-sm text-stone-500 hover:text-stone-700 flex items-center gap-1 mb-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
        <h2 className="text-xl font-bold text-stone-900">Edit Destinasi</h2>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        {isLoading || !data ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : (
          <DestinationForm initial={data.data} destinationId={Number(id)} />
        )}
      </div>
    </div>
  )
}
