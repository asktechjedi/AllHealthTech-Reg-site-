const RAZORPAY_CHECKOUT_URL = 'https://checkout.razorpay.com/v1/checkout.js'

const RAZORPAY_OVERLAY_SELECTOR = [
  '.razorpay-container',
  '.razorpay-backdrop',
  'iframe[src*="api.razorpay.com"]',
  'iframe[src*="checkout.razorpay.com"]',
].join(', ')

export function pinRazorpayOverlayToViewport() {
  const apply = () => {
    const containers = document.querySelectorAll('.razorpay-container')

    containers.forEach((element) => {
      Object.assign(element.style, {
        position: 'fixed',
        inset: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '2147483647',
      })
    })
  }

  apply()
  requestAnimationFrame(apply)
  setTimeout(apply, 250)
  setTimeout(apply, 750)
}

export function cleanupRazorpayOverlay() {
  document.querySelectorAll(RAZORPAY_OVERLAY_SELECTOR).forEach((element) => {
    element.remove()
  })

  document.body.classList.remove('razorpay-checkout-frame')
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
}

/**
 * Nuclear cleanup: removes every Razorpay artifact from the page so the next
 * payment attempt starts completely fresh — no stale iframes, no stale script,
 * no stale window.Razorpay constructor. loadRazorpayCheckout() will re-inject
 * checkout.js from scratch on the next call because window.Razorpay is gone.
 */
export function destroyRazorpay() {
  // Remove overlay, iframes, and the checkout.js script tag itself
  const nukeSelector = [
    ...RAZORPAY_OVERLAY_SELECTOR.split(', '),
    `script[src="${RAZORPAY_CHECKOUT_URL}"]`,
  ].join(', ')
  document.querySelectorAll(nukeSelector).forEach((el) => el.remove())

  // Reset body scroll locks
  document.body.classList.remove('razorpay-checkout-frame')
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''

  // Delete the global Razorpay constructor and bridge so the SDK re-boots clean
  try { delete window.Razorpay } catch { window.Razorpay = undefined }
  try { delete window.CheckoutBridge } catch { window.CheckoutBridge = undefined }
}
