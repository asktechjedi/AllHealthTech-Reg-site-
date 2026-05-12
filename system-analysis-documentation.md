# System Analysis Documentation: Registration Form Rebuild

## Task 1: Analyze and Document Existing System Components

This document provides a comprehensive analysis of all registration-related frontend components, payment-related backend routes, and current registration flow that need to be removed as part of the registration form rebuild project.

---

## 1.1 Frontend Registration Components Audit

### Components to Remove

#### 1.1.1 TicketSelectionStep Component
- **File**: `frontend/src/components/registration/TicketSelectionStep.jsx`
- **Purpose**: Displays available ticket types with pricing and allows user selection
- **Dependencies**:
  - Uses `useRegistrationStore` for `setSelectedTicket` and `setStep` actions
  - Imports `apiFetch` from `../../lib/api.js`
  - Uses UI components: `LoadingSpinner`, `ErrorMessage`
  - Uses `CheckIcon` from icons
  - Fetches data from `/api/events/current` endpoint
- **Key Functions**:
  - `formatPrice()` - converts paise to rupees display format
  - `fetchTickets()` - loads ticket types from API
  - `handleSelect()` - sets selected ticket and navigates to details step
- **State Management**: Updates `selectedTicket` in Zustand store and navigates to 'details' step

#### 1.1.2 PaymentStep Component
- **File**: `frontend/src/components/registration/PaymentStep.jsx`
- **Purpose**: Handles payment processing (currently in demo mode)
- **Dependencies**:
  - Uses `useRegistrationStore` for `selectedTicket`, `attendeeDetails`, `setConfirmedTicketId`, `setStep`
  - Imports `apiFetch` from `../../lib/api.js`
  - Uses UI components: `Button`, `LoadingSpinner`, `ErrorMessage`
  - Uses `LockIcon`, `CheckIcon` from icons
  - Calls `/api/registrations` POST and `/api/payments/demo-confirm` POST endpoints
- **Key Functions**:
  - `handlePayment()` - creates registration and processes payment
  - Currently bypasses Razorpay in demo mode
- **State Management**: Updates `confirmedTicketId` and navigates to 'success' step

#### 1.1.3 ReviewStep Component
- **File**: `frontend/src/components/registration/ReviewStep.jsx`
- **Purpose**: Displays summary of selected ticket and attendee details for review
- **Dependencies**:
  - Uses `useRegistrationStore` for `selectedTicket`, `attendeeDetails`, `setStep`
  - Uses `Button` UI component
- **Key Functions**:
  - `formatPrice()` - converts paise to rupees display format
  - `Row()` - helper component for displaying label-value pairs
- **State Management**: Navigates between 'details' and 'payment' steps

#### 1.1.4 StepIndicator Component
- **File**: `frontend/src/components/registration/StepIndicator.jsx`
- **Purpose**: Visual progress indicator for multi-step registration flow
- **Dependencies**:
  - Uses `CheckIcon` from icons
- **Props**:
  - `steps` - array of step objects with `key` and `label`
  - `currentStep` - current active step key
- **Key Functions**:
  - Displays completed, active, and future steps with visual indicators
  - Shows step labels and connector lines

#### 1.1.5 PricingPage Component
- **File**: `frontend/src/pages/PricingPage.jsx`
- **Purpose**: Standalone pricing page displaying ticket options
- **Dependencies**:
  - Uses React Router `Link` component
  - Imports `apiFetch` from `../lib/api`
  - Uses UI components: `LoadingSpinner`, `ErrorMessage`
  - Uses icons: `CheckIcon`, `LockIcon`, `MailIcon`, `RefundIcon`
  - Fetches data from `/api/events/current` endpoint
- **Key Functions**:
  - `fmt()` - formats price display
  - Displays ticket tiers with styling based on `TIER_STYLE` configuration
  - Shows trust signals for payment security
- **Routing**: Accessible at `/pricing` route

### Component Import/Export Relationships

#### RegistrationPage.jsx Dependencies
- **File**: `frontend/src/pages/RegistrationPage.jsx`
- **Current Imports**:
  ```javascript
  import StepIndicator from '../components/registration/StepIndicator.jsx'
  import TicketSelectionStep from '../components/registration/TicketSelectionStep.jsx'
  import AttendeeDetailsStep from '../components/registration/AttendeeDetailsStep.jsx'
  import ReviewStep from '../components/registration/ReviewStep.jsx'
  import PaymentStep from '../components/registration/PaymentStep.jsx'
  import SuccessStep from '../components/registration/SuccessStep.jsx'
  ```
- **Step Configuration**:
  ```javascript
  const STEPS = [
    { key: 'ticket', label: 'Select Ticket' },
    { key: 'details', label: 'Your Details' },
    { key: 'review', label: 'Review' },
    { key: 'payment', label: 'Payment' },
  ]
  ```
- **Step Routing Logic**: `StepContent` function switches between components based on current step

#### App.jsx Route Configuration
- **File**: `frontend/src/App.jsx`
- **Current Routes**:
  ```javascript
  const PricingPage = lazy(() => import('./pages/PricingPage'))
  // Route: <Route path="/pricing" element={<PricingPage />} />
  ```

#### Navigation Integration
- **File**: `frontend/src/components/layout/Navbar.jsx`
- **Current Navigation Links**:
  ```javascript
  const navLinks = [
    // ... other links
    { to: '/pricing', label: 'Pricing' },
    // ... other links
  ]
  ```

---

## 1.2 Backend Payment Routes and Services Audit

### Routes to Remove

#### 1.2.1 Payment Routes
- **File**: `backend/src/routes/payments.js`
- **Endpoints**:
  - `POST /api/payments/initiate` - Creates Razorpay order for registration
  - `POST /api/payments/verify` - Verifies Razorpay payment signature
  - `POST /api/payments/demo-confirm` - Demo mode payment confirmation bypass
- **Dependencies**:
  - Imports: `Router`, `z` (zod), `prisma`, `validate`, `paymentLimiter`, `createOrder`, `verifySignature`, `sendConfirmationEmail`
  - Database operations on `Registration` table
  - Updates registration status and payment fields
- **Middleware**: Uses `paymentLimiter` rate limiting and `validate` schema validation

#### 1.2.2 Payment Service Functions
- **File**: `backend/src/services/paymentService.js`
- **Functions to Remove**:
  - `createOrder(amount, currency, receiptId)` - Creates Razorpay order
  - `verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)` - Verifies payment signature
  - `initiateRefund(razorpayPaymentId, amount)` - Processes refunds
- **Dependencies**:
  - Razorpay SDK integration
  - Crypto module for HMAC signature verification
  - Environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

### Backend Route Registration
- **File**: `backend/src/index.js`
- **Current Registration**:
  ```javascript
  import paymentsRouter from './routes/payments.js';
  app.use('/api/payments', paymentsRouter);
  ```

### Registration Route Dependencies on Payment
- **File**: `backend/src/routes/registrations.js`
- **Payment-Related Code**:
  - Imports `initiateRefund` from payment service
  - Uses payment fields in registration cancellation logic
  - Creates registrations with `status: 'PENDING'` and `paymentStatus: 'PENDING'`
  - Cancellation endpoint calls `initiateRefund()` function

---

## 1.3 Current Registration Flow and State Management

### Zustand Store Structure
- **File**: `frontend/src/stores/registrationStore.js`
- **Current State**:
  ```javascript
  const initialState = {
    currentStep: 'ticket',      // Multi-step navigation
    selectedTicket: null,       // Ticket type selection
    attendeeDetails: null,      // Form data
    confirmedTicketId: null,    // Success state
  }
  ```
- **Actions**:
  - `setStep(step)` - Navigation between steps
  - `setSelectedTicket(ticket)` - Ticket selection
  - `setAttendeeDetails(details)` - Form data management
  - `setConfirmedTicketId(id)` - Success confirmation
  - `clearPaymentData()` - Payment cleanup
  - `reset()` - Full store reset

### Multi-Step Navigation Logic
- **Step Flow**: `ticket` → `details` → `review` → `payment` → `success`
- **Step Components**:
  1. **Ticket Selection**: Choose from available ticket types with pricing
  2. **Attendee Details**: Fill personal and professional information
  3. **Review**: Confirm ticket selection and attendee details
  4. **Payment**: Process payment (currently demo mode)
  5. **Success**: Display confirmation with ticket ID

### Current Registration Process
1. **Step 1 - Ticket Selection**:
   - Fetch ticket types from `/api/events/current`
   - Display pricing and features
   - User selects ticket type
   - Store selection and navigate to details

2. **Step 2 - Attendee Details**:
   - Collect required fields: name, email, phone
   - Collect optional fields: organization, role
   - Validate form data
   - Store details and navigate to review

3. **Step 3 - Review**:
   - Display ticket summary with pricing
   - Display attendee information
   - Allow navigation back to edit details
   - Navigate to payment step

4. **Step 4 - Payment**:
   - Create registration with PENDING status via `POST /api/registrations`
   - In demo mode: call `/api/payments/demo-confirm`
   - In production: would integrate with Razorpay
   - Update registration to CONFIRMED status
   - Navigate to success step

5. **Step 5 - Success**:
   - Display confirmation with ticket ID
   - Show event details
   - Provide next steps

### State Transitions
- **Navigation**: Controlled by `currentStep` state
- **Data Flow**: Each step validates and stores data before proceeding
- **Error Handling**: Each step handles its own errors and allows retry
- **Persistence**: Data persists in Zustand store during session

---

## Summary of Components/Files to Remove

### Frontend Files to Delete
1. `frontend/src/components/registration/TicketSelectionStep.jsx`
2. `frontend/src/components/registration/PaymentStep.jsx`
3. `frontend/src/components/registration/ReviewStep.jsx`
4. `frontend/src/components/registration/StepIndicator.jsx`
5. `frontend/src/pages/PricingPage.jsx`

### Backend Files to Modify/Remove
1. `backend/src/routes/payments.js` - **DELETE ENTIRE FILE**
2. `backend/src/services/paymentService.js` - **REMOVE FUNCTIONS**: `createOrder`, `verifySignature`, `initiateRefund`
3. `backend/src/routes/registrations.js` - **MODIFY**: Remove payment dependencies
4. `backend/src/index.js` - **MODIFY**: Remove payments router registration

### Frontend Files to Modify
1. `frontend/src/pages/RegistrationPage.jsx` - Remove multi-step logic, use single form
2. `frontend/src/App.jsx` - Remove PricingPage route
3. `frontend/src/components/layout/Navbar.jsx` - Remove pricing navigation link
4. `frontend/src/stores/registrationStore.js` - Simplify state structure
5. `frontend/src/components/registration/AttendeeDetailsStep.jsx` - Rename/modify to SimpleRegistrationForm

### Database Schema Impact
- **No schema changes required for removal**
- **New fields to add**: `dietaryRestrictions`, `accessibilityNeeds`
- **Modified registration flow**: Auto-set `status: 'CONFIRMED'` and `paymentStatus: 'PAID'`

### API Endpoints Impact
- **Remove**: All `/api/payments/*` endpoints
- **Modify**: `POST /api/registrations` to auto-confirm registrations
- **Keep**: `GET /api/registrations/lookup` and `POST /api/registrations/:id/cancel`

---

## Next Steps

This analysis provides the foundation for implementing the simplified registration system. The next tasks will involve:

1. **Database Migration**: Add new optional fields
2. **Component Removal**: Delete identified frontend components
3. **Backend Cleanup**: Remove payment routes and services
4. **New Component Creation**: Build SimpleRegistrationForm
5. **State Management Update**: Simplify Zustand store
6. **Route Updates**: Remove pricing page and update navigation

All identified components and dependencies have been mapped to ensure clean removal without breaking existing functionality.