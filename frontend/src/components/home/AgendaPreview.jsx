import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { ClockIcon, ArrowRightIcon } from '../icons'
import LoadingSpinner from '../ui/LoadingSpinner'

function fmt(d) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function AgendaCard({ item }) {
  return (
    <div className="group flex flex-col sm:flex-row gap-5 bg-white rounded-2xl border border-gray-100 p-6 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-200">
      {/* Time */}
      <div className="sm:w-24 flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
        <ClockIcon className="w-4 h-4 text-brand-600 sm:mb-1" />
        <span className="text-brand-600 font-bold text-sm">{fmt(item.startTime)}</span>
        {item.endTime && (
          <span className="text-gray-300 text-xs hidden sm:block">– {fmt(item.endTime)}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2 mb-1.5">
          <h3 className="text-dark-900 font-semibold text-sm leading-snug flex-1">{item.title}</h3>
          {item.track && (
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-ice-100 text-brand-600 text-[11px] font-bold uppercase tracking-wide flex-shrink-0">
              {item.track}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2">{item.description}</p>
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
              <div className="w-5 h-5 rounded-full bg-ice-100 flex items-center justify-center text-brand-600 text-[10px] font-bold flex-shrink-0">
                {item.speaker.name.charAt(0)}
              </div>
            )}
            <span className="text-gray-400 text-xs">
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
    <section className="bg-ice-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-label">Programme</span>
            <h2 className="section-title">What's On</h2>
            <p className="section-subtitle">A glimpse of the sessions shaping the agenda.</p>
          </div>
          <Link
            to="/agenda"
            className="inline-flex items-center gap-1.5 text-brand-600 font-semibold text-sm hover:gap-2.5 transition-all duration-200 flex-shrink-0"
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
          <div className="text-center py-16 text-gray-400 text-sm">Agenda coming soon.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <AgendaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
