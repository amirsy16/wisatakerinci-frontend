import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">
      <p className="text-7xl font-bold text-emerald-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-stone-500 mb-8 max-w-sm">
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Link href="/"
        className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
        Kembali ke Beranda
      </Link>
    </div>
  )
}
