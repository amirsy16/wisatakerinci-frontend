'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { adminGetDestinations, adminDeleteDestination } from '@/services/admin'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { formatRupiah } from '@/lib/format'
import type { Destination } from '@/types'

export default function AdminDestinationsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, mutate } = useSWR(['admin-destinations-list', page], () => adminGetDestinations(page))

  const [deleteTarget, setDeleteTarget] = useState<Destination | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminDeleteDestination(deleteTarget.id)
      await mutate()
      setDeleteTarget(null)
    } catch {
      setError('Gagal menghapus destinasi.')
    } finally {
      setDeleting(false)
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, 'green' | 'amber' | 'red'> = {
      active: 'green', draft: 'amber', inactive: 'red'
    }
    return <Badge variant={map[status] ?? 'gray'}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Destinasi</h2>
          <p className="text-sm text-stone-500">Kelola semua destinasi wisata</p>
        </div>
        <Link href="/admin/destinations/new">
          <Button size="sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Destinasi
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        {isLoading || !data ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : data.data.length === 0 ? (
          <p className="text-center text-stone-500 py-16">Belum ada destinasi.</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium text-stone-600">Nama</th>
                    <th className="text-left px-5 py-3 font-medium text-stone-600">Lokasi</th>
                    <th className="text-left px-5 py-3 font-medium text-stone-600">Harga</th>
                    <th className="text-left px-5 py-3 font-medium text-stone-600">Status</th>
                    <th className="text-left px-5 py-3 font-medium text-stone-600">Rating</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {data.data.map((dest) => (
                    <tr key={dest.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-medium text-stone-800">{dest.name}</span>
                      </td>
                      <td className="px-5 py-4 text-stone-500">{dest.location}</td>
                      <td className="px-5 py-4 text-stone-600">{formatRupiah(dest.ticket_price)}</td>
                      <td className="px-5 py-4">{statusBadge(dest.status)}</td>
                      <td className="px-5 py-4 text-stone-500">
                        {dest.rating_avg !== null ? `★ ${dest.rating_avg}` : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/wisata/${dest.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" title="Lihat halaman publik">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Button>
                          </Link>
                          <Link href={`/admin/destinations/${dest.id}/edit`}>
                            <Button variant="outline" size="sm">Edit</Button>
                          </Link>
                          <Button variant="danger" size="sm" onClick={() => setDeleteTarget(dest)}>Hapus</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-stone-100">
              {data.data.map((dest) => (
                <div key={dest.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-stone-800">{dest.name}</span>
                    {statusBadge(dest.status)}
                  </div>
                  <p className="text-xs text-stone-500">{dest.location} · {formatRupiah(dest.ticket_price)}</p>
                  <div className="flex gap-2 mt-2">
                    <Link href={`/admin/destinations/${dest.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => setDeleteTarget(dest)}>Hapus</Button>
                  </div>
                </div>
              ))}
            </div>

            {data.meta.last_page > 1 && (
              <div className="py-5 flex justify-center border-t border-stone-100">
                <Pagination currentPage={page} lastPage={data.meta.last_page} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Destinasi"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Hapus</Button>
          </>
        }
      >
        <p className="text-sm text-stone-600">
          Yakin ingin menghapus <strong>{deleteTarget?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  )
}
