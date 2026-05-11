import { CheckIcon } from '../icons'

export default function StepIndicator({ steps, currentStep }) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep)

  return (
    <nav aria-label="Registration progress">
      <ol className="flex items-center">
        {steps.map((step, i) => {
          const isCompleted = i < currentIndex
          const isActive = i === currentIndex
          const isFuture = i > currentIndex
          const isLast = i === steps.length - 1

          return (
            <li key={step.key} className={['flex items-center', !isLast ? 'flex-1' : ''].join(' ')}>
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={[
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 flex-shrink-0',
                    isCompleted
                      ? 'bg-brand-600 text-white'
                      : isActive
                      ? 'bg-brand-600 text-white ring-4 ring-brand-600/20'
                      : 'bg-gray-100 text-gray-400',
                  ].join(' ')}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span
                  className={[
                    'text-xs font-medium whitespace-nowrap hidden sm:block',
                    isActive ? 'text-brand-600' : isCompleted ? 'text-gray-600' : 'text-gray-400',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={[
                    'flex-1 h-0.5 mx-2 mb-5 transition-all duration-300',
                    isCompleted ? 'bg-brand-600' : 'bg-gray-200',
                  ].join(' ')}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
