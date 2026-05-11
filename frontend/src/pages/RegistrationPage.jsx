import useRegistrationStore from '../stores/registrationStore.js'
import StepIndicator from '../components/registration/StepIndicator.jsx'
import TicketSelectionStep from '../components/registration/TicketSelectionStep.jsx'
import AttendeeDetailsStep from '../components/registration/AttendeeDetailsStep.jsx'
import ReviewStep from '../components/registration/ReviewStep.jsx'
import PaymentStep from '../components/registration/PaymentStep.jsx'
import SuccessStep from '../components/registration/SuccessStep.jsx'

const STEPS = [
  { key: 'ticket', label: 'Select Ticket' },
  { key: 'details', label: 'Your Details' },
  { key: 'review', label: 'Review' },
  { key: 'payment', label: 'Payment' },
]

function StepContent({ step }) {
  switch (step) {
    case 'ticket':  return <TicketSelectionStep />
    case 'details': return <AttendeeDetailsStep />
    case 'review':  return <ReviewStep />
    case 'payment': return <PaymentStep />
    case 'success': return <SuccessStep />
    default:        return <TicketSelectionStep />
  }
}

export default function RegistrationPage() {
  const currentStep = useRegistrationStore((s) => s.currentStep)
  const isSuccess = currentStep === 'success'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div
        className="bg-dark-900 py-14 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(34,0,255,0.15) 0%, transparent 70%)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">AllHealthTech 2025</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Register for the Conference</h1>
          <p className="text-white/50 text-sm mt-2">October 15–17 · Bombay Exhibition Centre, Mumbai</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Step indicator */}
        {!isSuccess && (
          <div className="mb-8">
            <StepIndicator steps={STEPS} currentStep={currentStep} />
          </div>
        )}

        {/* Step content card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 sm:p-8">
          <StepContent step={currentStep} />
        </div>
      </div>
    </div>
  )
}
