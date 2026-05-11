import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import { CheckIcon, LockIcon, MailIcon, RefundIcon } from '../components/icons'

function fmt(p) {
  return '₹' + (p / 100).toLocaleString('en-IN')
}

const TIER_STYLE = {
  General: { ring: '', popular: false, badge: '' },
  VIP: { ring: 'ring-2 ring-brand-500/40', popular: true, badge: 'Most Popular' },
  Student: { ring: '', popular: false, badge: '' },
}

const trustSignals = [
  { icon: LockIcon, text: 'Secure payment via Razorpay' },
  { icon: MailIcon, text: 'Instant confirmation email' },
  { icon: RefundIcon, text: 'Refund policy applies' },
]

export default function PricingPage() {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiFetch('/api/events/current')
      .then(setEvent)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const tickets = event?.ticketTypes?.filter((t) => t.isActive) ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div
        className="bg-dark-900 py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(34,0,255,0.15) 0%, transparent 70%)' }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">Registration</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Choose Your Pass</h1>
          <p className="text-white/60 text-lg">Invest in three days that will shape your career and network.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
              {tickets.map((t) => {
                const style = TIER_STYLE[t.name] ?? TIER_STYLE.General
                const soldOut = t.capacity != null && t.soldCount >= t.capacity

                return (
                  <div
                    key={t.id}
                    className={[
                      'relative bg-white rounded-2xl border-2 p-7 flex flex-col transition-all duration-200',
                      style.popular
                        ? 'border-brand-500 shadow-brand-lg'
                        : 'border-gray-100 shadow-card',
                      style.ring,
                    ].join(' ')}
                  >
                    {/* Popular badge */}
                    {style.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-600 text-white text-xs font-bold whitespace-nowrap">
                        {style.badge}
                      </div>
                    )}

                    {/* Sold out badge */}
                    {soldOut && (
                      <div className="absolute -top-3.5 right-4 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                        Sold Out
                      </div>
                    )}

                    {/* Ticket info */}
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{t.name} Pass</p>
                      <div className="text-4xl font-black text-dark-900">{fmt(t.price)}</div>
                      <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">{t.description}</p>
                    </div>

                    {/* Features */}
                    <ul className="flex flex-col gap-3 mb-8 flex-1">
                      {(t.features ?? []).map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <CheckIcon className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    {soldOut ? (
                      <button
                        disabled
                        className="w-full py-3 rounded-xl bg-ice-100 text-gray-400 font-semibold text-sm cursor-not-allowed"
                      >
                        Sold Out
                      </button>
                    ) : (
                      <Link
                        to="/register"
                        className={[
                          'block w-full py-3 rounded-xl font-semibold text-sm text-center transition-all duration-200',
                          style.popular
                            ? 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-brand'
                            : 'bg-dark-800 text-white hover:bg-dark-700',
                        ].join(' ')}
                      >
                        Get {t.name} Pass
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex flex-wrap justify-center gap-8">
              {trustSignals.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-400">
                  <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
