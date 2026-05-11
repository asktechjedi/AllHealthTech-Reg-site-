export default function Input({ label, error, id, name, type = 'text', value, onChange, placeholder, required = false, className = '' }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-dark-700">
          {label}{required && <span className="text-brand-600 ml-1">*</span>}
        </label>
      )}
      <input
        id={id} name={name} type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
        className={[
          'w-full rounded-xl border px-4 py-3 text-dark-900 placeholder-gray-400 text-sm transition-all duration-150 focus:outline-none focus:ring-2',
          error
            ? 'border-red-400 bg-red-50 focus:ring-red-300'
            : 'border-gray-200 bg-white hover:border-brand-300 focus:ring-brand-500 focus:border-brand-500',
          className,
        ].join(' ')}
      />
      {error && <p id={`${id}-error`} className="text-xs text-red-600 mt-0.5">{error}</p>}
    </div>
  )
}
