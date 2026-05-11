import { BrainIcon, PillIcon, ShieldIcon, MicroscopeIcon, ChartIcon, NetworkIcon } from '../icons'

const tracks = [
  {
    icon: BrainIcon,
    title: 'AI & Diagnostics',
    description: 'Explore how machine learning and computer vision are transforming clinical decision-making and early disease detection.',
    tag: 'AI Track',
  },
  {
    icon: PillIcon,
    title: 'Digital Therapeutics',
    description: 'Evidence-based software interventions delivering clinical outcomes — from mental health apps to chronic disease management.',
    tag: 'DTx Track',
  },
  {
    icon: ShieldIcon,
    title: 'Health Data & Privacy',
    description: 'Navigating data governance, patient consent, and security in an era of interconnected health systems.',
    tag: 'Data Track',
  },
  {
    icon: MicroscopeIcon,
    title: 'MedTech Innovation',
    description: 'Wearables, point-of-care diagnostics, surgical robotics, and the devices redefining clinical practice.',
    tag: 'MedTech Track',
  },
  {
    icon: ChartIcon,
    title: 'Investment & Growth',
    description: 'Funding landscapes, startup ecosystems, and the business models driving sustainable health-tech ventures.',
    tag: 'Investment Track',
  },
  {
    icon: NetworkIcon,
    title: 'Interoperability',
    description: 'FHIR, HL7, and the standards enabling seamless data exchange across hospitals, labs, and payers.',
    tag: 'Standards Track',
  },
]

export default function HighlightsSection() {
  return (
    <section className="bg-ice-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-label">Conference Tracks</span>
          <h2 className="section-title">Six Tracks. One Vision.</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Deep-dive sessions curated by domain experts across the full spectrum of health technology.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map(({ icon: Icon, title, description, tag }) => (
            <div
              key={title}
              className="group bg-white rounded-2xl border border-gray-100 p-7 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-ice-100 flex items-center justify-center mb-5 group-hover:bg-brand-600 transition-colors duration-300">
                <Icon className="w-6 h-6 text-brand-600 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Content */}
              <h3 className="text-dark-900 font-bold text-base mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{description}</p>

              {/* Tag */}
              <span className="inline-block px-3 py-1 rounded-lg bg-ice-100 text-brand-600 text-xs font-bold uppercase tracking-wide">
                {tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
