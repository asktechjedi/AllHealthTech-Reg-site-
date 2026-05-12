import { useState } from 'react'
import { apiFetch } from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
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
    <div className="min-h-screen bg-gradient-to-br from-[#E8F0FF] via-[#F0F4FF] to-[#F5F9FF]">
      {/* Hero header with bright styling */}
      <div
        className="bg-gradient-to-br from-[#E8F0FF] via-[#F0F4FF] to-[#F5F9FF] py-20 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 800px 600px at 75% 30%, rgba(99,102,241,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 600px 400px at 25% 70%, rgba(139,92,246,0.06) 0%, transparent 60%)
          `,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <span className="inline-block text-xs font-[var(--font-secondary)] font-bold uppercase tracking-widest text-[#3B82F6] mb-3">Get in Touch</span>
          <h1 className="text-4xl sm:text-5xl font-[var(--font-primary)] font-black text-[#1F2937] mb-3">Contact Us</h1>
          <p className="text-[#6B7280] opacity-90 font-[var(--font-secondary)] text-lg">Questions about the event? We're here to help.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info panel with bright styling */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white border border-[#E8F0FF] rounded-[var(--radius-2xl)] p-7 text-[#1F2937] shadow-lg">
              <h2 className="font-[var(--font-primary)] font-bold text-lg mb-1">AllHealthTech Events</h2>
              <p className="text-[#6B7280] font-[var(--font-secondary)] text-sm mb-7">Organiser of India's premier health technology conference.</p>
              <div className="flex flex-col gap-5">
                {INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[rgba(59,130,246,0.1)] border border-[#3B82F6] border-opacity-20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <div>
                      <p className="text-[#6B7280] opacity-60 font-[var(--font-secondary)] text-xs font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-[#1F2937] font-[var(--font-secondary)] text-sm hover:text-[#3B82F6] transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-[#1F2937] font-[var(--font-secondary)] text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[rgba(59,130,246,0.1)] border border-[#3B82F6] border-opacity-20 rounded-[var(--radius-2xl)] p-6">
              <p className="text-[#3B82F6] font-[var(--font-secondary)] font-semibold text-sm mb-1.5">Registration Queries</p>
              <p className="text-[#6B7280] font-[var(--font-secondary)] text-xs leading-relaxed">
                For ticket-related questions, please contact us directly at <strong>info@allhealthtech.com</strong> with your Ticket ID.
              </p>
            </div>
          </div>

          {/* Form with bright styling */}
          <div className="lg:col-span-3 bg-white rounded-[var(--radius-2xl)] border border-[#E8F0FF] shadow-lg p-8">
            <h2 className="font-[var(--font-primary)] font-bold text-[#1F2937] text-xl mb-6">Send a Message</h2>

            {success && (
              <div className="mb-5 rounded-[var(--radius-lg)] bg-[rgba(34,197,94,0.1)] border border-[#22C55E] border-opacity-20 p-4 flex items-center gap-3 text-[#22C55E]">
                <CheckIcon className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-[var(--font-secondary)] font-medium">Message sent! We'll get back to you within 24 hours.</p>
              </div>
            )}
            {error && (
              <div className="mb-5 rounded-[var(--radius-lg)] bg-[rgba(239,68,68,0.1)] border border-[#EF4444] border-opacity-20 p-4 text-[#EF4444] font-[var(--font-secondary)] text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  onChange={handleChange} required rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full rounded-[var(--radius-lg)] border border-[#E8F0FF] bg-white px-4 py-3 text-[#1F2937] placeholder-[#9CA3AF] font-[var(--font-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20 focus:border-[#3B82F6] hover:border-[#E8F0FF] transition-all resize-none"
                />
              </div>
              <Button type="submit" loading={submitting} className="w-full mt-1">
                {submitting ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
