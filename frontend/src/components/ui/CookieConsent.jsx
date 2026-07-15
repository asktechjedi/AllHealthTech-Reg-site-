import { useState, useEffect } from 'react'
import { CONSENT_KEY, enableAnalytics } from '../../firebase.js'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    enableAnalytics()
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-mist)] bg-[var(--color-warm-white)] px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--text-secondary)]">
          We use cookies to understand how visitors use this site. No personal data is
          collected without your consent.{' '}
          <a
            href="/privacy-policy"
            className="font-medium text-[var(--color-blue-deep)] underline underline-offset-2 hover:text-[var(--color-navy)]"
          >
            Learn more
          </a>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={handleDecline}
            className="rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--color-blue-core)] hover:text-[var(--text-primary)]"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="rounded-[var(--radius-card)] bg-[var(--color-blue-core)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-navy)]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
