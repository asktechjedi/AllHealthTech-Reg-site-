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
  'Main Stage': 'bg-gradient-to-r from-[#3B82F6] to-[#0EA5E9] text-white',
  'Workshop': 'bg-blue-100 text-[#3B82F6]',
}

function TrackBadge({ track }) {
  const cls = TRACK_COLORS[track] ?? 'bg-blue-50 text-[#3B82F6] border border-blue-200'
  return (
    <span className={['inline-block px-2.5 py-0.5 rounded-[var(--radius-md)] text-[11px] font-[var(--font-secondary)] font-bold uppercase tracking-wide flex-shrink-0', cls].join(' ')}>
      {track}
    </span>
  )
}

function AgendaItem({ item }) {
  return (
    <div className="group flex flex-col sm:flex-row gap-5 bg-gradient-to-br from-white to-[#F5F9FF] rounded-[var(--radius-xl)] border border-[#E8F0FF] border-l-4 border-l-[#3B82F6] p-6 shadow-lg hover:shadow-xl hover:border-l-[#0EA5E9] hover:-translate-y-0.5 transition-all duration-[var(--transition-eventor-normal)]">
      {/* Time column with blue styling */}
      <div className="sm:w-28 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-[#3B82F6] font-[var(--font-secondary)] font-bold text-sm mb-0.5">
          <ClockIcon className="w-3.5 h-3.5" />
          {fmt(item.startTime)}
        </div>
        {item.endTime && (
          <div className="text-[#9CA3AF] font-[var(--font-secondary)] text-xs pl-5">– {fmt(item.endTime)}</div>
        )}
        {item.location && (
          <div className="flex items-center gap-1 text-[#6B7280] font-[var(--font-secondary)] text-xs mt-2">
            <MapPinIcon className="w-3 h-3 flex-shrink-0" />
            {item.location}
          </div>
        )}
      </div>

      {/* Content with modern typography */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2 mb-2">
          <h3 className="text-[var(--eventor-white)] font-[var(--font-primary)] font-semibold text-sm leading-snug flex-1">{item.title}</h3>
          {item.track && <TrackBadge track={item.track} />}
        </div>
        {item.description && (
          <p className="text-[var(--eventor-gray-100)] font-[var(--font-secondary)] text-xs leading-relaxed mb-3">{item.description}</p>
        )}
        {item.speaker && (
          <div className="flex items-center gap-2">
            {item.speaker.photoUrl ? (
              <img src={item.speaker.photoUrl} alt={item.speaker.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[rgba(0,102,255,0.1)] border border-[var(--eventor-primary)] border-opacity-20 flex items-center justify-center text-[var(--eventor-primary-light)] text-[10px] font-[var(--font-secondary)] font-bold flex-shrink-0">
                {item.speaker.name.charAt(0)}
              </div>
            )}
            <span className="text-[var(--eventor-gray-100)] font-[var(--font-secondary)] text-xs">
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
    <div className="min-h-screen bg-gradient-to-br from-[#E8F0FF] via-[#F0F4FF] to-[#F5F9FF]">
      {/* Hero header with bright styling */}
      <div
        className="bg-gradient-to-br from-[#E8F0FF] via-[#F0F4FF] to-[#F5F9FF] py-20 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 800px 600px at 75% 30%, rgba(99,102,241,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 600px 400px at 25% 70%, rgba(139,92,246,0.06) 0%, transparent 60%)
          `,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <span className="inline-block text-xs font-[var(--font-secondary)] font-bold uppercase tracking-widest text-[#3B82F6] mb-3">Programme</span>
          <h1 className="text-4xl sm:text-5xl font-[var(--font-primary)] font-black text-[#1F2937] mb-3">Conference Agenda</h1>
          <p className="text-[#6B7280] opacity-90 font-[var(--font-secondary)] text-lg max-w-xl">Three days of keynotes, workshops, and networking.</p>
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
            {/* Track filter pills with bright styling */}
            {tracks.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                <button
                  onClick={() => setActiveTrack(null)}
                  className={[
                    'px-4 py-2 rounded-[var(--radius-lg)] text-sm font-[var(--font-secondary)] font-semibold transition-all duration-[var(--transition-eventor-fast)]',
                    activeTrack === null
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#0EA5E9] text-white shadow-lg'
                      : 'bg-white border border-[#E8F0FF] text-[#6B7280] hover:border-[#3B82F6] hover:text-[#3B82F6]',
                  ].join(' ')}
                >
                  All Sessions
                </button>
                {tracks.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTrack(t)}
                    className={[
                      'px-4 py-2 rounded-[var(--radius-lg)] text-sm font-[var(--font-secondary)] font-semibold transition-all duration-[var(--transition-eventor-fast)]',
                      activeTrack === t
                        ? 'bg-gradient-to-r from-[#3B82F6] to-[#0EA5E9] text-white shadow-lg'
                        : 'bg-white border border-[#E8F0FF] text-[#6B7280] hover:border-[#3B82F6] hover:text-[#3B82F6]',
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
                  <div className="h-px flex-1 bg-[#E8F0FF]" />
                  <span className="text-xs font-[var(--font-secondary)] font-bold uppercase tracking-widest text-[#3B82F6] px-2">{date}</span>
                  <div className="h-px flex-1 bg-[#E8F0FF]" />
                </div>
                <div className="flex flex-col gap-3">
                  {dayItems.map((item) => (
                    <AgendaItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(grouped).length === 0 && (
              <div className="text-center py-16 text-[#9CA3AF] font-[var(--font-secondary)] text-sm">No sessions found.</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
