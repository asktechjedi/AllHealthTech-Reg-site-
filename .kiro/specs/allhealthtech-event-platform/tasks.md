# Implementation Plan: AllHealthTech Event Platform

## Overview

Implement the full-stack AllHealthTech Event Platform as a React (Vite) + TypeScript SPA frontend with a Node.js + Express backend, PostgreSQL via Prisma ORM, Razorpay payment integration, and transactional email. Tasks are ordered to build foundational layers first, then features, then wire everything together.

## Tasks

- [x] 1. Initialize project structure and tooling
  - Scaffold a monorepo with `frontend/` (Vite + React + TypeScript) and `backend/` (Node.js + Express + TypeScript) directories
  - Configure `tsconfig.json`, ESLint, and Prettier for both packages
  - Add Tailwind CSS and Framer Motion to the frontend
  - Add Zustand and React Router to the frontend
  - Add Express, Prisma, Zod, express-rate-limit, and Nodemailer to the backend
  - Create `.env.example` files for both packages documenting all required environment variables
  - _Requirements: 20.1, 20.5_

- [x] 2. Set up database schema and seed data
  - [x] 2.1 Write Prisma schema with all models (Event, TicketType, Registration, Speaker, AgendaItem) and enums (PaymentStatus, RegistrationStatus, RefundStatus)
    - Include all indexes and unique constraints defined in the design
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.6, 16.7_
  - [x] 2.2 Create initial Prisma migration for schema setup
    - _Requirements: 20.2_
  - [x] 2.3 Write `prisma/seed.ts` to populate event info, ticket types, speakers, and agenda items
    - _Requirements: 20.3_

- [x] 3. Implement backend core infrastructure
  - [x] 3.1 Create Express app entry point with middleware stack (JSON body parser, CORS, rate limiter, global error handler)
    - _Requirements: 18.3, 19.5_
  - [x] 3.2 Implement Zod validation middleware (`src/middleware/validate.ts`) that validates request body/query against a schema and returns structured 400 errors
    - _Requirements: 18.1, 18.2, 17.10, 17.11_
  - [x] 3.3 Implement global error handler middleware (`src/middleware/errorHandler.ts`) that logs errors with timestamps and returns structured JSON error responses
    - _Requirements: 19.5, 19.6_
  - [x] 3.4 Implement rate limiting configuration (`src/middleware/rateLimit.ts`) for registration and payment endpoints
    - _Requirements: 18.3_

- [x] 4. Implement backend read-only API routes
  - [x] 4.1 Implement `GET /api/events/current` route returning current event details
    - _Requirements: 17.6_
  - [x] 4.2 Implement `GET /api/speakers` route returning all speakers ordered by `displayOrder`
    - _Requirements: 17.7_
  - [x] 4.3 Implement `GET /api/agenda` route returning all agenda items ordered by `startTime`, with optional `track` query filter
    - _Requirements: 17.8, 3.3_

- [x] 5. Implement ticket service and registration creation
  - [x] 5.1 Implement `ticketService.ts` with Ticket_ID generation in `AHT-YYYY-NNNNN` format using an atomic database counter
    - _Requirements: 8.1_
  - [x] 5.2 Implement `POST /api/registrations` route: validate request, check ticket capacity, create a PENDING registration with generated Ticket_ID, and return `registrationId` + `ticketId`
    - _Requirements: 17.1, 6.2, 6.3, 6.4, 6.5, 8.2_

- [x] 6. Implement payment service and routes
  - [x] 6.1 Implement `paymentService.ts` with `createOrder(amount, currency, receiptId)` using the Razorpay Node SDK, reading API keys from environment variables
    - _Requirements: 7.1, 18.7, 20.7_
  - [x] 6.2 Implement `POST /api/payments/initiate` route: create a Razorpay order for the pending registration and return `razorpayOrderId`, `amount`, `currency`, and `keyId`
    - _Requirements: 17.2_
  - [x] 6.3 Implement HMAC signature verification in `paymentService.ts`
    - _Requirements: 18.4_
  - [x] 6.4 Implement `POST /api/payments/verify` route: verify Razorpay signature, update registration status to CONFIRMED and paymentStatus to PAID, then trigger confirmation email asynchronously
    - _Requirements: 17.3, 7.3, 8.2_

- [x] 7. Implement registration lookup and cancellation routes
  - [x] 7.1 Implement `GET /api/registrations/lookup?email=&ticketId=` route using the composite index; return 404 with descriptive message when not found
    - _Requirements: 17.4, 9.2, 9.3, 9.4, 9.5_
  - [x] 7.2 Implement `POST /api/registrations/:id/cancel` route: verify ownership via email + ticketId, update status to CANCELLED, initiate Razorpay refund, and update refund fields
    - _Requirements: 17.5, 10.3, 10.4_

- [x] 8. Implement email service
  - [x] 8.1 Implement `emailService.ts` with `sendConfirmationEmail(registration)` using Nodemailer, including Ticket_ID, event name, date, location, ticket type, and attendee name
    - _Requirements: 8.4, 8.5_
  - [x] 8.2 Implement `sendCancellationEmail(registration)` in `emailService.ts` including refund details
    - _Requirements: 10.6_
  - [x] 8.3 Wire cancellation email into the cancel route (async, non-blocking)
    - _Requirements: 10.6_

- [x] 9. Implement contact form route
  - Implement `POST /api/contact` route: validate fields (name, email, subject, message), send email to organizer address via `emailService.ts`, return success response
  - _Requirements: 17.9, 14.3_

- [x] 10. Checkpoint — Backend complete
  - Ensure all backend routes return correct HTTP status codes, all Zod schemas reject invalid input, and the Prisma client connects successfully. Ask the user if questions arise.

- [x] 11. Implement frontend shared components and layout
  - [x] 11.1 Implement shared UI components: `Button`, `Input`, `Card`, `Badge`, `LoadingSpinner`, `ErrorMessage`
    - Apply Tailwind CSS with blue/green gradient theme and soft shadows
    - _Requirements: 11.1, 11.2, 11.5, 11.6_
  - [x] 11.2 Implement `Navbar` with links to all pages, active-link highlighting, and hamburger menu for mobile
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 11.3 Implement `Footer` with navigation links and a link to the Policies page
    - _Requirements: 15.3_
  - [x] 11.4 Implement `Layout` wrapper composing `Navbar` and `Footer`, and configure React Router with all routes and lazy-loaded page components
    - _Requirements: 12.4_

- [x] 12. Implement Zustand stores
  - Implement `registrationStore` with `currentStep`, `selectedTicket`, `attendeeDetails`, `confirmedTicketId`, `clearPaymentData`, and `reset` actions
  - Implement `uiStore` with `mobileMenuOpen` and `toggleMobileMenu`
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 13. Implement HomePage
  - [x] 13.1 Implement `HeroSection` with event name, date, location, and CTA button; add Framer Motion entrance animation
    - _Requirements: 1.1, 11.3, 11.4_
  - [x] 13.2 Implement `StatsCounter` with animated number counters for participant, speaker, and exhibitor counts
    - _Requirements: 1.2_
  - [x] 13.3 Implement `HighlightsSection` with card-based layout
    - _Requirements: 1.3_
  - [x] 13.4 Implement `FeaturedSpeakers` preview section fetching from `GET /api/speakers` and showing featured speakers
    - _Requirements: 1.4_
  - [x] 13.5 Implement `AgendaPreview` section fetching from `GET /api/agenda` and showing key sessions
    - _Requirements: 1.5_
  - [x] 13.6 Implement `SponsorsSection` with sponsor logo grid
    - _Requirements: 1.6_

- [x] 14. Implement content pages
  - [x] 14.1 Implement `AgendaPage` fetching from `GET /api/agenda`, displaying items in chronological order with track filter UI
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 14.2 Implement `SpeakersPage` with `SpeakerCard` grid fetching from `GET /api/speakers` and a `SpeakerModal` for expanded profiles
    - _Requirements: 4.1, 4.2, 4.3_
  - [x] 14.3 Implement `PricingPage` with `TicketCard` components fetching ticket types from `GET /api/events/current`, showing features, sold-out state, and CTA buttons
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [x] 14.4 Implement `ContactPage` with organizer info and `ContactForm` that posts to `POST /api/contact` and shows success/error feedback
    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  - [x] 14.5 Implement `PoliciesPage` with Privacy Policy, Terms of Service, and Refund Policy sections including last-updated dates
    - _Requirements: 15.1, 15.2, 15.4_

- [x] 15. Implement multi-step registration flow
  - [x] 15.1 Implement `StepIndicator` component showing current step progress
    - _Requirements: 6.1_
  - [x] 15.2 Implement `TicketSelectionStep` reading available ticket types and writing selection to `registrationStore`
    - _Requirements: 6.1, 13.3_
  - [x] 15.3 Implement `AttendeeDetailsStep` with form fields (name, email, phone, organization, role), inline validation for required fields, email format, and phone format
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6_
  - [x] 15.4 Implement `ReviewStep` displaying a summary of selected ticket and attendee details with a back button
    - _Requirements: 6.7_
  - [x] 15.5 Implement `PaymentStep`: call `POST /api/registrations` then `POST /api/payments/initiate`, open Razorpay checkout SDK, on success call `POST /api/payments/verify`, on failure show error with retry option; display secure payment badge
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  - [x] 15.6 Implement `SuccessStep` displaying Ticket_ID, event details, and attendee info; call `clearPaymentData()` on mount
    - _Requirements: 8.3, 13.4_

- [x] 16. Implement Check Registration page
  - Implement `CheckRegistrationPage` with `LookupForm` (email + Ticket_ID inputs) that calls `GET /api/registrations/lookup`, displays `RegistrationDetails` on success, shows error message on failure, and includes a cancellation option that calls `POST /api/registrations/:id/cancel` with confirmation dialog showing refund policy
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.1, 10.2, 10.3, 10.5_

- [x] 17. Implement error handling and performance optimizations
  - [x] 17.1 Add global error boundary and network error handling in the frontend API client (axios/fetch wrapper) with user-friendly messages and retry options
    - _Requirements: 19.1, 19.2, 19.3, 19.4_
  - [x] 17.2 Implement lazy loading for all page components via `React.lazy` and `Suspense`
    - _Requirements: 12.4_
  - [x] 17.3 Add `loading="lazy"` to all `<img>` tags and use responsive image sizes
    - _Requirements: 12.5_
  - [x] 17.4 Ensure all Framer Motion animations use durations between 200ms and 500ms
    - _Requirements: 11.3, 11.4_

- [x] 18. Implement responsive design across all pages
  - Audit and fix all pages for mobile, tablet, and desktop breakpoints using Tailwind responsive prefixes; verify hamburger menu works on mobile
  - _Requirements: 1.7, 2.4_

- [x] 19. Final checkpoint — Full integration
  - Verify the end-to-end registration flow (form → payment → confirmation email), lookup flow, and cancellation flow work correctly. Ensure all API endpoints return correct status codes and the frontend displays appropriate error states. Ask the user if questions arise.

## Notes

- Sub-tasks marked with `*` are optional and can be skipped for a faster MVP (none in this plan as no property-based tests apply)
- Each task references specific requirements for traceability
- Checkpoints (tasks 10 and 19) ensure incremental validation before proceeding
- The design has no Correctness Properties section, so property-based tests are not included; use unit and integration tests as needed
