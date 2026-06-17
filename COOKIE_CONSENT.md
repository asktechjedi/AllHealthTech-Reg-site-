# Cookie Consent — AllHealthTech Registration Site

## Why Cookie Consent Is Needed

This website uses **Firebase Analytics (Google Analytics 4)**, which automatically sets tracking cookies in the visitor's browser the moment the page loads. Under privacy laws like **GDPR** (Europe), **CCPA** (California), and **India's DPDP Act**, websites must get the user's explicit consent **before** setting non-essential cookies — especially analytics cookies that track user behaviour.

Without a consent banner, Firebase Analytics cookies are set on every page load, which is a legal violation for visitors from regulated regions.

---

## What Cookies This Site Sets

### Before Consent (Zero cookies set)
Nothing is stored. The site loads, but Firebase Analytics is not initialised.

### After the User Accepts Consent

Firebase Analytics sets the following cookies automatically:

| Cookie Name | Purpose | Expiry | Set By |
|---|---|---|---|
| `_ga` | Unique client ID — distinguishes one visitor from another | 2 years | Google Analytics |
| `_ga_NBDHZ4Q6KV` | Session state for this specific GA4 property (Measurement ID: `G-NBDHZ4Q6KV`) | 2 years | Google Analytics |

### What the Site Stores in localStorage (Not Cookies)

| Key | Value | Purpose |
|---|---|---|
| `aht_cookie_consent` | `"accepted"` or `"rejected"` | Remembers the user's consent choice so the banner doesn't appear on every visit |

This is stored in **localStorage**, not a cookie, so it doesn't get sent to any server.

---

## What Data Firebase Analytics Collects

When the user accepts and Firebase Analytics is active:

| Data Point | Collected? | Notes |
|---|---|---|
| Page views | Yes | Every page visited |
| Session duration | Yes | How long the user stays |
| Browser / device type | Yes | Chrome, Safari, Mobile, Desktop, etc. |
| Country / approximate location | Yes | Derived from IP address by Google; IP itself is anonymised |
| Custom events (see below) | Yes | Specific user actions in the registration flow |

### Custom Events Tracked on This Site

| Event Name | When It Fires |
|---|---|
| `register_button_clicked` | User clicks the "Pay & Complete Registration" button |
| `registration_validation_failed` | Form validation fails (missing/invalid fields) |
| `payment_cancelled` | User closes the Razorpay payment modal |
| `payment_failed` | Razorpay payment transaction fails |
| `registration_complete` | Registration + payment succeeds (includes `ticket_id`) |

### What Is NOT Collected

- Personal details (name, email, phone) — those go to the **backend API only**, never to analytics
- Payment information — handled entirely by **Razorpay**, not stored or tracked here
- Passwords or auth tokens — not applicable (no login system)

---

## Third-Party Services That May Set Cookies

| Service | Why It's Used | Cookie/Storage? |
|---|---|---|
| Firebase Analytics (Google) | User behaviour analytics | Yes — `_ga`, `_ga_NBDHZ4Q6KV` |
| Razorpay | Payment processing | Yes — Razorpay sets session cookies inside their checkout iframe |
| Google Fonts | Font rendering (DM Sans, DM Serif Display) | No cookies; fonts loaded via CDN requests |

---

## How Cookie Consent Works on This Site (Implementation)

### User Flow

```
User visits site
     ↓
Has localStorage["aht_cookie_consent"] been set?
     ↓ No                          ↓ Yes ("accepted" or "rejected")
Show consent banner            Load silently based on previous choice
     ↓                                    ↓
User clicks Accept           If "accepted" → init Firebase Analytics
   → Save "accepted"         If "rejected" → skip analytics entirely
   → Init Firebase Analytics
   → Hide banner

User clicks Decline
   → Save "rejected"
   → Skip Firebase Analytics
   → Hide banner
```

### What "Accept" Does

1. Saves `"accepted"` to `localStorage["aht_cookie_consent"]`
2. Calls `enableAnalytics()` which runs `getAnalytics(firebaseApp)` — this is the moment Google's `_ga` cookies get created in the browser
3. From this point, all page views and custom events are sent to Firebase Analytics (`G-NBDHZ4Q6KV`)

### What "Decline" Does

1. Saves `"rejected"` to `localStorage["aht_cookie_consent"]`
2. Firebase Analytics is never initialised — no `_ga` cookies are ever created
3. All `logEvent()` calls silently do nothing (no errors)

### On Return Visits

- The banner does **not** show again
- If previous choice was `"accepted"` → Firebase Analytics auto-initialises silently on page load
- If previous choice was `"rejected"` → Analytics stays off

---

## Where Consent Is Stored

```
localStorage key:   aht_cookie_consent
Possible values:    "accepted" | "rejected"
Set/read by:        frontend/src/firebase.js
                    frontend/src/components/ui/CookieConsent.jsx
Expiry:             Never (until user clears browser data)
```

---

## Files Changed for Cookie Consent Implementation

| File | Change |
|---|---|
| `frontend/src/firebase.js` | Analytics now only initialises if consent is already given; exports `enableAnalytics()` |
| `frontend/src/components/ui/CookieConsent.jsx` | New banner component — shows on first visit, calls `enableAnalytics()` on accept |
| `frontend/src/App.jsx` | Renders `<CookieConsent />` at the bottom of every page |

---

## Privacy Policy Coverage

The existing **Privacy Policy** at `/privacy-policy` already mentions cookies and analytics. No changes to the policy content are needed; the consent mechanism enforces what the policy describes.

---

## Legal Compliance Summary

| Law | Requirement | This Implementation |
|---|---|---|
| GDPR (EU) | Explicit opt-in before analytics cookies | Consent banner required before `getAnalytics()` |
| CCPA (California) | Right to opt out of tracking | Decline button provided |
| India DPDP Act | Informed consent for data processing | Banner explains purpose before any tracking |

---

## FAQ

**Q: Does declining affect the registration or payment process?**  
No. Cookie consent only controls analytics. Registration, payment (Razorpay), and all site functionality work exactly the same whether the user accepts or declines.

**Q: Can a user change their mind?**  
Yes — clearing browser data (localStorage) removes the saved choice and the consent banner will reappear on next visit. A "Manage Cookies" link in the footer can also be added to reset the choice.

**Q: Does Razorpay require consent?**  
Razorpay's payment iframe sets its own session cookies as part of PCI-compliant payment processing. These are strictly necessary for the payment to function and are exempt from consent requirements under most privacy laws.

**Q: What happens if the user is in a region without privacy laws?**  
The banner still shows for all visitors. Consistent behaviour is simpler and more trust-building than geo-targeting.
