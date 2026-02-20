'use client'

import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, id, className = '', ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={[
          'rounded-lg border px-3 py-2 text-sm text-stone-900 outline-none',
          'placeholder:text-stone-400 focus:ring-2',
          error
            ? 'border-red-400 focus:ring-red-300'
            : 'border-stone-300 focus:border-emerald-500 focus:ring-emerald-200',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {!error && helperText && <p className="text-xs text-stone-500">{helperText}</p>}
    </div>
  )
})

export default Input
