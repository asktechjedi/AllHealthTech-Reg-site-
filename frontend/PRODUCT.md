# Product

## Register

brand

## Users

Hospital executives, clinicians, healthtech founders, VCs/investors, and sponsors deciding whether
the All Health X Tech Summit is worth their limited time. They're evaluating credibility and
program quality quickly — often skimming on mobile between meetings — before committing to
register or sponsor.

## Product Purpose

An invite-feeling registration and information site for the All Health X Tech Summit (a one-day
healthcare/healthtech conference in Bangalore). It exists to convert visits into registrations and
sponsorships by making the agenda, speaker lineup, and event credibility instantly legible. Success
looks like a visitor understanding "is this the room I want to be in" within seconds, then
registering.

## Brand Personality

Premium, authoritative, quietly confident — "Frost & Navy": a deep navy/blue editorial base
(DM Serif Display headings, DM Sans body) with magenta/violet used sparingly as an energetic accent,
not a dominant color. The footer states it directly: "A curated, closed-room gathering for the
people building healthcare's future." Exclusive and considered, not loud or gamified.

## Anti-references

Not a playful, gamified conference-app look (bright rounded badges, cartoonish icons, Eventbrite/
Meetup-style scheduling grids). Not a generic flat SaaS dashboard either (identical icon+heading+text
card grids). This is closer to an editorial summit program than a tool.

## Design Principles

- Confident restraint: motion and color should feel premium and intentional, never flashy or
  gamified — earn attention through craft, not volume.
- Scannability under time pressure: a hospital exec skimming on a phone between meetings should
  grasp what/when/who in under a second per session.
- One accent, used deliberately: magenta/violet marks the few moments that matter (live, featured,
  active state) rather than decorating everything.
- Consistency with the existing Frost & Navy system: reuse established tokens, transitions, and
  card/gradient conventions rather than introducing a parallel visual language.

## Accessibility & Inclusion

WCAG AA minimum (already reflected in existing focus-ring and contrast tokens). Respect
`prefers-reduced-motion` for every new animation (the codebase already has a global reduced-motion
override — new component-level motion must honor it too, not just rely on the global rule).
