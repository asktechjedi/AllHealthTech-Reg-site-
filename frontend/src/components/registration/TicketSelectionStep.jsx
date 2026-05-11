import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api.js'
import useRegistrationStore from '../../stores/registrationStore.js'
import LoadingSpinner from '../ui/LoadingSpinner.jsx'
import ErrorMessage from '../ui/ErrorMessage.jsx'
import { CheckIcon } from '../icons'

function formatPrice(paise) {
  const rupees = paise / 100
  return '₹' + rupees.toLocaleString('en-IN')
}

export default function TicketSelectionStep() {
  const { setSelectedTicket, setStep } = useRegistrationStore()
  const [ticketTypes, setTicketTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTickets = () => {
    setLoading(true)
    setError(null)
    apiFetch('/api/events/current')
      .then((data) => setTicketTypes(data.ticketTypes ?? []))
      .catch((err) => setError(err.message || 'Failed to load ticket types.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTickets() }, [])

  const handleSelect = (ticket) => {
    setSelectedTicket(ticket)
    setStep('details')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-400 text-sm">Loading ticket options…</p>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchTickets} className="max-w-lg mx-auto mt-8" />
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark-900 mb-1">Select Your Ticket</h2>
      <p className="text-gray-400 mb-8 text-sm">Choose the ticket type that best suits you.</p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ticketTypes.map((ticket) => {
          const soldOut = ticket.capacity != null && ticket.soldCount >= ticket.capacity
          return (
            <div
              key={ticket.id}
              className={[
                'relative flex flex-col rounded-2xl border-2 p-6 transition-all duration-200',
                soldOut
                  ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                  : 'border-gray-100 bg-white hover:border-brand-500 hover:shadow-brand cursor-pointer',
              ].join(' ')}
              onClick={() => !soldOut && handleSelect(ticket)}
              role="button"
              tabIndex={soldOut ? -1 : 0}
              aria-disabled={soldOut}
              onKeyDown={(e) => {
                if (!soldOut && (e.key === 'Enter' || e.key === ' ')) handleSelect(ticket)
              }}
            >
              {soldOut && (
                <span className="absolute top-3 right-3 rounded-lg bg-gray-400 px-2 py-0.5 text-xs font-semibold text-white">
                  Sold Out
                </span>
              )}

              <div className="mb-4">
                <h3 className="text-base font-bold text-dark-900">{ticket.name}</h3>
                <p className="text-3xl font-black text-brand-600 mt-1">{formatPrice(ticket.price)}</p>
              </div>

              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{ticket.description}</p>

              {ticket.features && ticket.features.length > 0 && (
                <ul className="mt-auto space-y-2">
                  {ticket.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 flex-shrink-0 text-brand-600 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              {!soldOut && (
                <button
                  type="button"
                  className="mt-6 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 hover:shadow-brand transition-all duration-200"
                  onClick={(e) => { e.stopPropagation(); handleSelect(ticket) }}
                >
                  Select
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
