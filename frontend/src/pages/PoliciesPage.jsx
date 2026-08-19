import PageHero from '../components/ui/PageHero'
import AnimatedSection from '../components/ui/AnimatedSection'

const AHT = (
  <a
    href="https://allhealthtech.com"
    target="_blank"
    rel="noopener noreferrer"
    className="underline decoration-dotted transition-colors hover:text-[var(--color-blue-core)]"
  >
    AllHealthTech
  </a>
)

const POLICIES = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    updated: 'January 1, 2026',
    content: [
      <>{AHT} Events (&quot;we&quot;, &quot;us&quot;) is committed to protecting your personal information. When you register, we collect your name, email, phone number, and organisation. This data is used solely to process your registration, send event communications, and improve future events.</>,
      'We do not sell or share your personal data with third parties for marketing. We may share limited information with our payment processor (Razorpay) and email provider strictly to facilitate transactions. All data transfers are encrypted using TLS.',
      'You may request access to, correction of, or deletion of your data at any time by emailing shankarram@allhealthtech.com. We retain registration data for 3 years for compliance purposes.',
    ],
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    updated: 'January 1, 2026',
    content: [
      'By registering for All Health X Tech Summit, you agree to these Terms. Tickets are non-transferable and valid only for the registered attendee. Providing false registration information may result in cancellation without refund.',
      <>Attendees must conduct themselves professionally. Harassment or disruptive behaviour will result in immediate removal without refund. {AHT} Events reserves the right to modify the schedule, speakers, or venue with reasonable notice.</>,
      'Our total liability shall not exceed the amount paid for your ticket. These terms are governed by the laws of India, with disputes subject to the exclusive jurisdiction of courts in Bangalore.',
    ],
  },
  {
    id: 'refund',
    title: 'No Refund Policy',
    updated: 'January 1, 2026',
    content: [
      'All ticket purchases for All Health X Tech Summit are final and non-refundable. Please review your details carefully before completing your registration.',
      'Tickets are non-transferable and valid only for the registered attendee. To request a correction to your registration details, email shankarram@allhealthtech.com with your Ticket ID.',
      <>If {AHT} Events cancels or significantly reschedules the conference, registered attendees will be notified of the available options by email.</>,
    ],
  },
]

const anchorInactive =
  'rounded-[var(--radius-pill)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all duration-300 hover:border-[var(--color-blue-core)] hover:text-[var(--color-blue-deep)]'

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-ice)]">
      <PageHero
        eyebrow="Legal"
        accentEyebrow
        title="Policies"
        subtitle="Please read our policies carefully before registering."
        compact
      />

      <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap gap-2">
          {POLICIES.map((p) => (
            <a key={p.id} href={`#${p.id}`} className={anchorInactive}>
              {p.title}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-14">
          {POLICIES.map(({ id, title, updated, content }, index) => (
            <AnimatedSection key={id} animation="fadeUp" duration={700} delay={index * 150}>
              <section id={id} className="scroll-mt-24">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <h2 className="font-[var(--font-display)] text-2xl font-normal text-[var(--text-primary)]">
                    {title}
                  </h2>
                  <span className="mt-1.5 whitespace-nowrap text-xs text-[var(--text-muted)]">
                    Updated: {updated}
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {content.map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  )
}
