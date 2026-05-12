import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { ArrowRightIcon } from '../icons'
import LoadingSpinner from '../ui/LoadingSpinner'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

function SpeakerCard({ speaker, index }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const delays = ['', 'scroll-delay-100', 'scroll-delay-200', 'scroll-delay-300', 'scroll-delay-400', 'scroll-delay-500']
  
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl overflow-hidden bg-slate-800/50 border-2 border-blue-500/30 shadow-2xl hover:shadow-blue-500/30 hover:border-blue-400/60 hover:-translate-y-2 transition-all duration-300 cursor-pointer backdrop-blur-xl scroll-scale-in ${delays[index]} ${isVisible ? 'visible' : ''}`}
    >
      {/* Portrait — 3:4 ratio */}
      <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
        {speaker.photoUrl ? (
          <img
            src={speaker.photoUrl}
            alt={speaker.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-sky-900/50 flex items-center justify-center">
            <span className="text-5xl font-[var(--font-primary)] font-black text-blue-400 opacity-40">{speaker.name.charAt(0)}</span>
          </div>
        )}

        {/* Strong gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 50%, transparent 100%)' }}
          aria-hidden="true"
        />

        {/* Featured badge with strong contrast */}
        {speaker.isFeatured && (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-sky-500 text-white text-[10px] font-[var(--font-secondary)] font-bold uppercase tracking-wide shadow-lg shadow-blue-500/50 border border-white/20">
            Featured
          </div>
        )}

        {/* Speaker info with high contrast */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-white font-[var(--font-primary)] font-bold text-base leading-tight drop-shadow-lg">{speaker.name}</p>
          <p className="text-blue-400 text-xs mt-1 font-[var(--font-secondary)] font-semibold">{speaker.title}</p>
          <p className="text-slate-300 text-xs mt-0.5 font-[var(--font-secondary)]">{speaker.organization}</p>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  )
}

export default function FeaturedSpeakers() {
  const [speakers, setSpeakers] = useState([])
  const [loading, setLoading] = useState(true)
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 })

  useEffect(() => {
    apiFetch('/api/speakers')
      .then((data) => setSpeakers(data.filter((s) => s.isFeatured).slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="bg-gradient-to-br from-[#F0F4FF] via-white to-[#F5F9FF] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with high contrast */}
        <div ref={headerRef} className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 scroll-fade-in ${headerVisible ? 'visible' : ''}`}>
          <div>
            <span className="text-xs font-[var(--font-secondary)] font-bold uppercase tracking-[0.1em] mb-3 text-blue-600 inline-block">Speakers</span>
            <h2 className="text-4xl font-[var(--font-primary)] font-bold text-slate-900 leading-tight">Visionaries &amp; Pioneers</h2>
            <p className="text-base text-slate-600 leading-relaxed mt-3 max-w-lg font-[var(--font-secondary)]">
              30+ leaders from clinical practice, research, policy, and industry — all under one roof.
            </p>
          </div>
          <Link
            to="/speakers"
            className="inline-flex items-center gap-1.5 text-blue-600 font-[var(--font-secondary)] font-semibold text-sm hover:text-blue-700 hover:gap-2.5 transition-all duration-[var(--transition-eventor-fast)] flex-shrink-0"
          >
            All Speakers
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : speakers.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm font-[var(--font-secondary)]">Speaker announcements coming soon.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {speakers.map((s, index) => (
              <Link key={s.id} to="/speakers">
                <SpeakerCard speaker={s} index={index} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
