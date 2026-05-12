import { create } from 'zustand'

const initialState = {
  registrationData: null, // form data for registration
  isSubmitting: false, // loading state for form submission
  confirmedTicketId: null, // string or null (set after successful registration)
  attendeeDetails: null, // attendee information for success display
}

const useRegistrationStore = create((set) => ({
  ...initialState,

  setRegistrationData: (data) => set({ registrationData: data }),

  setSubmitting: (loading) => set({ isSubmitting: loading }),

  setConfirmedTicketId: (id) => set({ confirmedTicketId: id }),

  setAttendeeDetails: (details) => set({ attendeeDetails: details }),

  // Legacy function for compatibility - no-op since we don't have payment data anymore
  clearPaymentData: () => {},

  // Resets entire store to initial state
  reset: () => set({ ...initialState }),
}))

export default useRegistrationStore
