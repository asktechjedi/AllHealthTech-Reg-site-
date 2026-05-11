import { useState } from 'react'
import { apiFetch } from '../lib/api'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import ErrorMessage from '../components/ui/ErrorMessage'

function paymentVariant(s) {
  return { PAID: 'success', PENDING: 'warning', FAILED: 'error', REFUNDED: 'info' }[s] ?? 'default'
}
function regVariant(s) {
  return { CONFIRMED: 'success', PENDING: 'warning', CANCELLED: 'error' }[s] ?? 'default'
}
function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 border-b border-gray-100 last:border-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="text-sm text-dark-900 font-medium">{value ?? '—'}</dd>
    </div>
  )
}

function RegistrationDetails({ data, onReset }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [cancelled, setCancelled] = useState(data.registrationStatus === 'CANCELLED')

  async function handleCancel() {
    setCancelError('')
    setCancelling(true)
    try {
      await apiFetch(`/api/registrations/${data.registrationId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.attendeeEmail, ticketId: data.ticketId }),
      })
      setCancelled(true)
      setShowConfirm(false)
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel.')
    } finally {
      setCancelling(false)
    }
  }

  const currentStatus = cancelled ? 'CANCELLED' : data.registrationStatus

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-dark-900">Registration Found</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            Ticket ID:{' '}
            <span className="font-mono font-bold text-brand-600">{data.ticketId}</span>
          </p>
        </div>
        <Badge variant={regVariant(currentStatus)}>{currentStatus}</Badge>
      </div>

      <dl className="mb-6">
        <Row label="Attendee Name" value={data.attendeeName} />
        <Row label="Email" value={data.attendeeEmail} />
        <Row label="Ticket Type" value={data.ticketType} />
        <Row
          label="Payment Status"
          value={<Badge variant={paymentVariant(data.paymentStatus)}>{data.paymentStatus}</Badge>}
        />
        <Row label="Event" value={data.eventName} />
        <Row label="Event Date" value={fmtDate(data.eventDate)} />
        <Row label="Location" value={data.eventLocation} />
        <Row label="Registered On" value={fmtDate(data.createdAt)} />
      </dl>

      {cancelled && data.registrationStatus !== 'CANCELLED' && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-700 text-sm mb-4">
          Registration cancelled. Refund has been initiated.
        </div>
      )}

      {!cancelled && data.registrationStatus === 'CONFIRMED' && !showConfirm && (
        <Button variant="danger" size="sm" onClick={() => setShowConfirm(true)}>
          Cancel Registration
        </Button>
      )}

      {showConfirm && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 flex flex-col gap-3 mt-2">
          <p className="text-sm font-bold text-red-800">Are you sure you want to cancel?</p>
          <p className="text-xs text-red-600 leading-relaxed">
            Refunds are processed within 5–7 business days. Cancellations within 48 hours of the event are not eligible for a refund.
          </p>
          {cancelError && <ErrorMessage message={cancelError} />}
          <div className="flex gap-3 flex-wrap">
            <Button variant="danger" size="sm" loading={cancelling} onClick={handleCancel}>
              Confirm Cancellation
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={cancelling}
              onClick={() => { setShowConfirm(false); setCancelError('') }}
            >
              Keep Registration
            </Button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        className="mt-6 text-xs text-gray-400 hover:text-brand-600 underline transition-colors"
      >
        Look up a different registration
      </button>
    </div>
  )
}

function LookupForm({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [ticketId, setTicketId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiFetch(
        `/api/registrations/lookup?${new URLSearchParams({ email, ticketId })}`
      )
      onSuccess(data)
    } catch (err) {
      setError(err.message || 'No registration found.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        id="email" name="email" type="email"
        label="Registered Email Address"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        id="ticketId" name="ticketId"
        label="Ticket ID"
        placeholder="AHT-2025-00001"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        required
      />
      {error && <ErrorMessage message={error} />}
      <Button type="submit" loading={loading} disabled={!email || !ticketId}>
        Look Up My Registration
      </Button>
    </form>
  )
}

export default function CheckRegistrationPage() {
  const [registration, setRegistration] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div
        className="bg-dark-900 py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(34,0,255,0.15) 0%, transparent 70%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">My Ticket</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Check Your Registration</h1>
          <p className="text-white/60 text-lg">Enter your email and Ticket ID to view your registration details.</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-7">
          {registration ? (
            <RegistrationDetails data={registration} onReset={() => setRegistration(null)} />
          ) : (
            <LookupForm onSuccess={setRegistration} />
          )}
        </div>
      </div>
    </div>
  )
}
