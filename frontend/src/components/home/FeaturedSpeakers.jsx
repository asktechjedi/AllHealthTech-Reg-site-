import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { ArrowRightIcon } from '../icons'
import LoadingSpinner from '../ui/LoadingSpinner'

function SpeakerCard({ speaker }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-dark-800 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      {/* Portrait — 3:4 ratio */}
      <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
        {speaker.photoUrl ? (
          <img
            src={speaker.photoUrl}
            alt={speaker.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-dark-700 flex items-center justify-center">
            <span className="text-5xl font-black text-white/20">{speaker.name.charAt(0)}</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,10,20,0.92) 0%, rgba(10,10,20,0.3) 50%, transparent 100%)' }}
          aria-hidden="true"
        />

        {/* Featured badge */}
        {speaker.isFeatured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wide">
            Featured
          </div>
        )}

        {/* Speaker info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-white font-bold text-base leading-tight">{speaker.name}</p>
          <p className="text-brand-400 text-xs mt-0.5 font-medium">{speaker.title}</p>
          <p className="text-white/50 text-xs mt-0.5">{speaker.organization}</p>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedSpeakers() {
  const [speakers, setSpeakers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/speakers')
      .then((data) => setSpeakers(data.filter((s) => s.isFeatured).slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="section-label">Speakers</span>
            <h2 className="section-title">Visionaries &amp; Pioneers</h2>
            <p className="section-subtitle max-w-lg">
              30+ leaders from clinical practice, research, policy, and industry — all under one roof.
            </p>
          </div>
          <Link
            to="/speakers"
            className="inline-flex items-center gap-1.5 text-brand-600 font-semibold text-sm hover:gap-2.5 transition-all duration-200 flex-shrink-0"
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
          <div className="text-center py-16 text-gray-400 text-sm">Speaker announcements coming soon.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {speakers.map((s) => (
              <Link key={s.id} to="/speakers">
                <SpeakerCard speaker={s} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
