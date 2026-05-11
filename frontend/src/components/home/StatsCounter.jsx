import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 500, suffix: '+', label: 'Attendees' },
  { value: 30, suffix: '+', label: 'Speakers' },
  { value: 50, suffix: '+', label: 'Exhibitors' },
  { value: 3, suffix: '', label: 'Days' },
]

function useCountUp(target, duration = 1600, started = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, started])
  return count
}

function StatItem({ value, suffix, label, started, isLast }) {
  const count = useCountUp(value, 1400, started)
  return (
    <div className={['flex-1 flex flex-col items-center justify-center py-10 px-6 relative', !isLast ? 'after:absolute after:right-0 after:top-1/4 after:h-1/2 after:w-px after:bg-white/20 after:hidden sm:after:block' : ''].join(' ')}>
      <span className="text-5xl sm:text-6xl font-black text-white tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-white/60 text-sm font-medium mt-2 uppercase tracking-widest">{label}</span>
    </div>
  )
}

export default function StatsCounter() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-brand-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 divide-white/20">
          {stats.map((s, i) => (
            <StatItem key={s.label} {...s} started={started} isLast={i === stats.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
