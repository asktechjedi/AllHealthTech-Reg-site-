import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPinIcon, CalendarIcon, TicketIcon, ArrowRightIcon } from '../icons'
import heroImage from '../../assets/May 12, 2026, 10_28_12 AM.png'

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#F5F3FF]"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 800px 600px at 75% 30%, rgba(99,102,241,0.12) 0%, transparent 70%),
          radial-gradient(ellipse 600px 400px at 25% 70%, rgba(139,92,246,0.10) 0%, transparent 60%)
        `,
      }}
    >
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* Split Screen Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            {/* Animated badge with rich styling */}
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 mb-8 w-fit">
              {/* <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#2563EB] bg-[rgba(37,99,235,0.12)] text-[#1D4ED8] text-sm font-[var(--font-secondary)] font-semibold backdrop-blur-sm shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-eventor-pulse flex-shrink-0" />
                October 15–17, 2025 · Mumbai
              </span> */}
            </motion.div>

            {/* Headline with rich typography */}
            <motion.h1
              {...fadeUp(0.08)}
              className="text-5xl sm:text-6xl lg:text-7xl font-[var(--font-primary)] font-black text-[#0F172A] leading-[1.05] tracking-tight mb-6"
            >
              Where Health Meets
              <br />
              <span className="text-[#2563EB]">Technology</span>
            </motion.h1>

            {/* Subtext with enhanced contrast */}
            <motion.p
              {...fadeUp(0.16)}
              className="text-lg sm:text-xl text-[#334155] opacity-95 max-w-2xl leading-relaxed mb-10 font-[var(--font-secondary)]"
            >
              India's premier health technology conference — three days of keynotes, workshops, and connections that shape the future of healthcare.
            </motion.p>

            {/* CTAs with rich blue gradient */}
            <motion.div {...fadeUp(0.24)} className="flex flex-col sm:flex-row items-start gap-4 mb-16">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-[var(--radius-lg)] bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-[var(--font-secondary)] font-bold text-base hover:from-[#1D4ED8] hover:to-[#2563EB] hover:shadow-xl transition-all duration-[var(--transition-eventor-normal)] hover:-translate-y-0.5 shadow-lg"
              >
                Secure Your Seat
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/agenda"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-[var(--radius-lg)] border-2 border-[#2563EB] text-[#2563EB] font-[var(--font-secondary)] font-semibold text-base hover:bg-[rgba(37,99,235,0.1)] hover:border-[#1D4ED8] transition-all duration-[var(--transition-eventor-normal)]"
              >
                View Programme
              </Link>
            </motion.div>

            {/* Meta items with rich blue icons */}
            <motion.div
              {...fadeUp(0.32)}
              className="flex flex-col gap-3"
            >
              {metaItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-[#475569] text-sm font-[var(--font-secondary)] font-medium">
                  <Icon className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Image - Healthcare Tech Visual */}
          <motion.div
            {...fadeUp(0.16)}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-md">
              {/* Glowing background effect */}
              <div className="absolute inset-0 rounded-3xl " aria-hidden="true" />
              
              {/* Image container with gradient border */}
              <div className="relative left-[110px] transform scale-150">
                <img
                  src={heroImage}
                  alt="Healthcare Technology"
                  className="w-full h-auto rounded-2xl object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade with rich gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(238,242,255,0.5))' }}
        aria-hidden="true"
      />
    </section>
  )
}
