export default function DestinationLoading() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-pulse">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <div className="w-full h-80 md:h-96 bg-stone-100 rounded-2xl" />
            <div className="flex gap-2">
              {[1,2,3,4].map(i => <div key={i} className="h-16 w-20 bg-stone-100 rounded-lg" />)}
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-stone-100 rounded w-48" />
              {[1,2,3].map(i => <div key={i} className="h-24 bg-stone-100 rounded-xl" />)}
            </div>
          </div>
          {/* Right */}
          <div className="space-y-4">
            <div className="h-4 bg-stone-100 rounded w-24" />
            <div className="h-8 bg-stone-100 rounded w-48" />
            <div className="h-4 bg-stone-100 rounded w-36" />
            <div className="h-20 bg-stone-100 rounded-xl" />
            <div className="h-32 bg-stone-100 rounded-xl" />
            <div className="h-20 bg-stone-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
