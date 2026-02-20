'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { adminCreateDestination, adminUpdateDestination, type DestinationPayload } from '@/services/admin'
import { adminGetCategories } from '@/services/admin'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import type { DestinationDetail } from '@/types'

interface DestinationFormProps {
  initial?: Partial<DestinationDetail>
  destinationId?: number
}

export default function DestinationForm({ initial, destinationId }: DestinationFormProps) {
  const router = useRouter()
  const { data: categoriesRes } = useSWR('admin-categories-form', adminGetCategories)

  const [form, setForm] = useState<{
    name: string
    description: string
    location: string
    map_url: string
    ticket_price: string
    open_hours: string
    status: 'active' | 'draft' | 'inactive'
    categories: number[]
  }>({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    location: initial?.location ?? '',
    map_url: initial?.map_url ?? '',
    ticket_price: String(initial?.ticket_price ?? 0),
    open_hours: initial?.open_hours ?? '',
    status: initial?.status ?? 'draft',
    categories: initial?.categories?.map((c) => c.id) ?? [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')

  function setField(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function toggleCategory(id: number) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')

    const newErrors: Record<string, string> = {}
    if (!destinationId && !form.name.trim()) newErrors.name = 'Nama wajib diisi.'
    if (!destinationId && !form.description.trim()) newErrors.description = 'Deskripsi wajib diisi.'
    if (!destinationId && !form.location.trim()) newErrors.location = 'Lokasi wajib diisi.'
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }

    const payload: DestinationPayload = {
      name: form.name || undefined,
      description: form.description || undefined,
      location: form.location || undefined,
      map_url: form.map_url || null,
      ticket_price: Number(form.ticket_price) || 0,
      open_hours: form.open_hours || null,
      status: form.status,
      categories: form.categories,
    }

    setLoading(true)
    try {
      if (destinationId) {
        await adminUpdateDestination(destinationId, payload)
      } else {
        await adminCreateDestination(payload)
      }
      router.push('/admin/destinations')
      router.refresh()
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } }
        if (axiosErr.response?.status === 422 && axiosErr.response.data?.errors) {
          const apiErrors: Record<string, string> = {}
          for (const [key, msgs] of Object.entries(axiosErr.response.data.errors)) {
            apiErrors[key] = msgs[0]
          }
          setErrors(apiErrors)
        } else {
          setGlobalError(axiosErr.response?.data?.message ?? 'Gagal menyimpan destinasi.')
        }
      } else {
        setGlobalError('Gagal menyimpan destinasi.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {globalError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {globalError}
        </div>
      )}

      <Input label="Nama Destinasi" value={form.name} onChange={(e) => setField('name', e.target.value)} error={errors.name}
        placeholder="contoh: Gunung Kerinci" />

      <Textarea label="Deskripsi" value={form.description} onChange={(e) => setField('description', e.target.value)}
        error={errors.description} rows={5} placeholder="Ceritakan tentang destinasi ini..." />

      <Input label="Lokasi" value={form.location} onChange={(e) => setField('location', e.target.value)}
        error={errors.location} placeholder="contoh: Kayu Aro, Kerinci, Jambi" />

      <Input label="URL Google Maps (opsional)" value={form.map_url}
        onChange={(e) => setField('map_url', e.target.value)} error={errors.map_url}
        placeholder="https://maps.google.com/?q=-1.697,101.264" />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Harga Tiket (Rp)" type="number" min={0} value={form.ticket_price}
          onChange={(e) => setField('ticket_price', e.target.value)} error={errors.ticket_price}
          helperText="Isi 0 untuk gratis" />

        <Input label="Jam Buka (opsional)" value={form.open_hours}
          onChange={(e) => setField('open_hours', e.target.value)} error={errors.open_hours}
          placeholder="07:00 - 17:00" />
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-stone-700">Status</label>
        <select
          value={form.status}
          onChange={(e) => setField('status', e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-200"
        >
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Categories */}
      {categoriesRes?.data && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-stone-700">Kategori</p>
          <div className="flex flex-wrap gap-2">
            {categoriesRes.data.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={[
                  'rounded-full px-3 py-1 text-sm font-medium border transition-colors',
                  form.categories.includes(cat.id)
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-400',
                ].join(' ')}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {destinationId ? 'Simpan Perubahan' : 'Buat Destinasi'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Batal</Button>
      </div>
    </form>
  )
}
