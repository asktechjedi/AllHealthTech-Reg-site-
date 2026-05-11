const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function apiFetch(path, options) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, options)
  } catch {
    throw new Error('Network error. Please check your connection and try again.')
  }

  if (!res.ok) {
    if (res.status >= 500) {
      throw new Error('Server error. Please try again later or contact support.')
    }
    // 4xx — try to parse JSON error message
    let message
    try {
      const body = await res.json()
      message = body.error || body.message || res.statusText
    } catch {
      message = res.statusText
    }
    throw new Error(message)
  }

  return res.json()
}
