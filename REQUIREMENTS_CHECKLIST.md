# AllHealthTech Event Platform — Refinement & Requirements Checklist

## Project Goal

Build a professional healthcare technology event registration platform with:

- ✅ Modern UI/UX
- ✅ Event information pages
- 🔄 Registration and payment system (being simplified)
- ✅ Real-time registration tracking
- ✅ Email confirmation system
- ⏳ Google Sheets realtime sync (planned)
- ✅ Responsive and scalable architecture

---

## Recommended Final User Flow

```
Home Page
    ↓
Event Details
    ↓
Register Now
    ↓
Registration Form
    ↓
Razorpay Payment (BEING REMOVED)
    ↓
Payment Verification (BEING REMOVED)
    ↓
Store Data in PostgreSQL
    ↓
Sync to Google Sheets (PLANNED)
    ↓
Send Confirmation Email
    ↓
Registration Success Page
```

### Updated Simplified Flow (In Progress)

```
Home Page
    ↓
Event Details
    ↓
Register Now
    ↓
Simple Registration Form (Single Page)
    ↓
Auto-Confirm Registration
    ↓
Store Data in PostgreSQL
    ↓
Sync to Google Sheets (PLANNED)
    ↓
Send Confirmation Email
    ↓
Registration Success Page
```

---

## Pages Required

### 1. Home Page ✅

**Purpose:**
- Showcase event professionally
- Increase registrations

**Sections:**
- ✅ Hero section
- ✅ Event overview
- ✅ Event highlights
- ✅ Statistics counter
- ✅ Featured speakers
- ✅ Agenda preview
- ✅ Sponsors section
- ✅ Registration CTA
- ✅ Footer

**Required Details:**
- ✅ Event title: "AllHealthTech 2025"
- ✅ Event date: "October 15-17, 2025"
- ✅ Venue/location: "Bombay Exhibition Centre, Mumbai"
- ✅ Event banner
- ✅ Event description
- ✅ Register button

**Status:** ✅ Complete

---

### 2. About Event Page ✅

**Sections:**
- ✅ About conference
- ✅ Mission and goals
- ✅ Industry impact
- ✅ Organizer details

**Required Details:**
- ✅ Full event description
- ✅ Organizer/company info
- ✅ Vision statement

**Status:** ✅ Complete

---

### 3. Speakers Page ✅

**Sections:**
- ✅ Featured speakers
- ✅ Speaker cards
- ✅ Speaker profiles

**Required Details:**
- ✅ Name
- ✅ Designation
- ✅ Organization
- ✅ Photo
- ✅ Biography
- ✅ Social links (LinkedIn, Twitter)

**Status:** ✅ Complete

---

### 4. Agenda Page ✅

**Sections:**
- ✅ Day-wise agenda
- ✅ Session schedule
- ✅ Tracks
- ✅ Timings

**Required Details:**
- ✅ Session title
- ✅ Speaker name
- ✅ Start/end time
- ✅ Location
- ✅ Track/category

**Status:** ✅ Complete

---

### 5. Registration Page 🔄

**Purpose:**
- Main attendee registration flow

**Current Implementation (Being Simplified):**
- ~~Multi-step wizard~~ → Single form
- ~~Ticket selection~~ → Auto-assigned default ticket
- ~~Payment step~~ → Removed
- ~~Review step~~ → Removed

**Recommended Fields:**
- ✅ Full name (required)
- ✅ Email address (required)
- ✅ Phone number (required)
- ✅ Organization/company (optional)
- ✅ Job role (optional)
- 🔄 Dietary restrictions (being added)
- 🔄 Accessibility needs (being added)
- ~~Ticket type~~ (auto-assigned)

**Features:**
- ✅ Validation
- ~~Razorpay payment~~ (removed)
- ✅ Success message
- ✅ Email confirmation

**Status:** 🔄 In Progress (Simplification)

---

### 6. Success Page ✅

**Sections:**
- ✅ Registration successful message
- ✅ Ticket/reference ID
- ~~Payment confirmation~~ (removed)
- ✅ Event details

**Features:**
- ✅ Email sent confirmation
- ⏳ Download ticket later (optional - planned)

**Status:** ✅ Complete (needs minor updates for simplified flow)

---

### 7. Contact Page ✅

**Fields:**
- ✅ Name
- ✅ Email
- ✅ Subject
- ✅ Message

**Features:**
- ✅ Email sending
- ✅ Validation

**Status:** ✅ Complete

---

### 8. Pricing Page ❌

**Status:** ❌ Being Removed (no longer needed in simplified flow)

---

### 9. Check Registration Page ✅

**Purpose:**
- Allow attendees to look up their registration

**Features:**
- ✅ Search by email and ticket ID
- ✅ Display registration status
- ✅ Show event details

**Status:** ✅ Complete

---

### 10. Policies Page ✅

**Sections:**
- ✅ Terms and conditions
- ✅ Privacy policy
- ✅ Refund policy

**Status:** ✅ Complete

---

## Backend Features Required

### APIs

#### Event APIs ✅
- ✅ `GET /api/events` - Get event details
- ✅ `GET /api/events/current` - Get current event with ticket types
- ✅ `GET /api/events/:id` - Get event by ID

#### Speaker APIs ✅
- ✅ `GET /api/speakers` - Get speakers
- ✅ `GET /api/speakers/featured` - Get featured speakers
- ✅ `GET /api/speakers/:id` - Get speaker by ID

#### Agenda APIs ✅
- ✅ `GET /api/agenda` - Get agenda
- ✅ `GET /api/agenda/:id` - Get agenda item by ID

#### Registration APIs 🔄
- ✅ `POST /api/registrations` - Create registration
- 🔄 Update to auto-confirm registrations (in progress)
- ✅ `GET /api/registrations/lookup` - Registration lookup
- ✅ `POST /api/registrations/:id/cancel` - Cancel registration

#### Payment APIs ❌
- ~~`POST /api/payments/initiate` - Create Razorpay order~~ (being removed)
- ~~`POST /api/payments/verify` - Verify payment signature~~ (being removed)
- ~~`POST /api/payments/demo-confirm` - Demo payment~~ (being removed)

**Status:** ❌ Being Removed

#### Contact APIs ✅
- ✅ `POST /api/contact` - Send contact form email

**Status:** ✅ Complete

---

## Database Requirements

### Recommended Tables

#### 1. `events` Table ✅
**Purpose:** Store event details

**Fields:**
- ✅ id
- ✅ name
- ✅ date
- ✅ endDate
- ✅ location
- ✅ venue
- ✅ description
- ✅ bannerUrl
- ✅ createdAt
- ✅ updatedAt

**Status:** ✅ Complete

---

#### 2. `speakers` Table ✅
**Purpose:** Store speaker information

**Fields:**
- ✅ id
- ✅ eventId
- ✅ name
- ✅ title
- ✅ organization
- ✅ biography
- ✅ photoUrl
- ✅ linkedinUrl
- ✅ twitterUrl
- ✅ isFeatured
- ✅ displayOrder
- ✅ createdAt

**Status:** ✅ Complete

---

#### 3. `agenda_items` Table ✅
**Purpose:** Store schedule and session data

**Fields:**
- ✅ id
- ✅ eventId
- ✅ title
- ✅ description
- ✅ startTime
- ✅ endTime
- ✅ track
- ✅ location
- ✅ speakerId
- ✅ displayOrder
- ✅ createdAt

**Status:** ✅ Complete

---

#### 4. `registrations` Table 🔄
**Purpose:** Store attendee registration data

**Current Fields:**
- ✅ id
- ✅ ticketId (unique)
- ✅ eventId
- ✅ ticketTypeId
- ✅ attendeeName
- ✅ attendeeEmail
- ✅ attendeePhone
- ✅ organization
- ✅ role
- 🔄 dietaryRestrictions (being added)
- 🔄 accessibilityNeeds (being added)
- ✅ paymentStatus (will be auto-set to 'PAID')
- ✅ paymentTransactionId
- ✅ razorpayOrderId
- ✅ razorpayPaymentId
- ✅ razorpaySignature
- ✅ amountPaid
- ✅ status (will be auto-set to 'CONFIRMED')
- ✅ cancelledAt
- ✅ refundId
- ✅ refundStatus
- ✅ createdAt
- ✅ updatedAt

**Status:** 🔄 In Progress (adding new fields)

---

#### 5. `ticket_types` Table ✅
**Purpose:** Store ticket type information

**Fields:**
- ✅ id
- ✅ eventId
- ✅ name
- ✅ price
- ✅ currency
- ✅ description
- ✅ features
- ✅ capacity
- ✅ soldCount
- ✅ isActive
- ✅ createdAt

**Status:** ✅ Complete (will use default ticket type in simplified flow)

---

## Realtime Registration Storage

### Recommended Solution
**PostgreSQL + Google Sheets Sync**

**Why:**
- ✅ PostgreSQL stores permanent data
- ⏳ Google Sheets provides realtime organizer access
- ⏳ No CRM needed
- ⏳ No admin dashboard needed initially

**Flow:**
```
Registration
    ↓
PostgreSQL (✅ Complete)
    ↓
Google Sheets Sync (⏳ Planned)
```

**Status:** ⏳ Planned Feature

**Implementation Notes:**
- Use Google Sheets API
- Sync on registration creation
- Include all registration fields
- Real-time or near-real-time sync
- Error handling for sync failures

---

## Email System

### Recommended ✅
**Use:**
- ✅ Nodemailer
- ✅ SMTP

**Email Should Include:**
- ✅ Attendee name
- ✅ Registration confirmation
- ✅ Ticket type
- ✅ Event details
- ~~Payment confirmation~~ (removed)
- ✅ Ticket ID

**Current Implementation:**
- ✅ Email service configured
- ✅ Confirmation email template
- ✅ Async email sending
- ✅ Error handling

**Status:** ✅ Complete

---

## Razorpay Integration

### Original Recommended Flow ❌
```
Form Submit
    ↓
Create Razorpay Order
    ↓
Payment Success
    ↓
Verify Payment
    ↓
Store Registration
```

**Important:** Only store registration after successful payment verification.

### Current Status: ❌ Being Removed

**Reason:** Simplifying registration flow to remove payment complexity

**Replacement Flow:**
```
Form Submit
    ↓
Auto-Confirm Registration
    ↓
Store Registration (status: CONFIRMED, paymentStatus: PAID)
```

---

## UI/UX Improvements Recommended

### Home Page ✅
- ✅ Modern hero section
- ✅ Gradient background
- ✅ Smooth animations (Framer Motion)
- ✅ Sticky navbar
- ✅ Mobile responsive design

**Status:** ✅ Complete

---

### Registration Page 🔄
- ✅ Clean card layout
- 🔄 Simple form (being simplified from multi-step)
- ~~Progress feedback~~ (removed with multi-step)
- ✅ Loading states
- ✅ Error validation messages

**Status:** 🔄 In Progress

---

### General ✅
- ✅ Responsive design
- ✅ Consistent spacing
- ✅ Professional typography
- ✅ Accessibility support
- ✅ Fast loading

**Status:** ✅ Complete

---

## Technologies Recommended

| Layer | Technology | Status |
|-------|------------|--------|
| **Frontend** | React.js + Vite | ✅ Implemented |
| **Styling** | Tailwind CSS | ✅ Implemented |
| **Animations** | Framer Motion | ✅ Implemented |
| **Routing** | React Router | ✅ Implemented |
| **State Management** | Zustand | ✅ Implemented |
| **Backend** | Express.js | ✅ Implemented |
| **Database** | PostgreSQL | ✅ Implemented |
| **ORM** | Prisma | ✅ Implemented |
| **Payment** | Razorpay | ❌ Being Removed |
| **Email** | Nodemailer | ✅ Implemented |
| **Realtime View** | Google Sheets API | ⏳ Planned |
| **Testing** | Vitest | ✅ Configured |
| **Linting** | ESLint | ✅ Configured |
| **Formatting** | Prettier | ✅ Configured |

---

## Future Improvements (Optional)

| Feature | Priority | Status |
|---------|----------|--------|
| QR ticket generation | Medium | ⏳ Planned |
| Attendance check-in system | Medium | ⏳ Planned |
| Excel export | Low | ⏳ Planned |
| Analytics dashboard | Medium | ⏳ Planned |
| WhatsApp notifications | Low | ⏳ Planned |
| AI chatbot support | Low | ⏳ Planned |
| Docker deployment | Medium | ⏳ Planned |
| AWS hosting | Medium | ⏳ Planned |
| Google Sheets sync | High | ⏳ Planned |
| Admin dashboard | High | ⏳ Planned |

---

## Information Needed From You

### Event Information ✅
- ✅ Event name: "AllHealthTech 2025"
- ✅ Event description
- ✅ Event date: "October 15-17, 2025"
- ✅ Event venue: "Bombay Exhibition Centre"
- ✅ City/location: "Mumbai"
- ✅ Event banner/logo

**Status:** ✅ Complete

---

### Speaker Information ✅
- ✅ Speaker names
- ✅ Designations
- ✅ Organizations
- ✅ Photos
- ✅ Social links

**Status:** ✅ Complete (seeded in database)

---

### Agenda Details ✅
- ✅ Sessions
- ✅ Timings
- ✅ Tracks
- ✅ Speaker mapping

**Status:** ✅ Complete (seeded in database)

---

### Registration Details 🔄
- ~~Ticket types~~ (simplified to default ticket)
- ~~Ticket prices~~ (removed)
- ✅ Registration fields required
- 🔄 New fields: dietary restrictions, accessibility needs

**Status:** 🔄 In Progress

---

### Payment Details ❌
- ~~Razorpay key id~~
- ~~Razorpay secret key~~

**Status:** ❌ No Longer Required (payment removed)

---

### Email Details ✅
- ✅ SMTP email
- ✅ SMTP password/app password
- ✅ Organizer email

**Status:** ✅ Complete (configured in .env)

---

### Branding ✅
- ✅ Primary colors (Blue/Green gradient theme)
- ✅ Fonts (System fonts with Tailwind)
- ✅ Theme style (Modern, professional)
- ⏳ Reference websites

**Status:** ✅ Complete

---

## Final Recommended Architecture

### Current Implementation ✅

```
React Frontend (Vite)
        ↓
Express.js Backend
        ↓
~~Razorpay Payment~~ (REMOVED)
        ↓
PostgreSQL Database (Prisma ORM)
        ↓
Google Sheets Sync (PLANNED)
        ↓
Confirmation Email (Nodemailer)
```

### Simplified Architecture (In Progress) 🔄

```
React Frontend (Vite)
        ↓
Express.js Backend
        ↓
Auto-Confirm Registration
        ↓
PostgreSQL Database (Prisma ORM)
        ↓
Google Sheets Sync (PLANNED)
        ↓
Confirmation Email (Nodemailer)
```

**Status:** 🔄 In Progress

This architecture is simple, scalable, professional, and suitable for modern event registration platforms.

---

## Current Project Status Summary

### ✅ Completed (80%)
- Frontend UI/UX with all pages
- Backend API with all endpoints
- Database schema and migrations
- Email confirmation system
- Registration lookup
- Contact form
- Responsive design
- Component library
- State management
- Error handling
- Validation

### 🔄 In Progress (15%)
- Registration form simplification
- Removing payment integration
- Removing multi-step flow
- Adding new registration fields
- Updating backend registration logic
- Simplifying state management

### ⏳ Planned (5%)
- Google Sheets sync
- Admin dashboard
- QR ticket generation
- Analytics
- Additional features

---

## Next Steps

### Immediate (Current Sprint)
1. 🔄 Complete registration form rebuild
   - Remove PricingPage component
   - Remove payment backend routes
   - Update database schema
   - Create SimpleRegistrationForm
   - Update backend registration processing
   - Simplify Zustand store
   - Update navigation

### Short Term (Next Sprint)
2. ⏳ Implement Google Sheets sync
3. ⏳ Add admin dashboard
4. ⏳ Implement QR ticket generation

### Long Term
5. ⏳ Analytics and reporting
6. ⏳ WhatsApp notifications
7. ⏳ Docker deployment
8. ⏳ Production hosting setup

---

**Document Version:** 1.0  
**Last Updated:** May 11, 2026  
**Status:** Active Development  
**Completion:** ~80%
