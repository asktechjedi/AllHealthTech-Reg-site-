const POLICIES = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    updated: 'January 1, 2025',
    content: [
      'AllHealthTech Events ("we", "us") is committed to protecting your personal information. When you register, we collect your name, email, phone number, and organisation. This data is used solely to process your registration, send event communications, and improve future events.',
      'We do not sell or share your personal data with third parties for marketing. We may share limited information with our payment processor (Razorpay) and email provider strictly to facilitate transactions. All data transfers are encrypted using TLS.',
      'You may request access to, correction of, or deletion of your data at any time by emailing info@allhealthtech.com. We retain registration data for 3 years for compliance purposes.',
    ],
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    updated: 'January 1, 2025',
    content: [
      'By registering for AllHealthTech 2025, you agree to these Terms. Tickets are non-transferable and valid only for the registered attendee. Providing false registration information may result in cancellation without refund.',
      'Attendees must conduct themselves professionally. Harassment or disruptive behaviour will result in immediate removal without refund. AllHealthTech Events reserves the right to modify the schedule, speakers, or venue with reasonable notice.',
      'Our total liability shall not exceed the amount paid for your ticket. These terms are governed by the laws of India, with disputes subject to the exclusive jurisdiction of courts in Mumbai.',
    ],
  },
  {
    id: 'refund',
    title: 'Refund Policy',
    updated: 'January 1, 2025',
    content: [
      'Cancellations made more than 30 days before the event are eligible for a full refund minus a 5% processing fee. Cancellations 15–30 days before the event receive a 50% refund. No refunds are issued for cancellations within 15 days of the event.',
      'To cancel, use the My Ticket page or email info@allhealthtech.com with your Ticket ID. Approved refunds are processed to the original payment method within 7–10 business days.',
      'If AllHealthTech Events cancels or significantly reschedules the conference, all registered attendees will receive a full refund within 14 business days.',
    ],
  },
]

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div
        className="bg-dark-900 py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(34,0,255,0.15) 0%, transparent 70%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">Legal</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Policies</h1>
          <p className="text-white/60 text-lg">Please read our policies carefully before registering.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Anchor nav */}
        <div className="flex flex-wrap gap-2 mb-12">
          {POLICIES.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:border-brand-400 hover:text-brand-600 transition-all duration-150"
            >
              {p.title}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-14">
          {POLICIES.map(({ id, title, updated, content }) => (
            <section key={id} id={id} className="scroll-mt-24">
              <div className="flex items-start justify-between gap-4 mb-5">
                <h2 className="text-2xl font-bold text-dark-900">{title}</h2>
                <span className="text-xs text-gray-400 whitespace-nowrap mt-1.5">Updated: {updated}</span>
              </div>
              <div className="flex flex-col gap-4">
                {content.map((para, i) => (
                  <p key={i} className="text-gray-500 text-sm leading-relaxed">{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
