const variants = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  error:   'bg-red-50 text-red-700 border border-red-200',
  info:    'bg-blue-50 text-blue-700 border border-blue-200',
  gold:    'bg-blue-50 text-blue-700 border border-blue-200',
  brand:   'bg-gradient-to-r from-[#3B82F6] to-[#0EA5E9] text-white',
  default: 'bg-blue-50 text-blue-700 border border-blue-200',
}

export default function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span className={['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', variants[variant] ?? variants.default, className].join(' ')}>
      {children}
    </span>
  )
}
