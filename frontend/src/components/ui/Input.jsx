export default function Input({ 
  label, 
  error, 
  id, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  className = '',
  ...ariaProps // Pass through any additional ARIA attributes
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label 
          htmlFor={id} 
          className="text-sm font-[var(--font-secondary)] font-medium text-[var(--eventor-white)]"
        >
          {label}{required && <span className="text-[var(--eventor-primary)] ml-1" aria-label="required">*</span>}
        </label>
      )}
      <input
        id={id} 
        name={name} 
        type={type} 
        value={value} 
        onChange={onChange}
        placeholder={placeholder} 
        required={required}
        aria-invalid={!!error} 
        aria-describedby={error ? `${id}-error` : undefined}
        {...ariaProps}
        className={[
          // Base input styling with Eventor design system
          'w-full rounded-[var(--radius-lg)] border px-4 py-3.5',
          'font-[var(--font-secondary)] text-sm',
          'text-[var(--eventor-white)]',
          'placeholder-[var(--eventor-gray-500)]',
          'transition-all duration-[var(--transition-eventor-normal)]',
          'focus:outline-none',
          // Minimum touch target size for accessibility
          'min-h-[44px]',
          // Error state styling
          error ? [
            'border-[var(--eventor-error)]',
            'bg-[rgba(220,53,69,0.05)]',
            'focus:ring-2 focus:ring-[var(--eventor-error)] focus:ring-opacity-20',
            'focus:border-[var(--eventor-error)]',
          ].join(' ') : [
            // Normal state styling with dark navy background
            'border-[var(--eventor-dark-600)]',
            'bg-[var(--eventor-dark-800)]',
            'hover:border-[var(--eventor-dark-600)]',
            'focus:ring-2 focus:ring-[var(--eventor-primary)] focus:ring-opacity-20',
            'focus:border-[var(--eventor-primary)]',
          ].join(' '),
          className,
        ].join(' ')}
      />
      {error && (
        <p 
          id={`${id}-error`} 
          className="text-xs text-[var(--eventor-error)] font-[var(--font-secondary)] font-medium flex items-center gap-1.5" 
          role="alert" 
          aria-live="polite"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
