import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'
import CookieConsent from './components/ui/CookieConsent'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const AgendaPage = lazy(() => import('./pages/AgendaPage'))
const SpeakersPage = lazy(() => import('./pages/SpeakersPage'))

const RegistrationPage = lazy(() => import('./pages/RegistrationPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export default function App() {
  useEffect(() => {
    sessionStorage.removeItem('chunk-reload-attempted')
  }, [])

  return (
    <Suspense fallback={<PageFallback />}>
      <CookieConsent />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/speakers" element={<SpeakersPage />} />

          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/registration/success" element={<RegistrationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
