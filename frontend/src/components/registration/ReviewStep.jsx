import useRegistrationStore from '../../stores/registrationStore.js'
import Button from '../ui/Button.jsx'

function formatPrice(paise) {
  const rupees = paise / 100
  return '₹' + rupees.toLocaleString('en-IN')
}

function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-dark-900 text-right max-w-xs">{value}</span>
    </div>
  )
}

export default function ReviewStep() {
  const { selectedTicket, attendeeDetails, setStep } = useRegistrationStore()

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark-900 mb-1">Review Your Order</h2>
      <p className="text-gray-400 text-sm mb-8">Please confirm your details before proceeding to payment.</p>

      <div className="max-w-lg space-y-5">
        {/* Ticket summary */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Selected Ticket</h3>
          <Row label="Ticket Type" value={selectedTicket?.name} />
          <Row label="Price" value={selectedTicket ? formatPrice(selectedTicket.price) : undefined} />
        </div>

        {/* Attendee summary */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Attendee Details</h3>
          <Row label="Name" value={attendeeDetails?.attendeeName} />
          <Row label="Email" value={attendeeDetails?.attendeeEmail} />
          <Row label="Phone" value={attendeeDetails?.attendeePhone} />
          <Row label="Organization" value={attendeeDetails?.organization} />
          <Row label="Role" value={attendeeDetails?.role} />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => setStep('details')}>
            Back
          </Button>
          <Button type="button" variant="primary" onClick={() => setStep('payment')}>
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  )
}
