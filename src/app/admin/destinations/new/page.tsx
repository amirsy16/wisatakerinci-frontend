import Link from 'next/link'
import DestinationForm from '../DestinationForm'

export default function NewDestinationPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/destinations" className="text-sm text-stone-500 hover:text-stone-700 flex items-center gap-1 mb-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
        <h2 className="text-xl font-bold text-stone-900">Tambah Destinasi Baru</h2>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <DestinationForm />
      </div>
    </div>
  )
}
