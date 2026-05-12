import LoadingSpinner from './LoadingSpinner'

const variants = {
  primary: [
    'bg-gradient-to-r from-[#3B82F6] to-[#0EA5E9] text-white',
    'hover:from-[#2563EB] hover:to-[#0284C7]',
    'shadow-lg hover:shadow-xl',
    'focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-white',
    'active:scale-[0.98] hover:translate-y-[-1px]',
    'transition-all duration-200 ease-out'
  ].join(' '),
  
  secondary: [
    'bg-transparent text-[#3B82F6]',
    'border-2 border-[#3B82F6]',
    'hover:bg-[rgba(59,130,246,0.1)] hover:text-[#2563EB]',
    'hover:border-[#2563EB]',
    'focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-white',
    'active:scale-[0.98]',
    'transition-all duration-200 ease-out'
  ].join(' '),
  
  ghost: [
    'bg-transparent text-[#3B82F6]',
    'border border-[#BFDBFE]',
    'hover:bg-[rgba(59,130,246,0.05)] hover:border-[#3B82F6]',
    'hover:text-[#2563EB]',
    'focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-white',
    'active:scale-[0.98]',
    'transition-all duration-200 ease-out'
  ].join(' '),
  
  outline: [
    'bg-transparent text-[#3B82F6]',
    'border border-[#3B82F6]',
    'hover:bg-[#3B82F6] hover:text-white',
    'focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-white',
    'active:scale-[0.98]',
    'transition-all duration-200 ease-out'
  ].join(' '),
  
  // Legacy variants for backward compatibility
  danger: [
    'bg-[var(--eventor-error)] text-white',
    'hover:bg-red-700',
    'shadow-lg hover:shadow-xl',
    'focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white',
    'active:scale-[0.98] hover:translate-y-[-1px]',
    'transition-all duration-200 ease-out'
  ].join(' '),
}

const sizes = {
  sm: 'px-4 py-2.5 text-xs rounded-[var(--radius-lg)]',
  md: 'px-6 py-3 text-sm rounded-[var(--radius-lg)]',
  lg: 'px-8 py-4 text-base rounded-[var(--radius-lg)]',
  xl: 'px-10 py-5 text-lg rounded-[var(--radius-lg)]',
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  onClick, 
  children, 
  type = 'button', 
  className = '',
  ...ariaProps // Pass through ARIA attributes
}) {
  const isDisabled = disabled || loading
  
  return (
    <button
      type={type} 
      onClick={onClick} 
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...ariaProps}
      className={[
        // Base button styles with Eventor design system
        'inline-flex items-center justify-center gap-2.5',
        'font-[var(--font-secondary)] font-semibold',
        'cursor-pointer select-none',
        'focus:outline-none',
        // Minimum touch target size for accessibility (44px)
        'min-h-[44px] min-w-[44px]',
        // Apply variant and size styles
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        // Disabled state styling
        isDisabled ? [
          'opacity-60 cursor-not-allowed',
          'hover:transform-none hover:shadow-none', // Disable hover effects when disabled
          'active:scale-100' // Disable active scale when disabled
        ].join(' ') : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {loading && (
        <LoadingSpinner 
          size="sm" 
          light={variant === 'primary' || variant === 'danger'} 
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}
