import { create } from 'zustand'

const initialState = {
  currentStep: 'ticket', // 'ticket' | 'details' | 'review' | 'payment' | 'success'
  selectedTicket: null,  // ticket type object or null
  attendeeDetails: null, // attendee form data or null
  confirmedTicketId: null, // string or null (set after payment)
}

const useRegistrationStore = create((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),

  setAttendeeDetails: (details) => set({ attendeeDetails: details }),

  setConfirmedTicketId: (id) => set({ confirmedTicketId: id }),

  // Clears confirmedTicketId and resets payment-sensitive data
  clearPaymentData: () => set({ confirmedTicketId: null }),

  // Resets entire store to initial state
  reset: () => set({ ...initialState }),
}))

export default useRegistrationStore
