import { useState, useEffect } from 'react'
import { apiFetch } from '../lib/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import { ClockIcon, MapPinIcon } from '../components/icons'

function fmt(d) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })
}

const TRACK_COLORS = {
  'Main Stage': 'bg-brand-600 text-white',
  'Workshop': 'bg-dark-700 text-white',
}

function TrackBadge({ track }) {
  const cls = TRACK_COLORS[track] ?? 'bg-ice-100 text-brand-600'
  return (
    <span className={['inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wide flex-shrink-0', cls].join(' ')}>
      {track}
    </span>
  )
}

function AgendaItem({ item }) {
  return (
    <div className="group flex flex-col sm:flex-row gap-5 bg-white rounded-2xl border border-gray-100 p-6 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-200">
      {/* Time column */}
      <div className="sm:w-28 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-brand-600 font-bold text-sm mb-0.5">
          <ClockIcon className="w-3.5 h-3.5" />
          {fmt(item.startTime)}
        </div>
        {item.endTime && (
          <div className="text-gray-300 text-xs pl-5">– {fmt(item.endTime)}</div>
        )}
        {item.location && (
          <div className="flex items-center gap-1 text-gray-400 text-xs mt-2">
            <MapPinIcon className="w-3 h-3 flex-shrink-0" />
            {item.location}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2 mb-2">
          <h3 className="text-dark-900 font-semibold text-sm leading-snug flex-1">{item.title}</h3>
          {item.track && <TrackBadge track={item.track} />}
        </div>
        {item.description && (
          <p className="text-gray-400 text-xs leading-relaxed mb-3">{item.description}</p>
        )}
        {item.speaker && (
          <div className="flex items-center gap-2">
            {item.speaker.photoUrl ? (
              <img src={item.speaker.photoUrl} alt={item.speaker.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-ice-100 flex items-center justify-center text-brand-600 text-[10px] font-bold flex-shrink-0">
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

export default function AgendaPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTrack, setActiveTrack] = useState(null)

  useEffect(() => {
    apiFetch('/api/agenda')
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const tracks = [...new Set(items.map((i) => i.track).filter(Boolean))]
  const filtered = activeTrack ? items.filter((i) => i.track === activeTrack) : items

  const grouped = filtered.reduce((acc, item) => {
    const key = fmtDate(item.startTime)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div
        className="bg-dark-900 py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(34,0,255,0.15) 0%, transparent 70%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">Programme</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Conference Agenda</h1>
          <p className="text-white/60 text-lg max-w-xl">Three days of keynotes, workshops, and networking.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {error && <ErrorMessage message={error} onRetry={() => location.reload()} />}

        {!loading && !error && (
          <>
            {/* Track filter pills */}
            {tracks.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                <button
                  onClick={() => setActiveTrack(null)}
                  className={[
                    'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150',
                    activeTrack === null
                      ? 'bg-brand-600 text-white shadow-brand'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-600',
                  ].join(' ')}
                >
                  All Sessions
                </button>
                {tracks.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTrack(t)}
                    className={[
                      'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150',
                      activeTrack === t
                        ? 'bg-brand-600 text-white shadow-brand'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-600',
                    ].join(' ')}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {/* Grouped by day */}
            {Object.entries(grouped).map(([date, dayItems]) => (
              <div key={date} className="mb-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 px-2">{date}</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                <div className="flex flex-col gap-3">
                  {dayItems.map((item) => (
                    <AgendaItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(grouped).length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">No sessions found.</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
