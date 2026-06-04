import { apiFetch } from './api.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+\-\s()]+$/

/**
 * @param {{ email?: string, phone?: string }} params
 * @returns {Promise<{
 *   available: boolean,
 *   emailAvailable: boolean,
 *   phoneAvailable: boolean,
 *   errors: { email?: string, phone?: string }
 * } | null>}
 */
export async function checkRegistrationAvailability({ email, phone }) {
  const params = new URLSearchParams()

  const trimmedEmail = email?.trim().toLowerCase()
  const trimmedPhone = phone?.trim()

  if (trimmedEmail && EMAIL_RE.test(trimmedEmail)) {
    params.set('email', trimmedEmail)
  }

  if (trimmedPhone && trimmedPhone.length >= 7 && PHONE_RE.test(trimmedPhone)) {
    params.set('phone', trimmedPhone)
  }

  if (!params.toString()) {
    return null
  }

  let data
  try {
    data = await apiFetch(`/api/registrations/check-availability?${params.toString()}`)
  } catch (error) {
    if (error.message?.includes('Too many requests')) {
      return null
    }
    throw error
  }
  return {
    available: data.available,
    emailAvailable: data.emailAvailable,
    phoneAvailable: data.phoneAvailable,
    errors: data.errors ?? {},
  }
}
