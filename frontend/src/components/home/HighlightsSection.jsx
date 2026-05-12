import { BrainIcon, PillIcon, ShieldIcon, MicroscopeIcon, ChartIcon, NetworkIcon } from '../icons'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

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

function TrackCard({ icon: Icon, title, description, tag, index }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const delays = ['', 'scroll-delay-100', 'scroll-delay-200', 'scroll-delay-100', 'scroll-delay-200', 'scroll-delay-300']
  
  return (
    <div
      ref={ref}
      className={`group relative bg-slate-800/50 rounded-2xl border-2 border-blue-500/30 p-7 shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 hover:border-blue-400/60 transition-all duration-300 cursor-default backdrop-blur-xl overflow-hidden scroll-fade-in ${delays[index]} ${isVisible ? 'visible' : ''}`}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon with gradient background */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-sky-500/20 border border-blue-400/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-blue-400/60 transition-all duration-300 shadow-lg shadow-blue-500/20">
          <Icon className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-lg mb-3 group-hover:text-blue-300 transition-colors">{title}</h3>
        
        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed mb-5">{description}</p>

        {/* Tag with strong contrast */}
        <span className="inline-block px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-sky-500 text-white text-xs font-bold uppercase tracking-wide shadow-lg shadow-blue-500/30">
          {tag}
        </span>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

export default function HighlightsSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 })
  
  return (
    <section className="bg-gradient-to-br from-[#F0F4FF] via-white to-[#F5F9FF] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className={`text-center mb-14 scroll-fade-in ${headerVisible ? 'visible' : ''}`}>
          <span className="text-xs font-[var(--font-secondary)] font-bold uppercase tracking-[0.1em] mb-3 text-blue-600 inline-block">Conference Tracks</span>
          <h2 className="text-4xl font-[var(--font-primary)] font-bold text-slate-900 leading-tight mb-4">Six Tracks. One Vision.</h2>
          <p className="text-slate-600 text-base leading-relaxed max-w-xl mx-auto font-[var(--font-secondary)]">
            Deep-dive sessions curated by domain experts across the full spectrum of health technology.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track, index) => (
            <TrackCard key={track.title} {...track} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
