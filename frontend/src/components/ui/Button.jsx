import LoadingSpinner from './LoadingSpinner'

const variants = {
  primary:   'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-brand hover:-translate-y-0.5 focus:ring-brand-500',
  secondary: 'border-2 border-brand-600 text-brand-600 bg-transparent hover:bg-brand-600 hover:text-white focus:ring-brand-500',
  danger:    'bg-red-600 text-white hover:bg-red-500 hover:-translate-y-0.5 focus:ring-red-400',
  ghost:     'text-brand-600 hover:bg-brand-50 focus:ring-brand-300',
  white:     'bg-white text-brand-600 hover:bg-ice-100 hover:shadow-md hover:-translate-y-0.5 focus:ring-white',
  dark:      'bg-dark-800 text-white hover:bg-dark-700 hover:-translate-y-0.5 focus:ring-dark-600',
}

const sizes = {
  sm: 'px-4 py-2 text-xs rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-xl',
}

export default function Button({ variant = 'primary', size = 'md', disabled = false, loading = false, onClick, children, type = 'button', className = '' }) {
  const isDisabled = disabled || loading
  return (
    <button
      type={type} onClick={onClick} disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {loading && <LoadingSpinner size="sm" light={variant === 'primary' || variant === 'dark'} />}
      {children}
    </button>
  )
}
