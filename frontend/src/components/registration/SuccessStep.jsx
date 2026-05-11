import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useRegistrationStore from '../../stores/registrationStore.js'
import { CheckIcon, CalendarIcon, UserIcon } from '../icons'

export default function SuccessStep() {
  const { confirmedTicketId, attendeeDetails, clearPaymentData } = useRegistrationStore()

  useEffect(() => {
    clearPaymentData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center text-center py-8 max-w-lg mx-auto">
      {/* Success icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
        <CheckIcon className="h-9 w-9 text-emerald-600" />
      </div>

      <h2 className="text-3xl font-black text-dark-900 mb-2">You're registered!</h2>
      <p className="text-gray-400 mb-8 text-sm">
        A confirmation email has been sent to{' '}
        <span className="font-semibold text-dark-900">{attendeeDetails?.attendeeEmail}</span>.
      </p>

      {/* Ticket ID card */}
      <div className="w-full rounded-2xl border-2 border-brand-200 bg-ice-50 p-6 mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-1.5">Your Ticket ID</p>
        <p className="text-2xl font-black text-dark-900 tracking-wide font-mono">
          {confirmedTicketId ?? '—'}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Keep this ID safe — you'll need it to check your registration.
        </p>
      </div>

      {/* Event details */}
      <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 text-left mb-8 shadow-card space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Event Details</h3>
        <div className="flex items-center gap-2.5 text-sm text-dark-900">
          <CalendarIcon className="h-4 w-4 text-brand-600 flex-shrink-0" />
          <span>AllHealthTech Conference 2025 · Oct 15–17</span>
        </div>
        {attendeeDetails?.attendeeName && (
          <div className="flex items-center gap-2.5 text-sm text-dark-900">
            <UserIcon className="h-4 w-4 text-brand-600 flex-shrink-0" />
            <span>{attendeeDetails.attendeeName}</span>
          </div>
        )}
      </div>

      {/* Navigation links */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link
          to="/check-registration"
          className="flex-1 rounded-xl border-2 border-brand-600 py-3 text-sm font-semibold text-brand-600 text-center hover:bg-ice-50 transition-colors duration-200"
        >
          Check My Registration
        </Link>
        <Link
          to="/"
          className="flex-1 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white text-center hover:bg-brand-700 hover:shadow-brand transition-all duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
