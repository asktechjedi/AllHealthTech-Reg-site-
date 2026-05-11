import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPinIcon, CalendarIcon, TicketIcon, ArrowRightIcon } from '../icons'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut', delay },
})

const metaItems = [
  { icon: MapPinIcon, label: 'Bombay Exhibition Centre, Mumbai' },
  { icon: CalendarIcon, label: 'October 15–17, 2025' },
  { icon: TicketIcon, label: '500+ Attendees Expected' },
]

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-dark-900"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,0,255,0.18) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 80% 80%, rgba(34,0,255,0.08) 0%, transparent 60%)
        `,
      }}
    >
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
        {/* Badge */}
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-white/70 text-sm font-medium backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse-slow flex-shrink-0" />
            October 15–17, 2025 · Mumbai
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.08)}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
        >
          Where Health Meets
          <br />
          <span className="text-brand-400">Technology</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          {...fadeUp(0.16)}
          className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          India's premier health technology conference — three days of keynotes, workshops, and connections that shape the future of healthcare.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.24)} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-600 text-white font-bold text-base hover:bg-brand-700 hover:shadow-brand transition-all duration-200 hover:-translate-y-0.5"
          >
            Secure Your Seat
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <Link
            to="/agenda"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-base hover:bg-white/8 hover:border-white/30 transition-all duration-200"
          >
            View Programme
          </Link>
        </motion.div>

        {/* Meta items */}
        <motion.div
          {...fadeUp(0.32)}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10"
        >
          {metaItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-white/50 text-sm">
              <Icon className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,10,20,0.6))' }}
        aria-hidden="true"
      />
    </section>
  )
}
