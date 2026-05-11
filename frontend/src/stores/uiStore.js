import { create } from 'zustand'

const useUIStore = create((set) => ({
  mobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
}))

export default useUIStore
