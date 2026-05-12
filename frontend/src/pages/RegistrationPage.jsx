import { useLocation } from 'react-router-dom'
import useRegistrationStore from '../stores/registrationStore.js'
import SimpleRegistrationForm from '../components/registration/SimpleRegistrationForm.jsx'
import SuccessStep from '../components/registration/SuccessStep.jsx'

export default function RegistrationPage() {
  const location = useLocation()
  const confirmedTicketId = useRegistrationStore((s) => s.confirmedTicketId)
  
  // Show success page if we're on the success route or if we have a confirmed ticket ID
  const isSuccess = location.pathname === '/registration/success' || confirmedTicketId

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F0FF] via-[#F0F4FF] to-[#F5F9FF]">
      {/* Modern hero header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#E8F0FF] via-[#F0F4FF] to-[#F5F9FF] py-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 via-transparent to-[#0EA5E9]/10"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(59,130,246,0.1)] border border-[#3B82F6] border-opacity-20 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">AllHealthTech 2025</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-3 tracking-tight">
            Register for the Conference
          </h1>
          <p className="text-[#6B7280] text-lg">October 15–17 · Bombay Exhibition Centre, Mumbai</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Modern registration card with subtle shadow */}
        <div className="bg-white rounded-2xl border border-[#E8F0FF] shadow-lg p-8 sm:p-10">
          {isSuccess ? <SuccessStep /> : <SimpleRegistrationForm />}
        </div>
      </div>
    </div>
  )
}
