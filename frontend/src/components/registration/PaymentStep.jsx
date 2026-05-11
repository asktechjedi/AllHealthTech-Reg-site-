import { useEffect, useRef, useState } from 'react'
import { apiFetch } from '../../lib/api.js'
import useRegistrationStore from '../../stores/registrationStore.js'
import Button from '../ui/Button.jsx'
import LoadingSpinner from '../ui/LoadingSpinner.jsx'
import ErrorMessage from '../ui/ErrorMessage.jsx'
import { LockIcon, CheckIcon } from '../icons'

// ─── DEMO MODE ───────────────────────────────────────────────────────────────
// Razorpay is bypassed for demo/testing. Registration is created in the DB
// and immediately confirmed without a real payment transaction.
// Remove DEMO_MODE = true and restore the Razorpay flow when going live.
const DEMO_MODE = true
// ─────────────────────────────────────────────────────────────────────────────

export default function PaymentStep() {
  const { selectedTicket, attendeeDetails, setConfirmedTicketId, setStep } = useRegistrationStore()
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState(null)
  const registrationRef = useRef(null)

  const handlePayment = async () => {
    setStatus('loading')
    setErrorMsg(null)

    try {
      // Step 1 — Create registration (PENDING)
      if (!registrationRef.current) {
        const regData = await apiFetch('/api/registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticketTypeId: selectedTicket.id,
            attendeeName: attendeeDetails.attendeeName,
            attendeeEmail: attendeeDetails.attendeeEmail,
            attendeePhone: attendeeDetails.attendeePhone,
            organization: attendeeDetails.organization,
            role: attendeeDetails.role,
          }),
        })
        registrationRef.current = regData
      }

      const { registrationId, ticketId } = registrationRef.current

      if (DEMO_MODE) {
        // ── Demo: skip Razorpay, confirm directly via a mock verify call ──
        // We call the verify endpoint with fake IDs so the backend marks
        // the registration as CONFIRMED. The backend will accept this in
        // demo mode because signature verification is skipped.
        // For production: replace this block with real Razorpay checkout.
        await apiFetch('/api/payments/demo-confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registrationId }),
        })
        setConfirmedTicketId(ticketId)
        setStatus('success')
        setTimeout(() => setStep('success'), 800)
      }
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  useEffect(() => {
    handlePayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-dark-900 mb-1">Payment</h2>
      <p className="text-gray-400 text-sm mb-8">Confirming your registration…</p>

      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400 text-sm">Processing your registration…</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckIcon className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-gray-600 text-sm font-medium">Registration confirmed! Redirecting…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <ErrorMessage message={errorMsg} />
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setStep('review')}>
              Back
            </Button>
            <Button type="button" variant="primary" onClick={handlePayment}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Demo notice */}
      {DEMO_MODE && status !== 'error' && (
        <div className="mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
          <span className="text-amber-600 text-xs font-semibold">Demo Mode — Payment bypassed for testing</span>
        </div>
      )}

      {/* Secure badge */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <LockIcon className="h-3.5 w-3.5 text-emerald-500" />
        <span>Registration data is securely stored</span>
      </div>
    </div>
  )
}
