'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">
      <p className="text-7xl font-bold text-red-100 mb-4">!</p>
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Terjadi Kesalahan</h1>
      <p className="text-stone-500 mb-2 max-w-sm">
        {error.message || 'Sesuatu yang tidak terduga terjadi.'}
      </p>
      <p className="text-xs text-stone-400 mb-8">Silakan coba lagi atau kembali ke beranda.</p>
      <div className="flex gap-3">
        <button onClick={reset}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
          Coba Lagi
        </button>
        <a href="/" className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">
          Beranda
        </a>
      </div>
    </div>
  )
}
