import { useState, useEffect } from 'react'
import { apiFetch } from '../lib/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import AnimatedSection from '../components/ui/AnimatedSection'
import { ClockIcon, MapPinIcon } from '../components/icons'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

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

function AgendaItem({ item, index }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const delays = [0, 100, 200, 300]
  
  return (
    <div 
      ref={ref}
      className={`group flex flex-col sm:flex-row gap-5 bg-gradient-to-br from-white to-[#F5F9FF] rounded-[var(--radius-xl)] border border-[#E8F0FF] border-l-4 border-l-[#3B82F6] p-6 shadow-lg hover:shadow-xl hover:border-l-[#0EA5E9] hover:-translate-y-0.5 transition-all duration-[var(--transition-eventor-normal)] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
      style={{
        transitionDelay: `${delays[index % 4]}ms`,
        transitionDuration: '600ms',
      }}
    >
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Layer 1: base — white to light sky blue */}
      <div
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #F0F7FF 30%, #DBEAFE 60%, #BFDBFE 100%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 2: ambient blue radial orbs */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 900px 700px at 80% 20%, rgba(59,130,246,0.14) 0%, transparent 65%),
            radial-gradient(ellipse 700px 500px at 10% 80%, rgba(96,165,250,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 500px 400px at 50% 50%, rgba(147,197,253,0.10) 0%, transparent 55%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Layer 3: top-right blue bloom */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(93,169,233,0.20) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 4: bottom-left blue bloom */}
      <div
        className="fixed bottom-0 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(56,149,240,0.13) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 5: subtle grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
        aria-hidden="true"
      />

      {/* Hero header with bright styling */}
      <AnimatedSection animation="fadeUp" duration={800}>
        <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block text-xs font-[var(--font-secondary)] font-bold uppercase tracking-widest text-[#3B82F6] mb-3">Programme</span>
            <h1 className="text-4xl sm:text-5xl font-[var(--font-primary)] font-black text-[#1F2937] mb-3">Conference Agenda</h1>
            <p className="text-[#6B7280] opacity-90 font-[var(--font-secondary)] text-lg max-w-xl">Three days of keynotes, workshops, and networking.</p>
          </div>
        </div>
      </AnimatedSection>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-0">
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
                  {dayItems.map((item, index) => (
                    <AgendaItem key={item.id} item={item} index={index} />
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
