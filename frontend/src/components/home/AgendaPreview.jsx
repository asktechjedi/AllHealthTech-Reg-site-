import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { ClockIcon, ArrowRightIcon } from '../icons'
import LoadingSpinner from '../ui/LoadingSpinner'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

function fmt(d) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function AgendaCard({ item, index }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const delays = ['', 'scroll-delay-100', 'scroll-delay-200', 'scroll-delay-300']
  
  return (
    <div
      ref={ref}
      className={`group flex flex-col sm:flex-row gap-5 bg-[var(--eventor-dark-800)] rounded-[var(--radius-xl)] border border-[var(--eventor-dark-700)] border-l-4 border-l-[var(--eventor-primary)] p-6 shadow-[var(--shadow-eventor-lg)] hover:shadow-[var(--shadow-eventor-blue-lg)] hover:border-l-[var(--eventor-primary-light)] hover:-translate-y-0.5 transition-all duration-[var(--transition-eventor-normal)] scroll-slide-left ${delays[index]} ${isVisible ? 'visible' : ''}`}
    >
      {/* Time with Eventor styling */}
      <div className="sm:w-24 flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
        <ClockIcon className="w-4 h-4 text-[var(--eventor-primary-light)] sm:mb-1" />
        <span className="text-[var(--eventor-primary-light)] font-[var(--font-secondary)] font-bold text-sm">{fmt(item.startTime)}</span>
        {item.endTime && (
          <span className="text-[var(--eventor-gray-500)] text-xs hidden sm:block font-[var(--font-secondary)]">– {fmt(item.endTime)}</span>
        )}
      </div>

      {/* Content with Eventor typography */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2 mb-1.5">
          <h3 className="text-[var(--eventor-white)] font-[var(--font-primary)] font-semibold text-sm leading-snug flex-1">{item.title}</h3>
          {item.track && (
            <span className="inline-block px-2.5 py-0.5 rounded-[var(--radius-md)] bg-[rgba(0,102,255,0.1)] text-[var(--eventor-primary-light)] text-[11px] font-[var(--font-secondary)] font-bold uppercase tracking-wide flex-shrink-0 border border-[var(--eventor-primary)] border-opacity-20">
              {item.track}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-[var(--eventor-gray-100)] font-[var(--font-secondary)] text-xs leading-relaxed mb-2 line-clamp-2">{item.description}</p>
        )}
        {item.speaker && (
          <div className="flex items-center gap-2 mt-2">
            {item.speaker.photoUrl ? (
              <img
                src={item.speaker.photoUrl}
                alt={item.speaker.name}
                className="w-5 h-5 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-[rgba(0,102,255,0.1)] border border-[var(--eventor-primary)] border-opacity-20 flex items-center justify-center text-[var(--eventor-primary-light)] text-[10px] font-[var(--font-secondary)] font-bold flex-shrink-0">
                {item.speaker.name.charAt(0)}
              </div>
            )}
            <span className="text-[var(--eventor-gray-100)] text-xs font-[var(--font-secondary)]">
              {item.speaker.name}
              {item.speaker.organization && ` · ${item.speaker.organization}`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AgendaPreview() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/agenda')
      .then((data) => setItems(data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="bg-[var(--eventor-dark-800)] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Eventor styling */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-[var(--font-secondary)] font-bold uppercase tracking-[0.1em] mb-3 text-[var(--eventor-primary-light)] inline-block">Programme</span>
            <h2 className="text-4xl font-[var(--font-primary)] font-bold text-[var(--eventor-white)] leading-tight">What's On</h2>
            <p className="text-base text-[var(--eventor-gray-100)] leading-relaxed mt-3 font-[var(--font-secondary)]">A glimpse of the sessions shaping the agenda.</p>
          </div>
          <Link
            to="/agenda"
            className="inline-flex items-center gap-1.5 text-[var(--eventor-primary-light)] font-[var(--font-secondary)] font-semibold text-sm hover:gap-2.5 transition-all duration-[var(--transition-eventor-fast)] flex-shrink-0"
          >
            Full Agenda
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-[var(--eventor-gray-500)] text-sm font-[var(--font-secondary)]">Agenda coming soon.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item, index) => (
              <AgendaCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
