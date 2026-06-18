import { useMemo, useState } from 'react'
import CTABand from '../components/ui/CTABand'
import Badge from '../components/ui/Badge'
import GridOverlay from '../components/ui/GridOverlay'
import { ClockIcon } from '../components/icons'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { getEventData } from '../lib/eventData'

function fmt(d) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })
}

const SESSION_STYLES = {
  keynote:     { accent: '#000E7A', dot: 'bg-[var(--color-navy)]',       ring: 'ring-[rgba(0,14,122,0.18)]',    cardBg: 'bg-gradient-to-br from-[rgba(0,14,122,0.035)] via-white to-white' },
  panel:       { accent: '#0023FD', dot: 'bg-[var(--color-blue-core)]',  ring: 'ring-[rgba(0,35,253,0.18)]',   cardBg: 'bg-white' },
  fireside:    { accent: '#6B7FE8', dot: 'bg-[var(--color-bridge)]',     ring: 'ring-[rgba(107,127,232,0.22)]', cardBg: 'bg-white' },
  interactive: { accent: '#EB42FA', dot: 'bg-[var(--color-magenta)]',    ring: 'ring-[rgba(235,66,250,0.2)]',  cardBg: 'bg-gradient-to-br from-[rgba(235,66,250,0.03)] via-white to-white' },
  gala:        { accent: '#EB42FA', dot: 'bg-[var(--color-magenta)]',    ring: 'ring-[rgba(235,66,250,0.2)]',  cardBg: 'bg-gradient-to-br from-[rgba(235,66,250,0.03)] via-white to-white' },
  sponsor:     { accent: '#D6CFFF', dot: 'bg-[var(--color-mist)]',       ring: '',                              cardBg: 'bg-[var(--color-warm-white)]' },
  break:       { accent: null,      dot: 'bg-[var(--color-mist)]',       ring: '',                              cardBg: '' },
  networking:  { accent: null,      dot: 'bg-[var(--color-mist)]',       ring: '',                              cardBg: '' },
  emcee:       { accent: null,      dot: 'bg-[var(--color-mist)]',       ring: '',                              cardBg: '' },
  registration:{ accent: null,      dot: 'bg-[var(--color-mist)]',       ring: '',                              cardBg: '' },
}

const TRACK_BADGE = { Keynote: 'navy', Panel: 'accent', Fireside: 'info', Interactive: 'warning' }

const LEGEND = [
  { label: 'Keynote',     color: '#000E7A' },
  { label: 'Panel',       color: '#0023FD' },
  { label: 'Fireside',    color: '#6B7FE8' },
  { label: 'Interactive', color: '#EB42FA' },
]

const COMPACT_TYPES = new Set(['break', 'networking', 'emcee', 'registration'])

function SpeakerChip({ speaker }) {
  return (
    <div className="flex items-center gap-2">
      {speaker.photoUrl ? (
        <img
          src={speaker.photoUrl}
          alt={speaker.name}
          className="h-7 w-7 flex-shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
        />
      ) : (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-frost)] text-xs font-semibold text-[var(--color-navy)]">
          {speaker.name.charAt(0)}
        </div>
      )}
      <div className="min-w-0">
        <div className="text-xs font-medium leading-tight text-[var(--text-primary)]">{speaker.name}</div>
        {speaker.organization && (
          <div className="text-[10px] leading-tight text-[var(--text-muted)]">{speaker.organization}</div>
        )}
      </div>
    </div>
  )
}

function CompactRow({ item, index }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 })
  const s = SESSION_STYLES[item.type] ?? SESSION_STYLES.break

  return (
    <div
      ref={ref}
      className={[
        'flex items-center gap-0 py-2 transition-all duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      style={{ transitionDelay: `${index * 35}ms` }}
    >
      <div className="hidden w-24 flex-shrink-0 pr-4 text-right sm:block">
        <span className="text-xs text-[var(--text-muted)]">{fmt(item.startTime)}</span>
      </div>
      <div className="hidden w-10 flex-shrink-0 items-center justify-center sm:flex">
        <div
          className="relative z-10 h-2.5 w-2.5 flex-shrink-0 rounded-full border bg-white"
          style={{ borderColor: '#D6CFFF' }}
        />
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
        <span className="text-sm text-[var(--text-secondary)]">{item.title}</span>
        <span className="text-xs text-[var(--text-muted)]">
          {fmt(item.startTime)}{item.endTime && ` – ${fmt(item.endTime)}`}
        </span>
      </div>
    </div>
  )
}

function SessionCard({ item, index }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })
  const s = SESSION_STYLES[item.type] ?? SESSION_STYLES.sponsor
  const isKeynote = item.type === 'keynote'
  const displaySpeakers = item.speakers?.length > 0 ? item.speakers : item.speaker ? [item.speaker] : []

  return (
    <div
      ref={ref}
      className={[
        'flex items-start pb-4 transition-all',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      ].join(' ')}
      style={{ transitionDelay: `${index * 55}ms`, transitionDuration: '500ms' }}
    >
      {/* Time */}
      <div className="hidden w-24 flex-shrink-0 pr-4 pt-6 text-right sm:block">
        <div className={['text-sm font-semibold', isKeynote ? 'text-[var(--color-navy)]' : 'text-[var(--color-blue-deep)]'].join(' ')}>
          {fmt(item.startTime)}
        </div>
        {item.endTime && (
          <div className="mt-0.5 text-xs text-[var(--text-muted)]">– {fmt(item.endTime)}</div>
        )}
      </div>

      {/* Dot */}
      <div className="relative hidden w-10 flex-shrink-0 justify-center pt-[1.65rem] sm:flex">
        <div
          className="relative z-10 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 bg-white"
          style={{ borderColor: s.accent ?? '#D6CFFF' }}
        >
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: s.accent ?? '#D6CFFF' }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className={[
          'group flex-1 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-mist)] shadow-[var(--shadow-card)] transition-all duration-300',
          'hover:-translate-y-0.5 hover:border-[var(--color-bridge)] hover:shadow-[0_16px_44px_rgba(0,14,122,0.1)]',
          s.cardBg,
        ].join(' ')}
        style={s.accent ? { borderLeft: `3px solid ${s.accent}` } : {}}
      >
        {isKeynote && (
          <div className="h-[2px] w-full bg-gradient-to-r from-[var(--color-navy)] via-[var(--color-blue-core)] to-transparent opacity-60" />
        )}

        <div className={isKeynote ? 'p-6' : 'p-5'}>
          {/* Mobile time */}
          <div className="mb-2.5 flex items-center gap-1.5 sm:hidden">
            <ClockIcon className="h-3 w-3 text-[var(--color-blue-deep)]" />
            <span className="text-xs font-semibold text-[var(--color-blue-deep)]">
              {fmt(item.startTime)}{item.endTime && ` – ${fmt(item.endTime)}`}
            </span>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3
              className={[
                'flex-1 [font-family:var(--font-body)] font-semibold leading-snug text-[var(--text-primary)]',
                isKeynote ? 'text-base' : 'text-sm',
              ].join(' ')}
            >
              {item.title}
            </h3>
            {item.track && (
              <Badge variant={TRACK_BADGE[item.track] ?? 'default'}>{item.track}</Badge>
            )}
          </div>

          {item.description && (
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{item.description}</p>
          )}

          {displaySpeakers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 border-t border-[var(--color-mist)] pt-4">
              {displaySpeakers.map((sp, i) => (
                <SpeakerChip key={i} speaker={sp} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AgendaPage() {
  const [activeTrack, setActiveTrack] = useState(null)
  const items = useMemo(() => getEventData().agendaItems, [])

  const tracks = [...new Set(items.map((i) => i.track).filter(Boolean))]
  const filtered = activeTrack ? items.filter((i) => i.track === activeTrack) : items

  const grouped = filtered.reduce((acc, item) => {
    const key = fmtDate(item.startTime)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[var(--color-ice)]">

      {/* ── Dark hero ─────────────────────────────────── */}
      <div className="relative overflow-hidden pb-12 pt-28" style={{ background: 'linear-gradient(145deg, var(--color-abyss) 0%, var(--color-navy) 52%, #0015a8 100%)' }}>
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(107,127,232,0.45) 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 left-4 h-64 w-64 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(235,66,250,0.22) 0%, transparent 70%)' }}
        />
        <GridOverlay />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-bridge)]">
            Programme
          </p>
          <h1 className="[font-family:var(--font-display)] text-[clamp(2rem,5vw,3.25rem)] font-normal leading-tight text-[var(--text-on-dark)]">
            Event Agenda
          </h1>
          <p className="mt-3 max-w-lg text-base leading-relaxed" style={{ color: 'rgba(250,243,255,0.68)' }}>
            Keynotes, panels, live pitches, and networking — a full day built around the hard questions in healthtech.
          </p>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {LEGEND.map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs" style={{ color: 'rgba(250,243,255,0.55)' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          {tracks.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {['All Sessions', ...tracks].map((t) => {
                const isActive = t === 'All Sessions' ? activeTrack === null : activeTrack === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTrack(t === 'All Sessions' ? null : t)}
                    className={[
                      'rounded-[var(--radius-pill)] px-4 py-1.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-white text-[var(--color-navy)] shadow-md'
                        : 'border border-[rgba(250,243,255,0.18)] text-[rgba(250,243,255,0.6)] hover:border-[rgba(250,243,255,0.4)] hover:text-[var(--text-on-dark)]',
                    ].join(' ')}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Timeline ──────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        {Object.entries(grouped).map(([date, dayItems]) => (
          <div key={date} className="mb-10">
            {/* Date pill */}
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-[var(--color-mist)]" />
              <span className="rounded-[var(--radius-pill)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                {date}
              </span>
              <div className="h-px flex-1 bg-[var(--color-mist)]" />
            </div>

            {/* Items with continuous line */}
            <div className="relative">
              {/* Vertical line running through all dots — hidden on mobile */}
              <div
                className="absolute hidden w-px bg-[var(--color-mist)] sm:block"
                style={{ left: 'calc(6rem + 1.25rem)', top: '1.75rem', bottom: '1.75rem' }}
              />

              {dayItems.map((item, index) =>
                COMPACT_TYPES.has(item.type) ? (
                  <CompactRow key={item.id} item={item} index={index} />
                ) : (
                  <SessionCard key={item.id} item={item} index={index} />
                )
              )}
            </div>
          </div>
        ))}

        {Object.keys(grouped).length === 0 && (
          <div className="py-16 text-center text-sm text-[var(--text-muted)]">Agenda coming soon.</div>
        )}
      </div>

      <CTABand
        variant="agenda"
        title="Join the conversations in the room."
        subtitle="Limited seats. Curated participation."
        primaryCta={{ to: '/register', label: 'Register to Attend' }}
        secondaryCta={{ to: '/contact', label: 'Partner With Us', showArrow: false }}
      />
    </div>
  )
}
