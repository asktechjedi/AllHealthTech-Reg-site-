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
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div
        className="bg-dark-900 py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(34,0,255,0.15) 0%, transparent 70%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">Get in Touch</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Contact Us</h1>
          <p className="text-white/60 text-lg">Questions about the event? We're here to help.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info panel */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-dark-900 rounded-2xl p-7 text-white">
              <h2 className="font-bold text-lg mb-1">AllHealthTech Events</h2>
              <p className="text-white/50 text-sm mb-7">Organiser of India's premier health technology conference.</p>
              <div className="flex flex-col gap-5">
                {INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-white text-sm hover:text-brand-400 transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-white text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ice-50 border border-ice-200 rounded-2xl p-6">
              <p className="text-brand-700 font-semibold text-sm mb-1.5">Registration Queries</p>
              <p className="text-brand-600/80 text-xs leading-relaxed">
                For ticket-related questions, use the <strong>My Ticket</strong> page to look up your registration or contact us directly.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-card p-8">
            <h2 className="font-bold text-dark-900 text-xl mb-6">Send a Message</h2>

            {success && (
              <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3 text-emerald-700">
                <CheckIcon className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Message sent! We'll get back to you within 24 hours.</p>
              </div>
            )}
            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
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
                <label htmlFor="message" className="text-sm font-medium text-dark-700">
                  Message <span className="text-brand-600">*</span>
                </label>
                <textarea
                  id="message" name="message" value={form.message}
                  onChange={handleChange} required rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-dark-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 hover:border-brand-300 transition-all resize-none"
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
