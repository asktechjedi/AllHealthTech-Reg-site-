import { NavLink } from 'react-router-dom'
import useUIStore from '../../stores/uiStore'
import { MenuIcon, XIcon } from '../icons'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/agenda', label: 'Agenda' },
  { to: '/speakers', label: 'Speakers' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
  { to: '/check-registration', label: 'My Ticket' },
]

function LogoMark() {
  return (
    <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-brand flex-shrink-0">
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M1.5 12.5V5.5C1.5 4.1 2.4 3.2 3.8 3.2H6.2C7.6 3.2 8.5 4.1 8.5 5.5V8.5H1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.5 8.5V12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M11.5 3.2H18.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M15 3.2V12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M11.5 8.5H18.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

export default function Navbar() {
  const { mobileMenuOpen, toggleMobileMenu } = useUIStore()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0" onClick={() => mobileMenuOpen && toggleMobileMenu()}>
          <LogoMark />
          <div className="flex flex-col leading-none">
            <span className="text-dark-900 font-black text-[15px] tracking-tight">AllHealthTech</span>
            <span className="text-brand-600 text-[10px] font-bold uppercase tracking-widest">2025</span>
          </div>
        </NavLink>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => [
                  'relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'text-brand-600'
                    : 'text-gray-600 hover:text-brand-600 hover:bg-ice-50',
                ].join(' ')}
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-600" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <NavLink
            to="/register"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-all duration-150 hover:shadow-brand"
          >
            Register Now
          </NavLink>
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-ice-50 transition-colors"
          >
            {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <div
        className={[
          'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="bg-white border-t border-gray-100 px-4 pb-5 pt-3">
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={toggleMobileMenu}
                  className={({ isActive }) => [
                    'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'text-brand-600 bg-ice-50 font-semibold'
                      : 'text-gray-600 hover:text-brand-600 hover:bg-ice-50',
                  ].join(' ')}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2">
              <NavLink
                to="/register"
                onClick={toggleMobileMenu}
                className="block px-4 py-3 rounded-xl bg-brand-600 text-white text-sm font-semibold text-center hover:bg-brand-700 transition-colors"
              >
                Register Now
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
