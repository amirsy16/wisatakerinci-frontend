'use client'

import { useState } from 'react'
import useSWR from 'swr'
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  type CategoryWithCount,
} from '@/services/admin'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'

export default function AdminCategoriesPage() {
  const { data, isLoading, mutate } = useSWR('admin-categories-page', adminGetCategories)

  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')

  const [editTarget, setEditTarget] = useState<CategoryWithCount | null>(null)
  const [editName, setEditName] = useState('')
  const [editing, setEditing] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<CategoryWithCount | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [globalError, setGlobalError] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) { setAddError('Nama kategori wajib diisi.'); return }
    setAdding(true)
    try {
      await adminCreateCategory(newName.trim())
      await mutate()
      setNewName('')
      setAddError('')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        setAddError(axiosErr.response?.data?.message ?? 'Gagal menambah kategori.')
      }
    } finally {
      setAdding(false)
    }
  }

  async function handleEdit() {
    if (!editTarget || !editName.trim()) return
    setEditing(true)
    try {
      await adminUpdateCategory(editTarget.id, editName.trim())
      await mutate()
      setEditTarget(null)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        setGlobalError(axiosErr.response?.data?.message ?? 'Gagal memperbarui kategori.')
      }
    } finally {
      setEditing(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminDeleteCategory(deleteTarget.id)
      await mutate()
      setDeleteTarget(null)
    } catch {
      setGlobalError('Gagal menghapus kategori.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Kategori</h2>
        <p className="text-sm text-stone-500">Kelola kategori wisata</p>
      </div>

      {globalError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{globalError}</div>
      )}

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
        <h3 className="font-medium text-stone-700 mb-4 text-sm">Tambah Kategori Baru</h3>
        <form onSubmit={handleAdd} className="flex gap-3">
          <div className="flex-1">
            <Input
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setAddError('') }}
              placeholder="Nama kategori baru"
              error={addError}
            />
          </div>
          <Button type="submit" loading={adding} size="md">Tambah</Button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        {isLoading || !data ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : data.data.length === 0 ? (
          <p className="text-center text-stone-500 py-16">Belum ada kategori.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-stone-600">Nama</th>
                <th className="text-left px-5 py-3 font-medium text-stone-600">Slug</th>
                <th className="text-left px-5 py-3 font-medium text-stone-600">Destinasi</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {data.data.map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-stone-800">{cat.name}</td>
                  <td className="px-5 py-3.5 text-stone-400 font-mono text-xs">{cat.slug}</td>
                  <td className="px-5 py-3.5 text-stone-500">{cat.destinations_count ?? 0}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => { setEditTarget(cat); setEditName(cat.name) }}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteTarget(cat)}>
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Kategori"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditTarget(null)}>Batal</Button>
            <Button loading={editing} onClick={handleEdit}>Simpan</Button>
          </>
        }
      >
        <Input
          label="Nama Kategori"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          autoFocus
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Kategori"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Hapus</Button>
          </>
        }
      >
        <p className="text-sm text-stone-600">
          Yakin ingin menghapus kategori <strong>{deleteTarget?.name}</strong>?
        </p>
      </Modal>
    </div>
  )
}
