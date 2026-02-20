import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
              Explore Kerinci
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              Platform wisata digital untuk menjelajahi keindahan alam, budaya, dan petualangan
              di Kabupaten Kerinci, Jambi.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Jelajahi</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Beranda</Link></li>
              <li><Link href="/wisata" className="hover:text-emerald-400 transition-colors">Semua Destinasi</Link></li>
              <li><Link href="/wisata?category=alam-pegunungan" className="hover:text-emerald-400 transition-colors">Alam & Pegunungan</Link></li>
              <li><Link href="/wisata?category=air-terjun" className="hover:text-emerald-400 transition-colors">Air Terjun</Link></li>
              <li><Link href="/wisata?category=danau-sungai" className="hover:text-emerald-400 transition-colors">Danau & Sungai</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Akun</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Masuk</Link></li>
              <li><Link href="/register" className="hover:text-emerald-400 transition-colors">Daftar</Link></li>
              <li><Link href="/profil" className="hover:text-emerald-400 transition-colors">Profil Saya</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Explore Kerinci. Hak cipta dilindungi.</p>
          <p>Dibuat dengan ❤ untuk Kerinci, Jambi</p>
        </div>
      </div>
    </footer>
  )
}
