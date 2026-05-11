import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const AgendaPage = lazy(() => import('./pages/AgendaPage'))
const SpeakersPage = lazy(() => import('./pages/SpeakersPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const CheckRegistrationPage = lazy(() => import('./pages/CheckRegistrationPage'))
const PoliciesPage = lazy(() => import('./pages/PoliciesPage'))

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/check-registration" element={<CheckRegistrationPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
