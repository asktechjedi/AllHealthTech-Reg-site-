import { Link } from 'react-router-dom'
import { linkBtn } from '../ui/buttonClasses'
import { ArrowRightIcon } from '../icons'

export default function SponsorsSection() {
  return (
    <section className="bg-[var(--color-ice)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              About{' '}
              <a
                href="https://allhealthtech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted transition-colors hover:opacity-80"
              >
                AHT
              </a>
            </p>
            <h2 className="font-[var(--font-display)] text-[clamp(2rem,5vw,5rem)] font-normal leading-[0.98] text-[var(--text-primary)]">
              We do not just report on the ecosystem. We bring it together.
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-[1.65] text-[var(--text-secondary)]">
            <p>
              All Health Tech is a platform focused on healthtech insights, trends, and stories
              shaping the future of healthcare.
            </p>
            <p>
              All Health X Tech Summit extends that mission by bringing startups, hospitals, capital,
              policy, and research into one focused room.
            </p>
            <p className="font-semibold text-[var(--text-primary)]">
              In partnership with HealthTech Alpha, a global healthtech intelligence platform.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[linear-gradient(145deg,rgba(255,254,249,1)_0%,rgba(237,244,255,0.92)_100%)] p-8 shadow-[var(--shadow-card)] sm:p-10">
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[rgba(30,123,255,0.08)] blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-[rgba(0,14,122,0.08)] blur-3xl"
            />

            <div className="relative z-[1]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Partners & Sponsors
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-[var(--radius-pill)] border border-[rgba(0,14,122,0.08)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-blue-deep)]">
                  Partnership opportunities
                </span>
                <span className="text-sm text-[var(--text-muted)]">Sponsors and ecosystem partners announced soon.</span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-[rgba(0,14,122,0.08)] bg-[rgba(255,255,255,0.82)] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-blue-deep)]">
                    Visibility
                  </p>
                  <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
                    Show up in front of high-intent founders, operators, hospital leaders, and investors.
                  </p>
                </div>
                <div className="rounded-[24px] border border-[rgba(0,14,122,0.08)] bg-[rgba(255,255,255,0.72)] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-blue-deep)]">
                    Relevance
                  </p>
                  <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
                    Align your brand with practical conversations around healthcare transformation.
                  </p>
                </div>
                <div className="rounded-[24px] border border-[rgba(0,14,122,0.08)] bg-[rgba(255,255,255,0.62)] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-blue-deep)]">
                    Access
                  </p>
                  <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
                    Build stronger relationships with the people actively shaping the ecosystem.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-[28px] border border-[rgba(0,14,122,0.08)] bg-[rgba(255,255,255,0.72)] p-7 shadow-[0_16px_40px_rgba(0,14,122,0.08)] backdrop-blur-sm sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-blue-deep)]">
                  Built for aligned partners
                </p>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
                  We are shaping a focused partner ecosystem around the event, with room for sponsors,
                  strategic collaborators, and organisations that want to support sharper healthtech
                  dialogue.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[var(--radius-card)] border border-[rgba(250,243,255,0.12)] bg-[var(--color-navy)] shadow-[0_22px_48px_rgba(0,7,74,0.18)]">
            <div className="border-b border-[rgba(250,243,255,0.12)] p-8 sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-bridge)]">
                Partner with us
              </p>
              <h3 className="mt-4 font-[var(--font-display)] text-4xl font-normal leading-tight text-[var(--text-on-dark)]">
                Make your brand part of the room, not just the backdrop.
              </h3>
              <p className="mt-5 text-base leading-7 text-[var(--color-frost)]">
                We are looking for aligned sponsors and ecosystem partners who want to back sharper conversations and stronger connections in healthtech.
              </p>
            </div>

            <div className="grid gap-px bg-[rgba(250,243,255,0.12)] sm:grid-cols-2">
              <div className="bg-[rgba(0,25,196,0.22)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-bridge)]">
                  Audience
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--text-on-dark)]">
                  Founders, operators, investors, hospitals, policy leaders, and researchers.
                </p>
              </div>
              <div className="bg-[rgba(0,25,196,0.16)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-bridge)]">
                  Intent
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--text-on-dark)]">
                  Partnership conversations designed around relevance, visibility, and ecosystem fit.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <p className="text-sm leading-6 text-[var(--color-frost)]">
                Interested in partnering with us?
              </p>
              <Link to="/contact" className={`${linkBtn.primary} gap-2`}>
                Become a Partner
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-cta-band relative mt-16 overflow-hidden rounded-[var(--radius-card)] lg:grid lg:grid-cols-[1fr_auto]">
          <div className="cta-band-orbs" aria-hidden="true">
            <span className="cta-orb cta-orb--bridge" />
            <span className="cta-orb cta-orb--deep" />
            <span className="cta-orb cta-orb--core" />
          </div>
          <div className="relative z-[1] p-8 sm:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-frost)]">
              Final CTA
            </p>
            <h3 className="mt-4 max-w-3xl font-[var(--font-display)] text-4xl font-normal leading-tight text-[var(--text-on-dark)] sm:text-5xl">
              Join the room where healthtech conversations actually happen.
            </h3>
            <p className="mt-5 text-lg text-[var(--color-frost)]">
              Limited seats. Curated participation.
            </p>
          </div>
          <div className="relative z-[1] flex flex-col justify-center gap-3 border-t border-[rgba(250,243,255,0.2)] p-8 sm:flex-row lg:min-w-[330px] lg:flex-col lg:border-l lg:border-t-0">
            <Link to="/register" className={`${linkBtn.primary} gap-2`}>
              Register to Attend
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link to="/contact" className={linkBtn.ghostOnDark}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
