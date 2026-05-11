const variants = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  error:   'bg-red-50 text-red-700 border border-red-200',
  info:    'bg-ice-100 text-brand-700 border border-ice-200',
  gold:    'bg-amber-50 text-amber-700 border border-amber-200',
  brand:   'bg-brand-600 text-white',
  default: 'bg-gray-100 text-gray-600 border border-gray-200',
}

export default function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span className={['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', variants[variant] ?? variants.default, className].join(' ')}>
      {children}
    </span>
  )
}
