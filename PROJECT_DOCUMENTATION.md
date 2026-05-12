# AllHealthTech Event Platform - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [State Management](#state-management)
9. [Environment Configuration](#environment-configuration)
10. [Development Workflow](#development-workflow)
11. [Current Status & Ongoing Work](#current-status--ongoing-work)
12. [Deployment](#deployment)

---

## Project Overview

**AllHealthTech Event Platform** is a comprehensive web application for managing healthcare technology conferences. The platform enables event organizers to showcase event details, manage speakers and agendas, and handle attendee registrations.

### Key Features
- **Event Information Display**: Homepage with event highlights, featured speakers, and statistics
- **Speaker Profiles**: Detailed speaker information with photos and social links
- **Agenda Management**: Schedule display with tracks, sessions, and speaker assignments
- **Registration System**: Multi-step registration flow (currently being simplified)
- **Payment Integration**: Razorpay payment gateway integration (being removed)
- **Email Notifications**: Automated confirmation emails via Nodemailer
- **Registration Lookup**: Attendees can check their registration status
- **Contact Form**: Direct communication with event organizers

### Event Details
- **Event Name**: AllHealthTech 2025
- **Date**: October 15-17, 2025
- **Location**: Bombay Exhibition Centre, Mumbai
- **Target Audience**: Healthcare technology professionals, innovators, and industry leaders

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React SPA (Vite)                                      │ │
│  │  - React Router for navigation                         │ │
│  │  - Zustand for state management                        │ │
│  │  - Tailwind CSS for styling                            │ │
│  │  - Framer Motion for animations                        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Application Layer                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express.js API Server                                 │ │
│  │  - RESTful API endpoints                               │ │
│  │  - Zod validation middleware                           │ │
│  │  - Rate limiting                                       │ │
│  │  - CORS configuration                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Prisma ORM
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Data Layer                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL Database                                   │ │
│  │  - Events, Speakers, Agenda                            │ │
│  │  - Registrations, Ticket Types                         │ │
│  │  - Payment records                                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ External Services
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Razorpay        │  │  SMTP Server     │                │
│  │  (Payments)      │  │  (Emails)        │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Monorepo Structure
The project uses **npm workspaces** to manage a monorepo with two main packages:
- **frontend**: React application
- **backend**: Express.js API server

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **Vite** | 5.3.1 | Build tool and dev server |
| **React Router** | 6.23.1 | Client-side routing |
| **Zustand** | 4.5.2 | State management |
| **Tailwind CSS** | 3.4.4 | Utility-first CSS framework |
| **Framer Motion** | 11.0.0 | Animation library |
| **ESLint** | 8.57.0 | Code linting |
| **Prettier** | 3.3.2 | Code formatting |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | >=18.0.0 | Runtime environment |
| **Express.js** | 4.19.2 | Web framework |
| **Prisma** | 5.15.0 | ORM and database toolkit |
| **PostgreSQL** | - | Relational database |
| **Zod** | 3.23.8 | Schema validation |
| **Nodemailer** | 6.9.13 | Email sending |
| **Razorpay SDK** | - | Payment processing (being removed) |
| **express-rate-limit** | 7.3.1 | API rate limiting |
| **Vitest** | 1.6.1 | Testing framework |

---

## Project Structure

```
allhealthtech-event-platform/
├── .kiro/                          # Kiro AI specs and configuration
│   ├── specs/
│   │   ├── allhealthtech-event-platform/
│   │   │   ├── requirements.md
│   │   │   ├── design.md
│   │   │   └── tasks.md
│   │   └── registration-form-rebuild/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       ├── tasks.md
│   │       └── .config.kiro
│   └── steering/
│
├── frontend/                       # React frontend application
│   ├── dist/                       # Production build output
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/              # Homepage components
│   │   │   │   ├── AgendaPreview.jsx
│   │   │   │   ├── FeaturedSpeakers.jsx
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── HighlightsSection.jsx
│   │   │   │   ├── SponsorsSection.jsx
│   │   │   │   └── StatsCounter.jsx
│   │   │   ├── icons/             # Icon components
│   │   │   │   └── index.jsx
│   │   │   ├── layout/            # Layout components
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Layout.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   ├── registration/      # Registration flow components
│   │   │   │   ├── AttendeeDetailsStep.jsx
│   │   │   │   └── SuccessStep.jsx
│   │   │   │   # REMOVED: TicketSelectionStep.jsx
│   │   │   │   # REMOVED: PaymentStep.jsx
│   │   │   │   # REMOVED: ReviewStep.jsx
│   │   │   │   # REMOVED: StepIndicator.jsx
│   │   │   ├── ui/                # Reusable UI components
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── ErrorMessage.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   └── LoadingSpinner.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── lib/
│   │   │   └── api.js             # API client utilities
│   │   ├── pages/
│   │   │   ├── AboutPage.jsx
│   │   │   ├── AgendaPage.jsx
│   │   │   ├── CheckRegistrationPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── PoliciesPage.jsx
│   │   │   ├── RegistrationPage.jsx
│   │   │   └── SpeakersPage.jsx
│   │   │   # REMOVED: PricingPage.jsx
│   │   ├── stores/
│   │   │   ├── registrationStore.js
│   │   │   └── uiStore.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                        # Express.js backend API
│   ├── node_modules/
│   ├── prisma/
│   │   ├── migrations/
│   │   │   ├── 20240101000000_init/
│   │   │   │   └── migration.sql
│   │   │   └── migration_lock.toml
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.js                # Database seeding script
│   ├── src/
│   │   ├── lib/
│   │   │   └── prisma.js          # Prisma client instance
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── errorHandler.test.js
│   │   │   ├── rateLimit.js
│   │   │   ├── validate.js
│   │   │   └── validate.test.js
│   │   ├── routes/
│   │   │   ├── agenda.js
│   │   │   ├── contact.js
│   │   │   ├── events.js
│   │   │   ├── payments.js        # TO BE REMOVED
│   │   │   ├── registrations.js
│   │   │   └── speakers.js
│   │   ├── services/
│   │   │   ├── emailService.js
│   │   │   ├── paymentService.js  # TO BE MODIFIED
│   │   │   └── ticketService.js
│   │   └── index.js               # Main application entry
│   ├── .env
│   ├── .env.example
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   └── package.json
│
├── node_modules/                   # Root workspace dependencies
├── .gitignore
├── package.json                    # Root workspace configuration
├── package-lock.json
└── PROJECT_DOCUMENTATION.md        # This file
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│   Event     │
│─────────────│
│ id (PK)     │
│ name        │
│ date        │
│ endDate     │
│ location    │
│ venue       │
│ description │
│ bannerUrl   │
│ createdAt   │
│ updatedAt   │
└─────────────┘
       │
       │ 1:N
       ├──────────────────────────────────┐
       │                                   │
       ▼                                   ▼
┌─────────────┐                    ┌─────────────┐
│ TicketType  │                    │ Registration│
│─────────────│                    │─────────────│
│ id (PK)     │                    │ id (PK)     │
│ eventId (FK)│◄───────────────────│ eventId (FK)│
│ name        │                    │ ticketTypeId│
│ price       │                    │ ticketId    │
│ currency    │                    │ attendeeName│
│ description │                    │ attendeeEmail│
│ features[]  │                    │ attendeePhone│
│ capacity    │                    │ organization│
│ soldCount   │                    │ role        │
│ isActive    │                    │ paymentStatus│
│ createdAt   │                    │ status      │
└─────────────┘                    │ amountPaid  │
                                   │ createdAt   │
                                   │ updatedAt   │
                                   └─────────────┘

┌─────────────┐                    ┌─────────────┐
│  Speaker    │                    │ AgendaItem  │
│─────────────│                    │─────────────│
│ id (PK)     │                    │ id (PK)     │
│ eventId (FK)│◄───────────────────│ eventId (FK)│
│ name        │                    │ speakerId(FK)│
│ title       │◄───────────────────│ title       │
│ organization│                    │ description │
│ biography   │                    │ startTime   │
│ photoUrl    │                    │ endTime     │
│ linkedinUrl │                    │ track       │
│ twitterUrl  │                    │ location    │
│ isFeatured  │                    │ displayOrder│
│ displayOrder│                    │ createdAt   │
│ createdAt   │                    └─────────────┘
└─────────────┘
```

### Database Models

#### Event
Stores conference event information.
- **Fields**: id, name, date, endDate, location, venue, description, bannerUrl, timestamps
- **Relations**: Has many TicketTypes, Registrations, AgendaItems, Speakers

#### TicketType
Defines different ticket tiers and pricing.
- **Fields**: id, eventId, name, price, currency, description, features[], capacity, soldCount, isActive
- **Relations**: Belongs to Event, has many Registrations

#### Registration
Stores attendee registration and payment information.
- **Fields**: id, ticketId (unique), eventId, ticketTypeId, attendee details, payment details, status
- **Enums**: 
  - PaymentStatus: PENDING, PAID, FAILED, REFUNDED, PARTIALLY_REFUNDED
  - RegistrationStatus: PENDING, CONFIRMED, CANCELLED
  - RefundStatus: INITIATED, PROCESSED, FAILED
- **Relations**: Belongs to Event and TicketType

#### Speaker
Stores speaker profiles and information.
- **Fields**: id, eventId, name, title, organization, biography, photoUrl, social links, isFeatured, displayOrder
- **Relations**: Belongs to Event, has many AgendaItems

#### AgendaItem
Stores conference schedule and sessions.
- **Fields**: id, eventId, speakerId, title, description, startTime, endTime, track, location, displayOrder
- **Relations**: Belongs to Event and Speaker

---

## API Endpoints

### Events API (`/api/events`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events` | List all events | No |
| GET | `/api/events/current` | Get current active event with ticket types | No |
| GET | `/api/events/:id` | Get event by ID | No |

### Speakers API (`/api/speakers`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/speakers` | List all speakers for an event | No |
| GET | `/api/speakers/featured` | Get featured speakers | No |
| GET | `/api/speakers/:id` | Get speaker by ID | No |

### Agenda API (`/api/agenda`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/agenda` | Get agenda items for an event | No |
| GET | `/api/agenda/:id` | Get agenda item by ID | No |

### Registrations API (`/api/registrations`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/registrations` | Create new registration | No |
| GET | `/api/registrations/lookup` | Look up registration by email and ticket ID | No |
| POST | `/api/registrations/:id/cancel` | Cancel registration and initiate refund | No |

**Request Body (POST /api/registrations)**:
```json
{
  "attendeeName": "string",
  "attendeeEmail": "string",
  "attendeePhone": "string",
  "organization": "string (optional)",
  "role": "string (optional)",
  "ticketTypeId": "string"
}
```

### Payments API (`/api/payments`) - **TO BE REMOVED**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payments/initiate` | Create Razorpay order | No |
| POST | `/api/payments/verify` | Verify payment signature | No |
| POST | `/api/payments/demo-confirm` | Demo mode payment confirmation | No |

### Contact API (`/api/contact`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/contact` | Send contact form email | No |

**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

---

## Frontend Components

### Page Components

#### HomePage
Main landing page with:
- Hero section with event branding
- Event highlights and key information
- Featured speakers preview
- Agenda preview
- Statistics counter
- Sponsors section

#### AboutPage
Event information and organizer details.

#### AgendaPage
Full conference schedule with:
- Day-by-day agenda
- Session tracks
- Speaker assignments
- Time slots

#### SpeakersPage
Complete speaker directory with:
- Speaker profiles
- Photos and biographies
- Social media links
- Organization affiliations

#### RegistrationPage
**Current State**: Simplified single-form registration
- Attendee details form
- Success confirmation

**Previous State** (being removed):
- Multi-step wizard (ticket selection → details → review → payment)
- Ticket type selection with pricing
- Payment integration

#### CheckRegistrationPage
Registration lookup functionality:
- Search by email and ticket ID
- Display registration status
- Show event details

#### ContactPage
Contact form for inquiries:
- Name, email, subject, message fields
- Email delivery to organizers

#### PoliciesPage
Terms, privacy policy, and refund information.

### Component Library

#### UI Components (`/components/ui`)
- **Button**: Primary, secondary, and outline variants
- **Input**: Form input with validation and error display
- **Card**: Content container with shadow and border
- **Badge**: Status and category labels
- **LoadingSpinner**: Loading state indicator
- **ErrorMessage**: Error display component

#### Layout Components (`/components/layout`)
- **Layout**: Main layout wrapper with header and footer
- **Navbar**: Navigation bar with responsive menu
- **Footer**: Site footer with links and information

#### Home Components (`/components/home`)
- **HeroSection**: Main hero banner
- **FeaturedSpeakers**: Speaker showcase
- **AgendaPreview**: Schedule preview
- **HighlightsSection**: Event highlights
- **StatsCounter**: Animated statistics
- **SponsorsSection**: Sponsor logos

#### Registration Components (`/components/registration`)
- **AttendeeDetailsStep**: Registration form
- **SuccessStep**: Confirmation page
- ~~**TicketSelectionStep**~~ (removed)
- ~~**PaymentStep**~~ (removed)
- ~~**ReviewStep**~~ (removed)
- ~~**StepIndicator**~~ (removed)

---

## State Management

### Zustand Stores

#### registrationStore.js
Manages registration flow state.

**Current State**:
```javascript
{
  currentStep: 'details' | 'success',
  attendeeDetails: {
    attendeeName: string,
    attendeeEmail: string,
    attendeePhone: string,
    organization?: string,
    role?: string
  },
  confirmedTicketId: string | null
}
```

**Actions**:
- `setStep(step)` - Navigate between steps
- `setAttendeeDetails(details)` - Store form data
- `setConfirmedTicketId(id)` - Store confirmation
- `reset()` - Clear all state

**Previous State** (being removed):
- `selectedTicket` - Ticket type selection
- `clearPaymentData()` - Payment cleanup

#### uiStore.js
Manages UI state (modals, notifications, etc.)

---

## Environment Configuration

### Backend Environment Variables (`.env`)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/allhealthtech

# Payment Gateway (TO BE REMOVED)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Service
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
ORGANIZER_EMAIL=organizer@allhealthtech.com

# Server
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables (`.env`)

```bash
# API Configuration
VITE_API_URL=http://localhost:3000

# Payment Gateway (TO BE REMOVED)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

## Development Workflow

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL database
- npm or yarn package manager

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd allhealthtech-event-platform

# Install dependencies (root + workspaces)
npm install

# Setup backend environment
cd backend
cp .env.example .env
# Edit .env with your configuration

# Setup frontend environment
cd ../frontend
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
cd ../backend
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### Development Commands

```bash
# Run frontend development server (from root)
npm run dev:frontend
# Frontend runs on http://localhost:5173

# Run backend development server (from root)
npm run dev:backend
# Backend runs on http://localhost:3000

# Run both concurrently (recommended)
# Use a tool like concurrently or run in separate terminals

# Build frontend for production
npm run build:frontend

# Run linters
npm run lint

# Format code
npm run format
```

### Database Commands

```bash
# From backend directory

# Create new migration
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Seed database
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Testing

```bash
# From backend directory
npm test
```

---

## Current Status & Ongoing Work

### ✅ Completed Features
- Event information display
- Speaker profiles and management
- Agenda/schedule display
- Contact form
- Registration lookup
- Email notifications
- Database schema and migrations
- API endpoints for all core features
- Responsive UI design
- Component library

### 🚧 In Progress: Registration Form Rebuild

**Objective**: Simplify the registration system by removing multi-step flow, pricing tiers, and payment processing.

**Current Phase**: Component Removal (Task 3)

**Completed Tasks**:
1. ✅ System analysis and documentation
2. ✅ Removed TicketSelectionStep component
3. ✅ Removed PaymentStep component
4. ✅ Removed ReviewStep component
5. ✅ Removed StepIndicator component
6. ✅ Removed PricingPage component and route

**Remaining Tasks**:
- Remove payment-related backend routes and services
- Update database schema (add dietaryRestrictions, accessibilityNeeds fields)
- Create new SimpleRegistrationForm component
- Update backend registration processing (auto-confirm registrations)
- Simplify Zustand store
- Update navigation and routing
- Implement accessibility features
- Add security measures
- Performance optimization
- Testing and validation

**Spec Files**:
- Requirements: `.kiro/specs/registration-form-rebuild/requirements.md`
- Design: `.kiro/specs/registration-form-rebuild/design.md`
- Tasks: `.kiro/specs/registration-form-rebuild/tasks.md`

### 📋 Planned Features
- Admin dashboard for event management
- Speaker submission portal
- Attendee check-in system
- Certificate generation
- Post-event surveys
- Analytics and reporting

---

## Deployment

### Production Build

```bash
# Build frontend
npm run build:frontend
# Output: frontend/dist/

# Backend runs directly from source
# Ensure environment variables are set
```

### Environment Setup

**Backend**:
- Set `NODE_ENV=production`
- Configure production database URL
- Set up production SMTP credentials
- Configure CORS for production frontend URL

**Frontend**:
- Set `VITE_API_URL` to production API URL
- Build and serve static files from `dist/`

### Hosting Recommendations

**Frontend**:
- Vercel, Netlify, or Cloudflare Pages
- Serve static files from `frontend/dist/`

**Backend**:
- Railway, Render, or Heroku
- Ensure PostgreSQL database is provisioned
- Set environment variables in hosting platform

**Database**:
- Supabase, Railway, or Neon (PostgreSQL)
- Run migrations before deployment

### Deployment Checklist

- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Seed production database (if needed)
- [ ] Build frontend for production
- [ ] Test API endpoints
- [ ] Verify CORS configuration
- [ ] Test email sending
- [ ] Configure SSL/HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

---

## Additional Resources

### Documentation Files
- **System Analysis**: `system-analysis-documentation.md`
- **Original Spec**: `.kiro/specs/allhealthtech-event-platform/`
- **Rebuild Spec**: `.kiro/specs/registration-form-rebuild/`

### Key Dependencies Documentation
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)

### Support
For questions or issues, contact the development team or refer to the project repository.

---

**Last Updated**: May 11, 2026  
**Version**: 1.0.0  
**Status**: Active Development
