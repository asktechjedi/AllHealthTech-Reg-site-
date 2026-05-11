const sponsors = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: `Sponsor ${i + 1}` }))

function SponsorCard({ name }) {
  return (
    <div className="group flex items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-card hover:shadow-elegant hover:border-brand-200 transition-all duration-200 aspect-[3/2]">
      {/* Placeholder logo mark */}
      <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-70 transition-opacity duration-200">
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1 11V5C1 3.9 1.8 3 2.9 3H5C6.1 3 7 3.9 7 5V7.5H1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 7.5V11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M10 3H17" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M13.5 3V11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M10 7.5H17" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-xs font-semibold text-gray-400 tracking-wide">{name}</span>
      </div>
    </div>
  )
}

export default function SponsorsSection() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Proudly Supported By</p>
          <h2 className="text-2xl font-bold text-dark-900">Our Sponsors &amp; Partners</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {sponsors.map((s) => (
            <SponsorCard key={s.id} name={s.name} />
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Interested in sponsoring?{' '}
          <a href="/contact" className="text-brand-600 font-semibold hover:underline">
            Get in touch
          </a>
        </p>
      </div>
    </section>
  )
}
