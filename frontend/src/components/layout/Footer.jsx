import { NavLink } from 'react-router-dom'
import { TwitterIcon, LinkedInIcon, InstagramIcon } from '../icons'

const links = {
  Event: [
    { to: '/about', label: 'About' },
    { to: '/agenda', label: 'Agenda' },
    { to: '/speakers', label: 'Speakers' },
    { to: '/pricing', label: 'Pricing' },
  ],
  Attendees: [
    { to: '/register', label: 'Register' },
    { to: '/check-registration', label: 'My Ticket' },
    { to: '/contact', label: 'Contact' },
    { to: '/policies', label: 'Policies' },
  ],
}

const socials = [
  { icon: TwitterIcon, href: '#', label: 'Twitter / X' },
  { icon: LinkedInIcon, href: '#', label: 'LinkedIn' },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
]

function FooterLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-brand flex-shrink-0">
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M1.5 12.5V5.5C1.5 4.1 2.4 3.2 3.8 3.2H6.2C7.6 3.2 8.5 4.1 8.5 5.5V8.5H1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 8.5V12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M11.5 3.2H18.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M15 3.2V12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M11.5 8.5H18.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-white font-black text-[15px] tracking-tight">AllHealthTech</span>
        <span className="text-brand-400 text-[10px] font-bold uppercase tracking-widest">Conference 2025</span>
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-2">
            <FooterLogo />
            <p className="text-sm leading-relaxed max-w-xs mt-4">
              India's premier health technology conference. Three days of innovation, insights, and connections shaping the future of healthcare.
            </p>
            <div className="flex gap-2 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-white/50 hover:bg-brand-600 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{group}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className="text-sm hover:text-brand-400 transition-colors duration-150"
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} AllHealthTech Events. All rights reserved.</p>
          <div className="flex gap-5">
            <NavLink to="/policies" className="hover:text-brand-400 transition-colors duration-150">
              Privacy Policy
            </NavLink>
            <NavLink to="/policies" className="hover:text-brand-400 transition-colors duration-150">
              Terms of Service
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
