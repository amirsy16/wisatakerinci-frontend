'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="relative w-full bg-white rounded-t-2xl shadow-xl max-h-[90vh] flex flex-col animate-sheet-up">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="h-1 w-10 rounded-full bg-stone-300" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100 shrink-0">
            <h3 className="font-semibold text-stone-800 text-base">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
        {/* iOS safe area */}
        <div className="h-[env(safe-area-inset-bottom)] shrink-0" />
      </div>
    </div>,
    document.body
  )
}
