import { Link } from 'react-router-dom'
import { ArrowRightIcon, MapPinIcon, CalendarIcon, BrainIcon, NetworkIcon, ChartIcon, TicketIcon } from '../components/icons'

const PILLARS = [
  {
    icon: CalendarIcon,
    title: 'Focused Agenda',
    desc: 'Every session is curated by a committee of clinicians, technologists, and policymakers to ensure maximum relevance and depth.',
  },
  {
    icon: NetworkIcon,
    title: 'High-Value Networking',
    desc: 'Structured networking sessions, roundtables, and a dedicated app to connect with the right people before, during, and after the event.',
  },
  {
    icon: TicketIcon,
    title: 'HealthTech Awards',
    desc: 'Recognising the most impactful innovations in Indian healthcare technology across 8 categories.',
  },
  {
    icon: ChartIcon,
    title: 'Startup Showcase',
    desc: '20 early-stage health-tech startups pitch to a panel of investors and industry leaders for funding and mentorship opportunities.',
  },
]

const TIMELINE = [
  { year: '2019', event: 'First AllHealthTech Conference, 120 attendees, Bangalore' },
  { year: '2020', event: 'Virtual edition during COVID-19, 800+ online participants' },
  { year: '2021', event: 'Hybrid format, first HealthTech Awards ceremony' },
  { year: '2022', event: 'Expanded to 2 days, 300+ in-person attendees, Delhi' },
  { year: '2023', event: 'Moved to Mumbai, 400+ attendees, 20 sponsors' },
  { year: '2025', event: '3-day flagship event, 500+ expected, Bombay Exhibition Centre' },
]

const EVENT_DAYS = [
  { day: 'Day 1', date: 'Wednesday, 15 October 2025', theme: 'AI & Diagnostics' },
  { day: 'Day 2', date: 'Thursday, 16 October 2025', theme: 'Digital Health & Policy' },
  { day: 'Day 3', date: 'Friday, 17 October 2025', theme: 'MedTech & Investment' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div
        className="bg-dark-900 py-24 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(34,0,255,0.18) 0%, transparent 70%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">About the Event</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 max-w-2xl leading-tight">
            India's Premier Health Technology Conference
          </h1>
          <p className="text-white/60 text-lg max-w-xl leading-relaxed mb-8">
            AllHealthTech brings together the brightest minds in healthcare and technology for three days of learning, collaboration, and inspiration.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 hover:shadow-brand transition-all duration-200"
            >
              Register Now
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/agenda"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/8 transition-all duration-200"
            >
              View Agenda
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-label">Our Mission</span>
            <h2 className="section-title mb-4">Accelerating the Future of Healthcare</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              AllHealthTech was founded on a simple belief: that the most transformative breakthroughs in healthcare happen at the intersection of clinical expertise and technological innovation.
            </p>
            <p className="text-gray-500 leading-relaxed">
              We create the conditions for those breakthroughs — by convening the right people, curating the right conversations, and building a community that persists long after the conference ends.
            </p>
          </div>

          {/* Pillar cards */}
          <div className="grid grid-cols-2 gap-4">
            {PILLARS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card hover:shadow-elegant transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-ice-100 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="font-bold text-dark-900 text-sm mb-1">{title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Venue */}
        <div
          className="bg-dark-900 rounded-2xl p-8 sm:p-12 text-white"
          style={{ backgroundImage: 'radial-gradient(ellipse 60% 80% at 100% 50%, rgba(34,0,255,0.12) 0%, transparent 60%)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">Venue</span>
              <h2 className="text-3xl font-black mb-4">Bombay Exhibition Centre</h2>
              <p className="text-white/60 leading-relaxed mb-5">
                One of India's largest and most modern exhibition venues, the BEC offers world-class facilities across 45,000 sq. metres of exhibition space in the heart of Mumbai.
              </p>
              <div className="flex flex-col gap-2.5 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  Goregaon East, Mumbai, Maharashtra 400063
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 flex-shrink-0 text-brand-400 text-center text-xs font-bold">M</span>
                  10 min from Goregaon Metro Station
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 flex-shrink-0 text-brand-400 text-center text-xs font-bold">A</span>
                  25 min from Chhatrapati Shivaji Maharaj International Airport
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-brand-400 mb-5 text-sm uppercase tracking-widest">Event Dates</h3>
              {EVENT_DAYS.map(({ day, date, theme }) => (
                <div key={day} className="flex items-start gap-4 py-3.5 border-b border-white/10 last:border-0">
                  <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-400 text-xs font-bold">{day}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{date}</p>
                    <p className="text-white/40 text-xs mt-0.5">{theme}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="text-center mb-12">
            <span className="section-label">Our Journey</span>
            <h2 className="section-title">Six Years of Impact</h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            {/* Center line */}
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gray-200 hidden sm:block" aria-hidden="true" />
            <div className="flex flex-col gap-6">
              {TIMELINE.map(({ year, event }, i) => (
                <div
                  key={year}
                  className={['flex items-center gap-6', i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'].join(' ')}
                >
                  <div className={['flex-1', i % 2 === 0 ? 'sm:text-right' : 'sm:text-left'].join(' ')}>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4 inline-block text-left">
                      <p className="text-brand-600 font-bold text-sm">{year}</p>
                      <p className="text-gray-600 text-sm mt-0.5">{event}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex w-4 h-4 rounded-full bg-brand-600 border-4 border-gray-50 flex-shrink-0 z-10" aria-hidden="true" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
