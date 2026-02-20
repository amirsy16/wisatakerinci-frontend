'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { adminGetDestinations, adminGetReviews, adminGetCategories } from '@/services/admin'
import Spinner from '@/components/ui/Spinner'

export default function AdminDashboard() {
  const { data: destinationsRes } = useSWR('admin-destinations', () => adminGetDestinations(1))
  const { data: pendingReviewsRes } = useSWR('admin-reviews-pending', () => adminGetReviews('pending', 1))
  const { data: categoriesRes } = useSWR('admin-categories', adminGetCategories)

  const stats = [
    {
      label: 'Total Destinasi',
      value: destinationsRes?.meta.total ?? '—',
      href: '/admin/destinations',
      color: 'bg-emerald-50 text-emerald-700',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
      ),
    },
    {
      label: 'Ulasan Pending',
      value: pendingReviewsRes?.meta.total ?? '—',
      href: '/admin/reviews?status=pending',
      color: 'bg-amber-50 text-amber-700',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Kategori',
      value: categoriesRes?.data.length ?? '—',
      href: '/admin/categories',
      color: 'bg-blue-50 text-blue-700',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Dashboard</h2>
        <p className="text-stone-500 text-sm mt-1">Ringkasan data Explore Kerinci</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}
            className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={['rounded-xl p-3', stat.color].join(' ')}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
                <p className="text-sm text-stone-500">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-base font-semibold text-stone-700 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { href: '/admin/destinations/new', label: 'Tambah Destinasi', desc: 'Buat destinasi wisata baru' },
            { href: '/admin/reviews?status=pending', label: 'Moderasi Ulasan', desc: 'Setujui atau tolak ulasan' },
            { href: '/admin/categories', label: 'Kelola Kategori', desc: 'Tambah dan edit kategori' },
          ].map((action) => (
            <Link key={action.href} href={action.href}
              className="flex flex-col bg-white rounded-xl border border-stone-100 shadow-sm p-4 hover:border-emerald-200 hover:shadow-md transition-all">
              <span className="font-medium text-stone-800 text-sm">{action.label}</span>
              <span className="text-xs text-stone-400 mt-0.5">{action.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Destinations */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-stone-800">Destinasi Terbaru</h3>
          <Link href="/admin/destinations" className="text-sm text-emerald-600 hover:text-emerald-700">Lihat semua</Link>
        </div>
        {!destinationsRes ? (
          <div className="flex justify-center py-6"><Spinner /></div>
        ) : (
          <div className="divide-y divide-stone-50">
            {destinationsRes.data.slice(0, 5).map((dest) => (
              <div key={dest.id} className="flex items-center justify-between py-3 gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{dest.name}</p>
                  <p className="text-xs text-stone-400">{dest.location}</p>
                </div>
                <span className={[
                  'text-xs rounded-full px-2.5 py-0.5 font-medium shrink-0',
                  dest.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                  dest.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700',
                ].join(' ')}>
                  {dest.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
