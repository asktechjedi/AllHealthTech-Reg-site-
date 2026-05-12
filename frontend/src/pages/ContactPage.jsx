import { useState, useEffect } from 'react'
import { apiFetch } from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import AnimatedSection from '../components/ui/AnimatedSection'
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, CheckIcon } from '../components/icons'

const INFO = [
  { icon: MailIcon, label: 'Email', value: 'info@allhealthtech.com', href: 'mailto:info@allhealthtech.com' },
  { icon: PhoneIcon, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: MapPinIcon, label: 'Venue', value: 'Bombay Exhibition Centre, Mumbai, India', href: null },
  { icon: ClockIcon, label: 'Office Hours', value: 'Mon–Fri, 9 AM – 6 PM IST', href: null },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Disable body scrolling when this page is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      await apiFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setError(err.message || 'Failed to send. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Layer 1: base — white to light sky blue */}
      <div
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #F0F7FF 30%, #DBEAFE 60%, #BFDBFE 100%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 2: ambient blue radial orbs */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 900px 700px at 80% 20%, rgba(59,130,246,0.14) 0%, transparent 65%),
            radial-gradient(ellipse 700px 500px at 10% 80%, rgba(96,165,250,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 500px 400px at 50% 50%, rgba(147,197,253,0.10) 0%, transparent 55%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Layer 3: top-right blue bloom */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(93,169,233,0.20) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 4: bottom-left blue bloom */}
      <div
        className="fixed bottom-0 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(56,149,240,0.13) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 5: subtle grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
        aria-hidden="true"
      />

      {/* Content container - Fixed, no scroll */}
      <div className="relative z-10 h-full overflow-hidden">
        {/* Hero header with bright styling - Compact */}
        <AnimatedSection animation="fadeUp" duration={800}>
          <div className="relative z-10 py-18 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <span className="inline-block text-xs font-[var(--font-secondary)] font-bold uppercase tracking-widest text-[#3B82F6] mb-2">Get in Touch</span>
              <h1 className="text-3xl sm:text-4xl font-[var(--font-primary)] font-black text-[#1F2937] mb-2">Contact Us</h1>
              <p className="text-[#6B7280] opacity-90 font-[var(--font-secondary)] text-base">Questions about the event? We're here to help.</p>
            </div>
          </div>
        </AnimatedSection>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Info panel with bright styling - Compact */}
            <AnimatedSection animation="slideRight" duration={800} delay={200} className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-white border border-[#E8F0FF] rounded-[var(--radius-2xl)] p-5 text-[#1F2937] shadow-lg">
                <h2 className="font-[var(--font-primary)] font-bold text-base mb-1">AllHealthTech Events</h2>
                <p className="text-[#6B7280] font-[var(--font-secondary)] text-xs mb-4">Organiser of India's premier health technology conference.</p>
                <div className="flex flex-col gap-3">
                  {INFO.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-[var(--radius-md)] bg-[rgba(59,130,246,0.1)] border border-[#3B82F6] border-opacity-20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-[#3B82F6]" />
                      </div>
                      <div>
                        <p className="text-[#6B7280] opacity-60 font-[var(--font-secondary)] text-[10px] font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                        {href ? (
                          <a href={href} className="text-[#1F2937] font-[var(--font-secondary)] text-xs hover:text-[#3B82F6] transition-colors">
                            {value}
                          </a>
                        ) : (
                          <p className="text-[#1F2937] font-[var(--font-secondary)] text-xs">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[rgba(59,130,246,0.1)] border border-[#3B82F6] border-opacity-20 rounded-[var(--radius-2xl)] p-4">
                <p className="text-[#3B82F6] font-[var(--font-secondary)] font-semibold text-xs mb-1">Registration Queries</p>
                <p className="text-[#6B7280] font-[var(--font-secondary)] text-[11px] leading-relaxed">
                  For ticket-related questions, contact us at <strong>info@allhealthtech.com</strong> with your Ticket ID.
                </p>
              </div>
            </AnimatedSection>

            {/* Form with bright styling - Compact */}
            <AnimatedSection animation="slideLeft" duration={800} delay={200} className="lg:col-span-3 bg-white rounded-[var(--radius-2xl)] border border-[#E8F0FF] shadow-lg p-5">
              <h2 className="font-[var(--font-primary)] font-bold text-[#1F2937] text-lg mb-4">Send a Message</h2>

              {success && (
                <div className="mb-3 rounded-[var(--radius-lg)] bg-[rgba(34,197,94,0.1)] border border-[#22C55E] border-opacity-20 p-3 flex items-center gap-2 text-[#22C55E]">
                  <CheckIcon className="w-4 h-4 flex-shrink-0" />
                  <p className="text-xs font-[var(--font-secondary)] font-medium">Message sent! We'll get back to you within 24 hours.</p>
                </div>
              )}
              {error && (
                <div className="mb-3 rounded-[var(--radius-lg)] bg-[rgba(239,68,68,0.1)] border border-[#EF4444] border-opacity-20 p-3 text-[#EF4444] font-[var(--font-secondary)] text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    id="name" name="name" label="Full Name"
                    value={form.name} onChange={handleChange}
                    placeholder="Dr. Priya Sharma" required
                  />
                  <Input
                    id="email" name="email" type="email" label="Email Address"
                    value={form.email} onChange={handleChange}
                    placeholder="priya@hospital.com" required
                  />
                </div>
                <Input
                  id="subject" name="subject" label="Subject"
                  value={form.subject} onChange={handleChange}
                  placeholder="Speaker nomination, sponsorship, general enquiry..." required
                />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-[var(--font-secondary)] font-medium text-[#1F2937]">
                    Message <span className="text-[#3B82F6]">*</span>
                  </label>
                  <textarea
                    id="message" name="message" value={form.message}
                    onChange={handleChange} required rows={3}
                    placeholder="Tell us how we can help..."
                    className="w-full rounded-[var(--radius-lg)] border border-[#E8F0FF] bg-white px-4 py-2.5 text-[#1F2937] placeholder-[#9CA3AF] font-[var(--font-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20 focus:border-[#3B82F6] hover:border-[#E8F0FF] transition-all resize-none"
                  />
                </div>
                <Button type="submit" loading={submitting} className="w-full mt-1">
                  {submitting ? 'Sending…' : 'Send Message'}
                </Button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  )
}
