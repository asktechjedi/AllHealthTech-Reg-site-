import { useState, useEffect } from 'react'
import { apiFetch } from '../lib/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import { XIcon, LinkedInIcon, TwitterIcon } from '../components/icons'

function SpeakerModal({ speaker, onClose }) {
  if (!speaker) return null

  // Close on Escape
  const handleKey = (e) => { if (e.key === 'Escape') onClose() }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKey}
      role="dialog"
      aria-modal="true"
      aria-label={`${speaker.name} profile`}
    >
      <div
        className="bg-white rounded-2xl shadow-elegant max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo header */}
        <div className="relative h-52 bg-dark-900 rounded-t-2xl overflow-hidden">
          {speaker.photoUrl && (
            <img
              src={speaker.photoUrl}
              alt={speaker.name}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,10,20,0.9) 0%, transparent 60%)' }}
            aria-hidden="true"
          />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
          <div className="absolute bottom-5 left-6 right-6">
            {speaker.isFeatured && (
              <span className="inline-block px-2.5 py-0.5 rounded-lg bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wide mb-2">
                Featured Speaker
              </span>
            )}
            <h2 className="text-white font-black text-xl leading-tight">{speaker.name}</h2>
            <p className="text-brand-400 text-sm mt-0.5">{speaker.title} · {speaker.organization}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {speaker.biography ? (
            <p className="text-gray-600 text-sm leading-relaxed">{speaker.biography}</p>
          ) : (
            <p className="text-gray-400 text-sm italic">Biography coming soon.</p>
          )}

          {(speaker.linkedinUrl || speaker.twitterUrl) && (
            <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
              {speaker.linkedinUrl && (
                <a
                  href={speaker.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-brand-400 hover:text-brand-600 transition-all duration-150"
                >
                  <LinkedInIcon className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
              {speaker.twitterUrl && (
                <a
                  href={speaker.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-brand-400 hover:text-brand-600 transition-all duration-150"
                >
                  <TwitterIcon className="w-4 h-4" />
                  Twitter
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SpeakerCard({ speaker, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-elegant hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
    >
      {/* Photo */}
      <div className="aspect-square bg-ice-100 overflow-hidden relative">
        {speaker.photoUrl ? (
          <img
            src={speaker.photoUrl}
            alt={speaker.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-dark-800 flex items-center justify-center">
            <span className="text-4xl font-black text-white/20">{speaker.name.charAt(0)}</span>
          </div>
        )}
        {speaker.isFeatured && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wide">
            Featured
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-bold text-dark-900 text-sm leading-tight">{speaker.name}</p>
        <p className="text-brand-600 text-xs mt-0.5 truncate font-medium">{speaker.title}</p>
        <p className="text-gray-400 text-xs truncate mt-0.5">{speaker.organization}</p>
      </div>
    </button>
  )
}

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    apiFetch('/api/speakers')
      .then(setSpeakers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div
        className="bg-dark-900 py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(34,0,255,0.15) 0%, transparent 70%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">AllHealthTech 2025</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Our Speakers</h1>
          <p className="text-white/60 text-lg max-w-xl">
            30+ visionaries from clinical practice, research, policy, and industry — all under one roof.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {error && <ErrorMessage message={error} onRetry={() => location.reload()} />}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {speakers.map((s) => (
              <SpeakerCard key={s.id} speaker={s} onClick={() => setSelected(s)} />
            ))}
          </div>
        )}
        {!loading && !error && speakers.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm">Speaker announcements coming soon.</div>
        )}
      </div>

      <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
