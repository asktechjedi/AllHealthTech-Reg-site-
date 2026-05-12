const sponsors = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: `Sponsor ${i + 1}` }))

function SponsorCard({ name }) {
  return (
    <div className="group flex items-center justify-center rounded-[var(--radius-xl)] border border-[var(--eventor-dark-700)] bg-[var(--eventor-dark-800)] p-6 shadow-[var(--shadow-eventor-md)] hover:shadow-[var(--shadow-eventor-blue)] hover:border-[var(--eventor-primary-light)] transition-all duration-[var(--transition-eventor-normal)] aspect-[3/2]">
      {/* Placeholder logo mark with Eventor styling */}
      <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity duration-[var(--transition-eventor-normal)]">
        <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--eventor-primary)] flex items-center justify-center shadow-[var(--shadow-eventor-sm)]">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1 11V5C1 3.9 1.8 3 2.9 3H5C6.1 3 7 3.9 7 5V7.5H1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 7.5V11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M10 3H17" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M13.5 3V11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M10 7.5H17" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-xs font-[var(--font-secondary)] font-semibold text-[var(--eventor-gray-100)] tracking-wide">{name}</span>
      </div>
    </div>
  )
}

export default function SponsorsSection() {
  return (
    <section className="bg-[var(--eventor-dark-900)] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with Eventor styling */}
        <div className="text-center mb-12">
          <p className="text-xs font-[var(--font-secondary)] font-bold uppercase tracking-widest text-[var(--eventor-primary-light)] mb-2">Proudly Supported By</p>
          <h2 className="text-2xl font-[var(--font-primary)] font-bold text-[var(--eventor-white)]">Our Sponsors &amp; Partners</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {sponsors.map((s) => (
            <SponsorCard key={s.id} name={s.name} />
          ))}
        </div>

        <p className="text-center text-[var(--eventor-gray-100)] font-[var(--font-secondary)] text-sm mt-8">
          Interested in sponsoring?{' '}
          <a href="/contact" className="text-[var(--eventor-primary-light)] font-semibold hover:underline transition-colors">
            Get in touch
          </a>
        </p>
      </div>
    </section>
  )
}
