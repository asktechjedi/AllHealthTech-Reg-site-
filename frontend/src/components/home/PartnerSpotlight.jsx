import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useReducedMotion } from 'framer-motion'
import { getEventData } from '../../lib/eventData'
import { PersonAvatarIcon } from '../icons'

import prodocLogo from '../../assets/Partner Logo/prodoc-logo.webp'
import hxaiLogo from '../../assets/Partner Logo/hxai-logo.webp'
import tobeLogo from '../../assets/Partner Logo/tobe-logo.webp'
import certinalLogo from '../../assets/Partner Logo/certinal-logo.webp'

const EASE_OUT = [0.16, 1, 0.3, 1]

/** Extra scroll reserved after the last partner's dwell, purely for the next
 *  section to fully slide up and cover this one (see HomePage's -mt overlap). */
const TRANSITION_BUFFER_VH = 200

const partners = [
  {
    id: 'hxai',
    name: 'HXAI',
    logo: hxaiLogo,
    logoClass: 'max-h-12',
    tagline: 'AI transformation partner for the US healthcare ecosystem',
    description: [
      'HXAI combines healthcare-specialized engineering teams, proprietary AI platforms, and an outcome-driven delivery model to help providers, payers, life sciences companies, and healthcare technology organizations modernize systems, deploy AI agents, and improve clinical, operational, and financial performance.',
      "Built for HIPAA-compliant environments with auditable AI agents and FHIR/HL7 interoperability, architected so protected health information never leaves the customer's infrastructure.",
    ],
    tags: ['HIPAA-Compliant AI Agents', 'FHIR/HL7 Interoperability', 'US Healthcare Ecosystem'],
    spokespersonId: 'speaker-gayathri-vivekanandan',
  },
  {
    id: 'prodoc',
    name: 'Prodoc AI',
    logo: prodocLogo,
    logoClass: 'max-h-8',
    tagline: 'AI-powered patient engagement platform for healthcare',
    description: [
      'Prodoc AI helps hospitals and healthcare providers automate communication, streamline care journeys, and improve patient outcomes — combining AI, specialized language models, and FHIR-native integration for real-time engagement across Voice AI, WhatsApp, SMS, IVR, and web chat in 135+ languages.',
      'Founded in 2022, Prodoc AI is trusted by 100+ healthcare providers across India and international markets, reducing patient drop-offs and making care more accessible and measurable.',
    ],
    tags: ['Voice AI & WhatsApp', '135+ Languages', '100+ Providers'],
    spokespersonId: 'speaker-raghuvamshi-thakur',
  },
  {
    id: 'tobe',
    name: 'ToBe',
    logo: tobeLogo,
    logoClass: 'max-h-8',
    tagline: 'AI-powered content integrity platform',
    description: [
      'ToBe is shaping the future of digital content integrity — empowering platforms, creators, and regulators with intelligent tools to verify, certify, and elevate the quality of digital communication.',
      'Its suite spans preemptive checks on ads and video before publication, AI-powered claim validation across health, finance, and personal care, and content integrity scoring, built on multimodal AI for a more trustworthy digital ecosystem.',
    ],
    tags: ['Claim Validation', 'Content Integrity Scoring', 'Multimodal AI'],
    spokespersonId: 'speaker-bharat-gupta',
  },
  {
    id: 'certinal',
    name: 'Certinal',
    logo: certinalLogo,
    logoClass: 'max-h-9',
    tagline: 'Trust, consent & compliance platform for healthcare',
    description: [
      'Certinal helps hospitals and health systems digitise patient consent, identity verification, e-signatures, and regulatory compliance through a single integrated platform, replacing fragmented paper-based workflows with audit-ready documentation.',
      "Built for HIPAA, India's DPDP Act, GDPR, PDPA, and NABH, Certinal keeps every patient interaction secure, traceable, and trustworthy.",
    ],
    tags: ['Patient Consent', 'e-Signatures', 'HIPAA & DPDP Compliant'],
    spokespersonId: 'speaker-khanjan-kotecha',
  },
]

function useSpokespeople() {
  return useMemo(() => {
    const speakers = getEventData().speakers
    const map = new Map()
    for (const p of partners) {
      map.set(p.spokespersonId, speakers.find((s) => s.id === p.spokespersonId) ?? null)
    }
    return map
  }, [])
}

function SpokespersonCredit({ speaker }) {
  if (!speaker) return null
  return (
    <Link
      to={`/speakers?speaker=${speaker.id}`}
      className="group inline-flex items-center gap-3 rounded-[var(--radius-pill)] bg-[rgba(237,232,255,0.55)] py-1.5 pl-1.5 pr-4 transition-colors duration-200 hover:bg-[rgba(237,232,255,0.95)]"
    >
      {speaker.photoUrl ? (
        <img
          src={speaker.photoUrl}
          alt=""
          className="h-8 w-8 flex-shrink-0 rounded-full object-cover object-top ring-2 ring-white"
        />
      ) : (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-mist)]">
          <PersonAvatarIcon className="h-4 w-4 text-[var(--color-navy)] opacity-50" />
        </div>
      )}
      <span className="text-left">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-blue-deep)]">Speaking at the Summit</span>
        <span className="block text-sm font-medium leading-6 text-[var(--text-primary)]">{speaker.name}</span>
      </span>
    </Link>
  )
}

function PartnerTag({ label }) {
  return (
    <span className="inline-flex items-center rounded-[var(--radius-pill)] bg-[var(--color-frost)] px-3 py-1.5 text-sm font-medium text-[var(--color-blue-deep)]">
      {label}
    </span>
  )
}

function PartnerLogo({ partner, className = '' }) {
  return (
    <img
      src={partner.logo}
      alt={partner.name}
      className={`w-auto  ${partner.logoClass} ${className}`}
    />
  )
}

/* ─── Desktop: pinned viewport, content crossfades as the rail advances ── */
function PinnedSpotlight() {
  const containerRef = useRef(null)
  const spokespeople = useSpokespeople()
  const [activeIndex, setActiveIndex] = useState(0)
  const [segmentProgress, setSegmentProgress] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const cycleVh = partners.length * 100
  const cycleRatio = cycleVh / (cycleVh + TRANSITION_BUFFER_VH)

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const raw = Math.min(1, v / cycleRatio) * partners.length
      const idx = Math.min(partners.length - 1, Math.max(0, Math.floor(raw)))
      setActiveIndex(idx)
      setSegmentProgress(Math.min(1, Math.max(0, raw - idx)))
    })
  }, [scrollYProgress, cycleRatio])

  const jumpTo = (index) => {
    const el = containerRef.current
    if (!el) return
    const targetY = el.offsetTop + (index / partners.length) * cycleRatio * el.offsetHeight + 4
    window.scrollTo({ top: targetY, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  const active = partners[activeIndex]
  const activeSpeaker = spokespeople.get(active.spokespersonId)

  return (
    <div ref={containerRef} style={{ height: `${cycleVh + TRANSITION_BUFFER_VH}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[0.75fr_1.25fr] items-center gap-16 px-4 pt-16 sm:px-6 lg:px-8 lg:pt-20">
          {/* Index rail */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Ecosystem Partners
            </p>
            <h2 className="font-[var(--font-display)] text-[clamp(3.3rem,4.4vw,4.4rem)] font-normal leading-[0.98] text-[var(--text-primary)]">
              Built alongside partners shaping the room.
            </h2>

            <div className="mt-10 flex flex-col gap-1">
              {partners.map((p, i) => {
                const isActive = i === activeIndex
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => jumpTo(i)}
                    className="group relative flex items-center gap-3 py-2.5 text-left"
                    aria-current={isActive}
                  >
                    <span className="relative h-6 w-1 flex-shrink-0 overflow-hidden rounded-full bg-[var(--color-mist)]">
                      {isActive && (
                        <motion.span
                          className="absolute inset-x-0 top-0 rounded-full bg-[var(--color-blue-core)]"
                          initial={false}
                          animate={{ height: `${segmentProgress * 100}%` }}
                          transition={{ duration: 0.1, ease: 'linear' }}
                        />
                      )}
                    </span>
                    <span
                      className={[
                        'text-lg font-medium leading-snug transition-colors duration-300 [font-family:var(--font-body)]',
                        isActive
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]',
                      ].join(' ')}
                    >
                      {p.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active partner content */}
          <div className="relative min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -28 }}
                transition={{ duration: prefersReducedMotion ? 0.15 : 0.55, ease: EASE_OUT }}
                className="rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[linear-gradient(145deg,rgba(255,254,249,1)_0%,rgba(237,244,255,0.92)_100%)] p-8 shadow-[var(--shadow-card)] sm:p-10"
              >
                <PartnerLogo partner={active} />

                <p className="mt-7 max-w-xl text-xl font-semibold leading-tight text-[var(--text-primary)]">
                  {active.tagline}
                </p>

                <div className="mt-5 max-w-xl space-y-4">
                  {active.description.map((para, i) => (
                    <p key={i} className="text-lg leading-[1.65] text-[var(--text-secondary)]">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {active.tags.map((tag) => <PartnerTag key={tag} label={tag} />)}
                </div>

                <div className="mt-8">
                  <SpokespersonCredit speaker={activeSpeaker} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Mobile / reduced-motion: normal stacked flow, no scroll pin ──────── */
function StackedSpotlight() {
  const spokespeople = useSpokespeople()

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        Ecosystem Partners
      </p>
      <h2 className="font-[var(--font-display)] text-[clamp(2.3rem,9vw,5rem)] font-normal leading-[0.98] text-[var(--text-primary)]">
        Built alongside partners shaping the room.
      </h2>

      <div className="mt-12 flex flex-col gap-6">
        {partners.map((p) => {
          const speaker = spokespeople.get(p.spokespersonId)
          return (
            <div
              key={p.id}
              className="rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[linear-gradient(145deg,rgba(255,254,249,1)_0%,rgba(237,244,255,0.92)_100%)] p-8 shadow-[var(--shadow-card)]"
            >
              <PartnerLogo partner={p} />
              <p className="mt-6 text-xl font-semibold leading-tight text-[var(--text-primary)]">{p.tagline}</p>
              <div className="mt-4 space-y-3">
                {p.description.map((para, i) => (
                  <p key={i} className="text-lg leading-[1.65] text-[var(--text-secondary)]">
                    {para}
                  </p>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((tag) => <PartnerTag key={tag} label={tag} />)}
              </div>
              <div className="mt-6">
                <SpokespersonCredit speaker={speaker} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function PartnerSpotlight() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative z-0 bg-[var(--color-frost)]">
      <div className="hidden lg:block">
        {prefersReducedMotion ? <StackedSpotlight /> : <PinnedSpotlight />}
      </div>
      <div className="lg:hidden">
        <StackedSpotlight />
      </div>
    </section>
  )
}
