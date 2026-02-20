type BadgeVariant = 'green' | 'blue' | 'amber' | 'red' | 'gray' | 'emerald'

const variantClasses: Record<BadgeVariant, string> = {
  green:   'bg-green-100 text-green-700',
  blue:    'bg-blue-100 text-blue-700',
  amber:   'bg-amber-100 text-amber-700',
  red:     'bg-red-100 text-red-700',
  gray:    'bg-stone-100 text-stone-600',
  emerald: 'bg-emerald-100 text-emerald-700',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export default function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
