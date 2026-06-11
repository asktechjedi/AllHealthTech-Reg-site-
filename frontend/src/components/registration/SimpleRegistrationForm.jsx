import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useRegistrationStore from '../../stores/registrationStore.js'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import ErrorMessage from '../ui/ErrorMessage.jsx'
import { apiFetch } from '../../lib/api.js'
import { checkRegistrationAvailability } from '../../lib/checkRegistrationAvailability.js'
import { cleanupRazorpayOverlay, pinRazorpayOverlayToViewport } from '../../lib/razorpayOverlay.js'
import { analytics, logEvent } from '../../firebase.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+\-\s()]+$/
const AVAILABILITY_DEBOUNCE_MS = 700
const RAZORPAY_CHECKOUT_URL = 'https://checkout.razorpay.com/v1/checkout.js'

const fieldsetClass =
  'space-y-5 rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-frost)] p-6'

const legendClass = 'px-3 -ml-3 text-base font-semibold text-[var(--text-primary)]'

const textareaClass = [
  'w-full resize-none rounded-[var(--radius-card)] border-[1.5px] border-[var(--color-mist)]',
  'bg-[var(--color-warm-white)] px-4 py-3.5 text-sm text-[var(--text-primary)]',
  'placeholder-[var(--text-muted)] transition-all',
  'focus:border-[var(--color-blue-core)] focus:outline-none',
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2',
].join(' ')

function loadRazorpayCheckout() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_CHECKOUT_URL}"]`)
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Razorpay Checkout. Please try again.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = RAZORPAY_CHECKOUT_URL
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Unable to load Razorpay Checkout. Please try again.'))
    document.body.appendChild(script)
  })
}

function validate(fields) {
  const errors = {}

  if (!fields.attendeeName.trim()) {
    errors.attendeeName = 'Full name is required.'
  }

  if (!fields.attendeeEmail.trim()) {
    errors.attendeeEmail = 'Email is required.'
  } else if (!EMAIL_RE.test(fields.attendeeEmail.trim())) {
    errors.attendeeEmail = 'Please enter a valid email address.'
  }

  if (!fields.attendeePhone.trim()) {
    errors.attendeePhone = 'Phone number is required.'
  } else if (fields.attendeePhone.trim().length < 7) {
    errors.attendeePhone = 'Phone number must be at least 7 characters.'
  } else if (!PHONE_RE.test(fields.attendeePhone.trim())) {
    errors.attendeePhone = 'Phone number can only contain numbers, +, -, spaces, and parentheses.'
  }

  if (fields.organization && fields.organization.trim().length > 100) {
    errors.organization = 'Organization name must be less than 100 characters.'
  }

  if (fields.role && fields.role.trim().length > 100) {
    errors.role = 'Role must be less than 100 characters.'
  }

  return errors
}

export default function SimpleRegistrationForm() {
  const navigate = useNavigate()
  const { setConfirmedTicketId, setAttendeeDetails, isSubmitting, setSubmitting } = useRegistrationStore()

  const [fields, setFields] = useState({
    attendeeName: '',
    attendeeEmail: '',
    attendeePhone: '',
    organization: '',
    role: '',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
  })

  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [refundAcknowledged, setRefundAcknowledged] = useState(false)
  const [refundError, setRefundError] = useState('')
  const availabilityRequestId = useRef(0)
  const debounceTimers = useRef({})

  const applyAvailabilityResult = useCallback((result) => {
    if (!result) return

    setErrors((prev) => {
      const next = { ...prev }
      if (result.errors.email) {
        next.attendeeEmail = result.errors.email
      } else if (next.attendeeEmail?.includes('already registered')) {
        delete next.attendeeEmail
      }
      if (result.errors.phone) {
        next.attendeePhone = result.errors.phone
      } else if (next.attendeePhone?.includes('already registered')) {
        delete next.attendeePhone
      }
      return next
    })
  }, [])

  const runAvailabilityCheck = useCallback(
    async (overrides = {}) => {
      const email = (overrides.attendeeEmail ?? fields.attendeeEmail).trim()
      const phone = (overrides.attendeePhone ?? fields.attendeePhone).trim()

      const emailReady = email && EMAIL_RE.test(email)
      const phoneReady = phone && phone.length >= 7 && PHONE_RE.test(phone)

      if (!emailReady && !phoneReady) {
        return { available: true, emailAvailable: true, phoneAvailable: true, errors: {} }
      }

      const requestId = ++availabilityRequestId.current
      setIsCheckingAvailability(true)

      try {
        const result = await checkRegistrationAvailability({
          email: emailReady ? email : undefined,
          phone: phoneReady ? phone : undefined,
        })

        if (requestId !== availabilityRequestId.current || !result) {
          return result
        }

        applyAvailabilityResult(result)
        return result
      } catch {
        return null
      } finally {
        if (requestId === availabilityRequestId.current) {
          setIsCheckingAvailability(false)
        }
      }
    },
    [fields.attendeeEmail, fields.attendeePhone, applyAvailabilityResult]
  )

  const scheduleAvailabilityCheck = useCallback(
    (fieldName) => {
      if (debounceTimers.current[fieldName]) {
        clearTimeout(debounceTimers.current[fieldName])
      }

      debounceTimers.current[fieldName] = setTimeout(() => {
        runAvailabilityCheck()
      }, AVAILABILITY_DEBOUNCE_MS)
    },
    [runAvailabilityCheck]
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    if (generalError) {
      setGeneralError('')
    }

    if (name === 'attendeeEmail' || name === 'attendeePhone') {
      if (isFieldReadyForAvailabilityCheck(name, value)) {
        scheduleAvailabilityCheck(name)
      }
    }
  }

  const isFieldReadyForAvailabilityCheck = (name, value) => {
    const trimmed = value.trim()
    if (name === 'attendeeEmail') {
      return trimmed && EMAIL_RE.test(trimmed)
    }
    if (name === 'attendeePhone') {
      return trimmed.length >= 7 && PHONE_RE.test(trimmed)
    }
    return false
  }

  const handleEmailBlur = () => {
    if (debounceTimers.current.attendeeEmail) {
      clearTimeout(debounceTimers.current.attendeeEmail)
    }
    runAvailabilityCheck()
  }

  const handlePhoneBlur = () => {
    if (debounceTimers.current.attendeePhone) {
      clearTimeout(debounceTimers.current.attendeePhone)
    }
    runAvailabilityCheck()
  }

  const hasDuplicateContactError =
    errors.attendeeEmail?.includes('already registered') ||
    errors.attendeePhone?.includes('already registered')

  const handleSubmit = async (e) => {
    e.preventDefault()

    logEvent(analytics, 'register_button_clicked')

    const validationErrors = validate(fields)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      logEvent(analytics, 'registration_validation_failed')
      return
    }

    if (!refundAcknowledged) {
      setRefundError('Please acknowledge the no-refund policy before completing registration.')
      return
    }

    const availability = await runAvailabilityCheck()
    if (availability && !availability.available) {
      return
    }

    const submissionData = {
      attendeeName: fields.attendeeName.trim(),
      attendeeEmail: fields.attendeeEmail.trim(),
      attendeePhone: fields.attendeePhone.trim(),
      organization: fields.organization.trim() || undefined,
      role: fields.role.trim() || undefined,
      dietaryRestrictions: fields.dietaryRestrictions.trim() || undefined,
      accessibilityNeeds: fields.accessibilityNeeds.trim() || undefined,
    }

    setSubmitting(true)
    setGeneralError('')

    try {
      const order = await apiFetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendeeName: submissionData.attendeeName,
          attendeeEmail: submissionData.attendeeEmail,
          attendeePhone: submissionData.attendeePhone,
        }),
      })

      if (!order.success || !order.orderId || !order.keyId) {
        throw new Error('Unable to start payment. Please try again.')
      }

      await loadRazorpayCheckout()

      const paymentResult = await new Promise((resolve, reject) => {
        const checkout = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'AllHealthTech',
          description: 'Event Registration',
          order_id: order.orderId,
          prefill: {
            name: submissionData.attendeeName,
            email: submissionData.attendeeEmail,
            contact: submissionData.attendeePhone,
          },
          theme: {
            color: '#0023FD',
          },
          handler: resolve,
          modal: {
            ondismiss: () => {
              cleanupRazorpayOverlay()
              logEvent(analytics, 'payment_cancelled')
              reject(new Error('Payment was cancelled. Your registration was not created.'))
            },
          },
        })

        checkout.on('payment.failed', (response) => {
          cleanupRazorpayOverlay()
          logEvent(analytics, 'payment_failed', {
            reason: response.error?.description || 'unknown',
          })
          reject(new Error(response.error?.description || 'Payment failed. Your registration was not created.'))
        })

        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        checkout.open()
        pinRazorpayOverlayToViewport()
      })

      cleanupRazorpayOverlay()

      const response = await apiFetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submissionData,
          razorpay_order_id: paymentResult.razorpay_order_id,
          razorpay_payment_id: paymentResult.razorpay_payment_id,
          razorpay_signature: paymentResult.razorpay_signature,
        }),
      })

      if (!response.success || !response.ticketId) {
        throw new Error('Payment succeeded, but registration could not be confirmed. Please contact support.')
      }

      logEvent(analytics, 'registration_complete', {
        ticket_id: response.ticketId,
      })
      setConfirmedTicketId(response.ticketId)
      setAttendeeDetails({
        attendeeName: submissionData.attendeeName,
        attendeeEmail: submissionData.attendeeEmail,
        attendeePhone: submissionData.attendeePhone,
        organization: submissionData.organization,
        role: submissionData.role,
      })
      navigate('/registration/success')
    } catch (error) {
      cleanupRazorpayOverlay()

      let errorMessage = 'An unexpected error occurred. Please try again.'

      if (error.message?.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.'
      } else if (error.message?.includes('NetworkError')) {
        errorMessage = 'Network error occurred. Please check your connection and try again.'
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.'
      } else if (
        error.message?.includes('already registered') ||
        error.message?.includes('phone number')
      ) {
        errorMessage = error.message.includes('phone')
          ? error.message
          : 'This email is already registered for the event. Contact maklabs@allhealthtech.com if you need assistance.'
        if (error.message.includes('email')) {
          setErrors((prev) => ({
            ...prev,
            attendeeEmail: 'This email is already registered for the event.',
          }))
        }
        if (error.message.includes('phone')) {
          setErrors((prev) => ({
            ...prev,
            attendeePhone: 'This phone number is already registered for the event.',
          }))
        }
      } else if (error.message?.includes('validation')) {
        errorMessage = `Please check your information and try again. ${error.message}`
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Too many attempts. Please wait a minute and try again.'
      } else if (error.message?.includes('500') || error.message?.includes('503')) {
        errorMessage = 'Server error occurred. Our team has been notified. Please try again in a few minutes.'
      } else if (error.message && error.message.length < 200) {
        errorMessage = error.message
      }

      setGeneralError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setGeneralError('')
  }

  const handleRefundAcknowledgementChange = (e) => {
    const checked = e.target.checked
    setRefundAcknowledged(checked)

    if (checked && refundError) {
      setRefundError('')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2
          id="registration-form-title"
          className="mb-2 font-[var(--font-display)] text-3xl font-normal text-[var(--text-primary)]"
        >
          Complete Your Registration
        </h2>
        <p id="registration-form-description" className="text-[var(--text-secondary)]">
          Fill out the form below to secure your spot. Fields marked with{' '}
          <span className="font-semibold text-[var(--color-blue-deep)]">*</span> are required.
        </p>
      </div>

      {generalError && (
        <div className="mb-6" role="alert" aria-live="assertive">
          <ErrorMessage message={generalError} onRetry={handleRetry} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full space-y-8"
        aria-labelledby="registration-form-title"
        aria-describedby="registration-form-description"
      >
        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>Personal Information</legend>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                id="attendeeName"
                name="attendeeName"
                label="Full Name"
                required
                value={fields.attendeeName}
                onChange={handleChange}
                placeholder="Jane Doe"
                error={errors.attendeeName}
                aria-required="true"
              />
            </div>

            <Input
              id="attendeeEmail"
              name="attendeeEmail"
              label="Email Address"
              type="email"
              required
              value={fields.attendeeEmail}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              placeholder="jane@example.com"
              error={errors.attendeeEmail}
              aria-required="true"
            />

            <Input
              id="attendeePhone"
              name="attendeePhone"
              label="Phone Number"
              type="tel"
              required
              value={fields.attendeePhone}
              onChange={handleChange}
              onBlur={handlePhoneBlur}
              placeholder="+91 98765 43210"
              error={errors.attendeePhone}
              aria-required="true"
            />
          </div>
        </fieldset>

        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>
            Professional Information
            <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">(Optional)</span>
          </legend>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              id="organization"
              name="organization"
              label="Organization"
              value={fields.organization}
              onChange={handleChange}
              placeholder="Acme Corp"
              error={errors.organization}
              aria-required="false"
            />

            <Input
              id="role"
              name="role"
              label="Role / Job Title"
              value={fields.role}
              onChange={handleChange}
              placeholder="Product Manager"
              error={errors.role}
              aria-required="false"
            />
          </div>
        </fieldset>

        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>
            Special Requirements
            <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">(Optional)</span>
          </legend>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="dietaryRestrictions" className="text-sm font-medium text-[var(--text-secondary)]">
                Dietary Restrictions
              </label>
              <textarea
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={fields.dietaryRestrictions}
                onChange={handleChange}
                placeholder="e.g., Vegetarian, Vegan, Gluten-free, Allergies..."
                rows={3}
                className={textareaClass}
                aria-label="Dietary Restrictions (optional)"
                aria-required="false"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="accessibilityNeeds" className="text-sm font-medium text-[var(--text-secondary)]">
                Accessibility Needs
              </label>
              <textarea
                id="accessibilityNeeds"
                name="accessibilityNeeds"
                value={fields.accessibilityNeeds}
                onChange={handleChange}
                placeholder="e.g., Wheelchair access, Sign language interpreter..."
                rows={3}
                className={textareaClass}
                aria-label="Accessibility Needs (optional)"
                aria-required="false"
              />
            </div>
          </div>
        </fieldset>

        <div className="rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-frost)] p-5">
          <p className="text-sm font-medium text-[var(--text-primary)]">Registration fee</p>
          <p className="mt-1 font-[var(--font-display)] text-2xl font-normal text-[var(--color-navy)]">
            Rs. 2,999
          </p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Confirmed only after successful payment via Razorpay.
          </p>
        </div>

        <div
          className={[
            'rounded-[var(--radius-card)] border p-5 transition-colors',
            refundError
              ? 'border-[var(--color-danger,#d14343)] bg-[rgba(209,67,67,0.06)]'
              : 'border-[var(--color-mist)] bg-[var(--color-warm-white)]',
          ].join(' ')}
        >
          <p className="text-sm font-semibold text-[var(--text-primary)]">Important before payment</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            All registrations are final and non-refundable. Please review your details carefully before completing payment.
          </p>
          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="refundAcknowledgement"
              checked={refundAcknowledged}
              onChange={handleRefundAcknowledgementChange}
              className="mt-1 h-4 w-4 rounded border border-[var(--color-mist)] text-[var(--color-blue-core)] focus:ring-[var(--color-focus-ring)]"
              aria-describedby="refund-policy-note"
              aria-invalid={refundError ? 'true' : 'false'}
            />
            <span id="refund-policy-note" className="text-sm leading-6 text-[var(--text-primary)]">
              I understand that this registration is non-refundable.
            </span>
          </label>
          {refundError && (
            <p className="mt-3 text-sm text-[var(--color-danger,#d14343)]" role="alert">
              {refundError}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting || isCheckingAvailability}
            disabled={
              isSubmitting || isCheckingAvailability || hasDuplicateContactError || !refundAcknowledged
            }
            className="w-full"
            aria-label={
              isSubmitting || isCheckingAvailability
                ? 'Processing registration payment, please wait'
                : 'Pay and complete registration'
            }
          >
            {isCheckingAvailability
              ? 'Checking availability...'
              : isSubmitting
                ? 'Processing...'
                : 'Pay Rs. 2,999 & Complete Registration'}
          </Button>
        </div>

        <p className="pt-2 text-center text-xs text-[var(--text-muted)]" role="note">
          Registration is confirmed only after successful payment. You will receive a confirmation email with your ticket details.
        </p>
      </form>
    </div>
  )
}
