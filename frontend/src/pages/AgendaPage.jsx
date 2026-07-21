import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import CTABand from '../components/ui/CTABand'
import Badge from '../components/ui/Badge'
import GridOverlay from '../components/ui/GridOverlay'
import {
  ClockIcon,
  ChevronDownIcon,
  MicIcon,
  UsersGroupIcon,
  ChatBubbleIcon,
  BoltIcon,
  GlassIcon,
  SparkleIcon,
  CoffeeCupIcon,
  NetworkIcon,
  TicketIcon,
  PersonAvatarIcon,
} from '../components/icons'
import { getEventData } from '../lib/eventData'

const EASE_OUT = [0.16, 1, 0.3, 1]

function fmt(d) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })
}

const SESSION_STYLES = {
  keynote: {
    accent: '#000E7A',
    glow: 'rgba(0,14,122,0.28)',
    bar: 'linear-gradient(90deg, #000E7A 0%, rgba(0,14,122,0) 100%)',
    cardBg: 'bg-gradient-to-br from-[rgba(0,14,122,0.035)] via-white to-white',
    icon: MicIcon,
  },
  panel: {
    accent: '#0023FD',
    glow: 'rgba(0,35,253,0.26)',
    bar: 'linear-gradient(90deg, #0023FD 0%, rgba(0,35,253,0) 100%)',
    cardBg: 'bg-white',
    icon: UsersGroupIcon,
  },
  fireside: {
    accent: '#6B7FE8',
    glow: 'rgba(107,127,232,0.32)',
    bar: 'linear-gradient(90deg, #6B7FE8 0%, rgba(107,127,232,0) 100%)',
    cardBg: 'bg-white',
    icon: ChatBubbleIcon,
  },
  interactive: {
    accent: '#EB42FA',
    glow: 'rgba(235,66,250,0.28)',
    bar: 'linear-gradient(90deg, #EB42FA 0%, rgba(235,66,250,0) 100%)',
    cardBg: 'bg-gradient-to-br from-[rgba(235,66,250,0.03)] via-white to-white',
    icon: BoltIcon,
  },
  gala: {
    accent: '#EB42FA',
    glow: 'rgba(235,66,250,0.28)',
    bar: 'linear-gradient(90deg, #EB42FA 0%, rgba(235,66,250,0) 100%)',
    cardBg: 'bg-gradient-to-br from-[rgba(235,66,250,0.03)] via-white to-white',
    icon: GlassIcon,
  },
  sponsor: {
    accent: '#7B61FF',
    glow: 'rgba(123,97,255,0.28)',
    bar: 'linear-gradient(90deg, #7B61FF 0%, rgba(123,97,255,0) 100%)',
    cardBg: 'bg-gradient-to-br from-[rgba(123,97,255,0.04)] via-white to-white',
    icon: SparkleIcon,
  },
  break:        { accent: '#6B7FE8', icon: CoffeeCupIcon },
  networking:   { accent: '#6B7FE8', icon: NetworkIcon },
  emcee:        { accent: '#6B7FE8', icon: MicIcon },
  registration: { accent: '#6B7FE8', icon: TicketIcon },
}

const TRACK_BADGE = { Keynote: 'navy', Panel: 'accent', Fireside: 'info', Interactive: 'warning' }

const LEGEND = [
  { label: 'Keynote',     color: '#000E7A' },
  { label: 'Panel',       color: '#0023FD' },
  { label: 'Fireside',    color: '#6B7FE8' },
  { label: 'Interactive', color: '#EB42FA' },
]

const COMPACT_TYPES = new Set(['break', 'networking', 'emcee', 'registration'])

/* A speaker in an agenda entry may carry `speakerId` (from the raw agenda
   record) or `id` (when it's the resolved full speaker record) — normalize. */
function speakerHref(speaker) {
  const id = speaker?.speakerId ?? speaker?.id
  return id ? `/speakers?speaker=${id}` : null
}

function SpeakerChip({ speaker }) {
  const href = speakerHref(speaker)

  const content = (
    <>
      {speaker.photoUrl ? (
        <img
          src={speaker.photoUrl}
          alt={speaker.name}
          className="h-7 w-7 flex-shrink-0 rounded-full object-cover object-top ring-2 ring-white shadow-sm"
        />
      ) : (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-mist)]">
          <PersonAvatarIcon className="h-4 w-4 text-[var(--color-navy)] opacity-50" />
        </div>
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium leading-tight text-[var(--text-primary)]">{speaker.name}</span>
          {speaker.role && (
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-magenta-tint)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--color-violet)]">
              {speaker.role}
            </span>
          )}
        </div>
        {speaker.organization && (
          <div className="text-[10px] leading-tight text-[var(--text-muted)]">{speaker.organization}</div>
        )}
      </div>
    </>
  )

  const className =
    'flex items-center gap-2 rounded-[var(--radius-pill)] bg-[rgba(237,232,255,0.55)] py-1 pl-1 pr-3 transition-colors duration-200' +
    (href ? ' hover:bg-[rgba(237,232,255,0.95)]' : '')

  if (!href) return <div className={className}>{content}</div>

  return (
    <Link
      to={href}
      onClick={(e) => e.stopPropagation()}
      className={className}
      aria-label={`View ${speaker.name}'s speaker profile`}
    >
      {content}
    </Link>
  )
}

function SpeakerAvatar({ speaker, size = 'h-7 w-7' }) {
  return speaker.photoUrl ? (
    <img
      src={speaker.photoUrl}
      alt=""
      className={`${size} flex-shrink-0 rounded-full object-cover object-top ring-2 ring-[var(--color-warm-white)]`}
    />
  ) : (
    <div
      className={`flex ${size} flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-frost)] ring-2 ring-[var(--color-warm-white)]`}
    >
      <PersonAvatarIcon className="h-4 w-4 text-[var(--color-navy)] opacity-50" />
    </div>
  )
}

/* ─── Overlapping avatar preview — who's on before you expand ───────────── */
function SpeakerStack({ speakers }) {
  const shown = speakers.slice(0, 4)
  const extra = speakers.length - shown.length

  return (
    <div className="flex items-center -space-x-2.5">
      {shown.map((sp, i) => {
        const href = speakerHref(sp)
        const avatar = sp.photoUrl ? (
          <img src={sp.photoUrl} alt="" className="h-full w-full object-cover object-top" />
        ) : (
          <span className="flex h-full w-full items-center justify-center">
            <PersonAvatarIcon className="h-4 w-4 text-[var(--color-navy)] opacity-50" />
          </span>
        )
        const key = sp.speakerId ?? sp.id ?? sp.name ?? i
        const className =
          'relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-[var(--color-frost)] ring-2 ring-[var(--color-warm-white)] transition-transform duration-200' +
          (href ? ' hover:z-20 hover:scale-110' : '')

        return href ? (
          <Link
            key={key}
            to={href}
            onClick={(e) => e.stopPropagation()}
            className={className}
            style={{ zIndex: shown.length - i }}
            aria-label={`View ${sp.name}'s speaker profile`}
          >
            {avatar}
          </Link>
        ) : (
          <div key={key} className={className} style={{ zIndex: shown.length - i }}>
            {avatar}
          </div>
        )
      })}
      {extra > 0 && (
        <div className="relative z-0 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-[10px] font-semibold text-white ring-2 ring-[var(--color-warm-white)]">
          +{extra}
        </div>
      )}
    </div>
  )
}

/* ─── Timeline marker — session type as an icon, not just a color ───────── */
function TypeMarker({ type, compact = false }) {
  const s = SESSION_STYLES[type] ?? SESSION_STYLES.sponsor
  const Icon = s.icon
  const dimensions = compact ? 'h-7 w-7' : 'h-10 w-10'
  const iconSize = compact ? 'h-3.5 w-3.5' : 'h-[18px] w-[18px]'

  return (
    <div
      className={`relative z-10 flex flex-shrink-0 items-center justify-center rounded-full border-2 bg-[var(--color-warm-white)] ${dimensions}`}
      style={{ borderColor: s.accent ?? '#D6CFFF' }}
    >
      {Icon && <Icon className={iconSize} style={{ color: s.accent ?? '#8A93C9' }} />}
    </div>
  )
}

function CompactRow({ item, index }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="flex items-center gap-0 py-2"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: EASE_OUT, delay: prefersReducedMotion ? 0 : Math.min(index * 0.03, 0.3) }}
    >
      <div className="hidden w-24 flex-shrink-0 pr-4 text-right sm:block">
        <span className="text-xs text-[var(--text-muted)]">{fmt(item.startTime)}</span>
      </div>
      <div className="flex w-10 flex-shrink-0 items-center justify-center">
        <TypeMarker type={item.type} compact />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex flex-wrap items-center gap-x-2">
          <span className="text-sm text-[var(--text-secondary)]">{item.title}</span>
          <span className="text-xs text-[var(--text-muted)]">
            {fmt(item.startTime)}{item.endTime && ` – ${fmt(item.endTime)}`}
          </span>
        </div>
        {item.description && (
          <p className="text-xs leading-relaxed text-[var(--text-muted)]">{item.description}</p>
        )}
      </div>
    </motion.div>
  )
}

function SessionCard({ item, index }) {
  const [isOpen, setIsOpen] = useState(item.type === 'keynote')
  const prefersReducedMotion = useReducedMotion()
  const s = SESSION_STYLES[item.type] ?? SESSION_STYLES.sponsor
  const isKeynote = item.type === 'keynote'
  const displaySpeakers = item.speakers?.length > 0 ? item.speakers : item.speaker ? [item.speaker] : []
  const hasExpandableContent = Boolean(item.description) || displaySpeakers.length > 0

  return (
    <motion.div
      className="flex items-start pb-5"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: prefersReducedMotion ? 0 : Math.min(index * 0.05, 0.4) }}
    >
      {/* Time — desktop only */}
      <div className="hidden w-24 flex-shrink-0 pr-4 pt-8 text-right sm:block">
        <div className={['text-sm font-semibold', isKeynote ? 'text-[var(--color-navy)]' : 'text-[var(--color-blue-deep)]'].join(' ')}>
          {fmt(item.startTime)}
        </div>
        {item.endTime && (
          <div className="mt-0.5 text-xs text-[var(--text-muted)]">– {fmt(item.endTime)}</div>
        )}
      </div>

      {/* Marker — icon badge, always visible */}
      <div className="relative flex w-10 flex-shrink-0 justify-center pt-6">
        <TypeMarker type={item.type} />
      </div>

      {/* Card */}
      <motion.div
        className={[
          'flex-1 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-mist)] shadow-[var(--shadow-card)] cursor-pointer select-none',
          s.cardBg,
        ].join(' ')}
        whileHover={
          prefersReducedMotion
            ? undefined
            : { y: -5, boxShadow: `0 22px 48px ${s.glow ?? 'rgba(0,14,122,0.16)'}, 0 4px 16px rgba(0,14,122,0.08)` }
        }
        transition={{ duration: 0.3, ease: EASE_OUT }}
        onClick={() => hasExpandableContent && setIsOpen((o) => !o)}
      >
        {/* Type-coded top edge — every session carries its accent */}
        <div className="h-[3px] w-full opacity-90" style={{ background: s.bar ?? 'transparent' }} />

        <div className={isKeynote ? 'p-6' : 'p-5'}>
          {/* Mobile time */}
          <div className="mb-2.5 flex items-center gap-1.5 sm:hidden">
            <ClockIcon className="h-3 w-3 text-[var(--color-blue-deep)]" />
            <span className="text-xs font-semibold text-[var(--color-blue-deep)]">
              {fmt(item.startTime)}{item.endTime && ` – ${fmt(item.endTime)}`}
            </span>
          </div>

          {/* Title row + chevron */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className={[
                'flex-1 flex items-center gap-2 [font-family:var(--font-body)] font-semibold leading-snug text-[var(--text-primary)]',
                isKeynote ? 'text-base' : 'text-sm',
              ].join(' ')}
            >
              <span>{item.title}</span>
              {item.partnerLogo && (
                <span className="flex h-6 w-20 flex-shrink-0 items-center justify-start">
                  <img
                    src={item.partnerLogo}
                    alt={item.partnerName || 'Partner logo'}
                    className={`max-w-full  object-contain ${item.partnerLogoClass || 'max-h-full'}`}
                  />
                </span>
              )}
            </h3>
            <div className="flex flex-shrink-0 items-center gap-2">
              {item.track && (
                <Badge variant={TRACK_BADGE[item.track] ?? 'default'}>{item.track}</Badge>
              )}
              {hasExpandableContent && (
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="flex-shrink-0"
                >
                  <ChevronDownIcon className="h-4 w-4 text-[var(--text-muted)]" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Who's speaking — visible at a glance, before expanding */}
          {displaySpeakers.length === 1 && speakerHref(displaySpeakers[0]) ? (
            <Link
              to={speakerHref(displaySpeakers[0])}
              onClick={(e) => e.stopPropagation()}
              className="mt-3 flex items-center gap-2.5 -m-1 rounded-lg p-1 transition-colors duration-200 hover:bg-[rgba(237,232,255,0.5)]"
              aria-label={`View ${displaySpeakers[0].name}'s speaker profile`}
            >
              <SpeakerAvatar speaker={displaySpeakers[0]} />
              <span className="text-[11px] font-medium leading-snug text-[var(--text-secondary)]">
                {displaySpeakers[0].name}
              </span>
            </Link>
          ) : (
            displaySpeakers.length > 0 && (
              <div className="mt-3 flex items-center gap-2.5">
                <SpeakerStack speakers={displaySpeakers} />
                <span className="text-[11px] leading-snug text-[var(--text-muted)]">
                  {`${displaySpeakers.length} speakers`}
                </span>
              </div>
            )
          )}

          {/* Expandable region — description + full speaker roster */}
          {hasExpandableContent && (
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="mt-3 space-y-3 border-t border-[var(--color-mist)] pt-3">
                  {item.description && (
                    <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{item.description}</p>
                  )}
                  {displaySpeakers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {displaySpeakers.map((sp, i) => (
                        <SpeakerChip key={sp.speakerId ?? sp.name ?? i} speaker={sp} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
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
              {/* Vertical line — mobile position (no time column) */}
              <div
                className="absolute block w-px bg-[var(--color-mist)] sm:hidden"
                style={{ left: '1.25rem', top: '1.75rem', bottom: '1.75rem' }}
              />
              {/* Vertical line — desktop position (after time column) */}
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
