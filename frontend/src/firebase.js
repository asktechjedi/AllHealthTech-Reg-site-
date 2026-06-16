import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent as _fbLogEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDAJ37YIpRwezRTC_j4bqDGhFxQGSV9nMI",
  authDomain: "allhealthtech-20385.firebaseapp.com",
  projectId: "allhealthtech-20385",
  storageBucket: "allhealthtech-20385.firebasestorage.app",
  messagingSenderId: "797772223728",
  appId: "1:797772223728:web:ade6717a3a1e1e08281e35",
  measurementId: "G-NBDHZ4Q6KV"
};

export const CONSENT_KEY = 'aht_cookie_consent';

const app = initializeApp(firebaseConfig);
let _analytics = null;

// Auto-init only if the user already gave consent on a previous visit
if (localStorage.getItem(CONSENT_KEY) === 'accepted') {
  _analytics = getAnalytics(app);
}

// Called by the consent banner when the user clicks "Accept"
export function enableAnalytics() {
  if (!_analytics) {
    _analytics = getAnalytics(app);
  }
}

// Drop-in replacement for Firebase's logEvent — silently skips if analytics
// was not initialised (user declined or hasn't chosen yet).
// The first argument mirrors Firebase's signature so existing call sites
// (logEvent(analytics, 'event', params)) continue to work unchanged.
export function logEvent(_instance, eventName, params) {
  if (_analytics) {
    _fbLogEvent(_analytics, eventName, params);
  }
}

// `analytics` is exported as a placeholder so existing import statements
// don't need to change; the value is ignored by the wrapped logEvent above.
export const analytics = null;
export { app };
