import { useMemo, useState, useEffect } from 'react'
import PageHero from '../components/ui/PageHero'
import { XIcon, LinkedInIcon, TwitterIcon } from '../components/icons'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { getEventData } from '../lib/eventData'

const TAB_LIST = ['About', 'Career', 'Recognition']

const SESSION_TYPE_LABELS = {
  keynote: 'Keynote',
  panel: 'Panel',
  fireside: 'Fireside',
  interactive: 'Interactive',
  sponsor: 'Sponsor Note',
}

function formatSessionTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  })
}

function ExpertiseChip({ label }) {
  return (
    <span className="inline-flex items-center rounded-[var(--radius-pill)] bg-[var(--color-frost)] px-3 py-1 text-xs font-medium text-[var(--color-blue-deep)]">
      {label}
    </span>
  )
}

function AwardItem({ text, index }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-magenta-tint)] text-[10px] font-semibold text-[var(--color-violet)]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="text-sm leading-snug text-[var(--text-secondary)]">{text}</span>
    </div>
  )
}

function EducationItem({ edu }) {
  return (
    <div className="relative pl-6 pb-5 last:pb-0">
      <span className="absolute left-0 top-1.5 flex h-3 w-3 items-center justify-center">
        <span className="h-2.5 w-2.5 rounded-full border-2 border-[var(--color-bridge)] bg-[var(--color-warm-white)]" />
      </span>
      <span className="absolute left-[5px] top-4 bottom-0 w-px bg-[var(--color-mist)]" />
      <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">{edu.degree}</p>
      {edu.institution && (
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          {edu.institution}{edu.year ? ` · ${edu.year}` : ''}
        </p>
      )}
      {edu.achievement && (
        <span className="mt-1.5 inline-block rounded-[var(--radius-pill)] bg-[var(--color-frost)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-blue-deep)]">
          {edu.achievement}
        </span>
      )}
    </div>
  )
}

/* ─── Career highlight card ─────────────────────────────────────────────── */
function CareerCard({ label, value, index }) {
  const accents = [
    { dot: 'bg-[var(--color-magenta)]',   bg: 'bg-[rgba(235,66,250,0.06)]',  border: 'border-[rgba(235,66,250,0.18)]' },
    { dot: 'bg-[var(--color-bridge)]',    bg: 'bg-[rgba(107,127,232,0.06)]', border: 'border-[rgba(107,127,232,0.18)]' },
    { dot: 'bg-[var(--color-blue-core)]', bg: 'bg-[rgba(0,35,253,0.05)]',    border: 'border-[rgba(0,35,253,0.14)]' },
    { dot: 'bg-[var(--color-violet)]',    bg: 'bg-[rgba(205,68,223,0.06)]',  border: 'border-[rgba(205,68,223,0.18)]' },
  ]
  const a = accents[index % accents.length]

  return (
    <div className={`rounded-2xl border p-4 ${a.bg} ${a.border}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`h-2 w-2 rounded-full flex-shrink-0 ${a.dot}`} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {label}
        </span>
      </div>
      <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">{value}</p>
    </div>
  )
}

/* ─── Modal ─────────────────────────────────────────────────────────────── */
function SpeakerModal({ speaker, onClose }) {
  const [activeTab, setActiveTab] = useState('About')

  useEffect(() => {
    if (speaker) {
      setActiveTab('About')
      document.body.style.overflow = 'hidden'
    }
    return () => { document.body.style.overflow = '' }
  }, [speaker])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!speaker) return null

  const hasEducation  = speaker.education?.filter(e => e.degree).length > 0
  const hasAwards     = speaker.awards?.length > 0
  const hasHighlights = speaker.highlights?.length > 0
  const hasExpertise  = speaker.expertise?.length > 0

  const visibleTabs = TAB_LIST.filter((t) => {
    if (t === 'About')       return true
    if (t === 'Career')      return hasHighlights
    if (t === 'Recognition') return hasEducation || hasAwards
    return false
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-[rgba(0,8,74,0.65)] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${speaker.name} profile`}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-t-[28px] sm:rounded-[20px] bg-[var(--color-warm-white)] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero header — split: portrait photo left, identity right ── */}
        <div className="relative flex-shrink-0 flex bg-gradient-eventor-dark" style={{ minHeight: '200px' }}>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(0,0,0,0.4)] text-white backdrop-blur-sm transition hover:bg-[rgba(0,0,0,0.6)]"
          >
            <XIcon className="h-4 w-4" />
          </button>

          {/* Portrait photo — contained so full face always visible */}
          <div className="flex-shrink-0 w-36 sm:w-44 self-stretch overflow-hidden relative">
            {speaker.photoUrl ? (
              <img
                src={speaker.photoUrl}
                alt={speaker.name}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: speaker.photoPosition || 'center top' }}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-blue-deep)]">
                <span className="font-[var(--font-display)] text-5xl text-white opacity-30">
                  {speaker.name?.charAt(0)}
                </span>
              </div>
            )}
            {/* Right-edge fade so photo blends into the dark panel */}
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-r from-transparent to-[var(--color-navy)]" />
          </div>

          {/* Identity panel */}
          <div className="flex flex-1 flex-col justify-center px-5 py-6 pr-12 min-w-0">
            {speaker.isFeatured && (
              <span className="mb-3 inline-flex self-start items-center gap-1.5 rounded-[var(--radius-pill)] bg-[rgba(235,66,250,0.2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-magenta)] border border-[rgba(235,66,250,0.3)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-magenta)]" />
                Featured Speaker
              </span>
            )}
            <h2 className="font-[var(--font-display)] text-xl sm:text-2xl leading-tight text-white">
              {speaker.name}
            </h2>
            <p className="mt-1.5 text-sm text-[var(--color-bridge)] leading-snug font-medium">
              {speaker.title}
            </p>
            <p className="mt-1 text-xs text-[rgba(250,243,255,0.5)] leading-snug">{speaker.organization}</p>

            {/* Session chips */}
            {speaker.sessions?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {speaker.sessions.map((session) => (
                  <span
                    key={session.id}
                    className="inline-flex items-center rounded-[var(--radius-pill)] border border-[rgba(107,127,232,0.35)] bg-[rgba(107,127,232,0.18)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-bridge)]"
                  >
                    {SESSION_TYPE_LABELS[session.type] ?? session.type} · {formatSessionTime(session.startTime)}
                  </span>
                ))}
              </div>
            )}

            {/* Social quick-links in header */}
            {(speaker.linkedinUrl || speaker.twitterUrl) && (
              <div className="mt-4 flex gap-2">
                {speaker.linkedinUrl && (
                  <a
                    href={speaker.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,255,255,0.1)] text-[rgba(250,243,255,0.7)] transition hover:bg-[rgba(255,255,255,0.2)] hover:text-white"
                  >
                    <LinkedInIcon className="h-3.5 w-3.5" />
                  </a>
                )}
                {speaker.twitterUrl && (
                  <a
                    href={speaker.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,255,255,0.1)] text-[rgba(250,243,255,0.7)] transition hover:bg-[rgba(255,255,255,0.2)] hover:text-white"
                  >
                    <TwitterIcon className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex-shrink-0 flex gap-1 px-2 border-b border-[var(--color-mist)] bg-[var(--color-warm-white)]">
          {visibleTabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={[
                'relative px-4 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none',
                activeTab === t
                  ? 'text-[var(--color-blue-core)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
              ].join(' ')}
            >
              {t}
              {activeTab === t && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--color-blue-core)]" />
              )}
            </button>
          ))}
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ABOUT */}
          {activeTab === 'About' && (
            <div className="p-6 space-y-6">
              {speaker.tagline && (
                <p className="text-base font-medium text-[var(--color-blue-deep)] leading-snug border-l-2 border-[var(--color-magenta)] pl-4">
                  {speaker.tagline}
                </p>
              )}

              {speaker.biography ? (
                <div className="space-y-3">
                  {speaker.biography.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-[var(--text-muted)]">Biography coming soon.</p>
              )}

              {hasExpertise && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">
                    Areas of Expertise
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {speaker.expertise.map((e) => <ExpertiseChip key={e} label={e} />)}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* CAREER */}
          {activeTab === 'Career' && (
            <div className="p-6">
              {hasHighlights ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {speaker.highlights.map((h, i) => (
                    <CareerCard key={h.label} label={h.label} value={h.value} index={i} />
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-[var(--text-muted)]">Career details coming soon.</p>
              )}
            </div>
          )}

          {/* RECOGNITION */}
          {activeTab === 'Recognition' && (
            <div className="p-6 space-y-8">
              {hasEducation && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-5">
                    Education
                  </p>
                  <div className="border-l-2 border-[var(--color-mist)] pl-0">
                    {speaker.education.filter(e => e.degree).map((edu, i) => (
                      <EducationItem key={i} edu={edu} />
                    ))}
                  </div>
                </div>
              )}

              {hasAwards && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-5">
                    Awards & Recognition
                  </p>
                  <div className="space-y-4">
                    {speaker.awards.map((award, i) => (
                      <AwardItem key={i} text={award} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {!hasEducation && !hasAwards && (
                <p className="text-sm italic text-[var(--text-muted)]">Recognition details coming soon.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Speaker Card — full-bleed photo, name overlaid at bottom ──────────── */
function SpeakerCard({ speaker, onClick, index }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 })
  const delays = [0, 60, 120, 180, 240, 300, 360, 420, 480, 540]

  return (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      className={[
        'group relative overflow-hidden rounded-2xl text-left',
        'aspect-[3/4] w-full',
        'transition-[transform,box-shadow,opacity] duration-300',
        'hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(0,14,122,0.22)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
      ].join(' ')}
      style={!isVisible ? { transitionDelay: `${delays[index % 10]}ms`, transitionDuration: '550ms' } : undefined}
    >
      {/* Full-bleed photo */}
      {speaker.photoUrl ? (
        <img
          src={speaker.photoUrl}
          alt={speaker.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: speaker.photoPosition || 'center top' }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-frost)] to-[var(--color-mist)] flex items-center justify-center">
          <span className="font-[var(--font-display)] text-6xl text-[var(--color-bridge)] opacity-30">
            {speaker.name?.charAt(0)}
          </span>
        </div>
      )}

      {/* Permanent bottom gradient — always visible for name legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,8,74,0.88)] via-[rgba(0,8,74,0.18)] to-transparent" />

      {/* Hover overlay — expertise tags slide up */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 bg-gradient-to-t from-[rgba(0,8,74,0.95)] via-[rgba(0,8,74,0.6)] to-transparent">
        <div className="mb-3 flex flex-col gap-1.5">
          {speaker.expertise?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="self-start rounded-[var(--radius-pill)] bg-[rgba(255,255,255,0.12)] px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm border border-[rgba(255,255,255,0.1)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-magenta)]">
          View Profile →
        </span>
      </div>

      {/* Name block — always visible at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-0 transition-transform duration-300 group-hover:translate-y-1 group-hover:opacity-0">
        <p className="font-semibold text-sm leading-snug text-white">{speaker.name}</p>
        <p className="mt-0.5 text-xs text-[var(--color-bridge)] leading-snug line-clamp-1 font-medium">
          {speaker.title}
        </p>
        <p className="mt-0.5 text-[11px] text-[rgba(250,243,255,0.55)] leading-snug">{speaker.organization}</p>
        {speaker.sessions?.length > 0 && (
          <span className="mt-2 inline-flex items-center rounded-[var(--radius-pill)] border border-[rgba(107,127,232,0.4)] bg-[rgba(107,127,232,0.2)] px-2 py-0.5 text-[10px] font-medium text-[rgba(250,243,255,0.85)] backdrop-blur-sm">
            {SESSION_TYPE_LABELS[speaker.sessions[0].type] ?? speaker.sessions[0].type} · {formatSessionTime(speaker.sessions[0].startTime)}
          </span>
        )}
      </div>

      {/* Featured badge */}
      {speaker.isFeatured && (
        <div className="absolute left-3 top-3">
          <span className="flex items-center gap-1 rounded-[var(--radius-pill)] bg-[rgba(0,8,74,0.6)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-magenta)] backdrop-blur-sm border border-[rgba(235,66,250,0.25)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-magenta)]" />
            Featured
          </span>
        </div>
      )}
    </button>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function SpeakersPage() {
  const [selected, setSelected] = useState(null)
  const speakers = useMemo(() => getEventData().speakers, [])

  return (
    <div className="min-h-screen bg-[var(--color-ice)]">
      <PageHero
        eyebrow="All Health X Tech Summit 2026"
        title="Our Speakers"
        subtitle="Visionaries from clinical practice, research, policy, and industry — all under one roof."
        compact
      />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        {speakers.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {speakers.map((s, index) => (
              <SpeakerCard key={s.id} speaker={s} onClick={() => setSelected(s)} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-sm text-[var(--text-muted)]">Speaker announcements coming soon.</p>
          </div>
        )}
      </div>

      <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
