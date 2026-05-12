# Google Sheets Connection - Visual Guide

## 🔗 Complete Connection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION                             │
│                                                                   │
│  1. User fills form (Name, Email, Phone, etc.)                  │
│  2. Clicks "Register"                                            │
│  3. Form submitted to backend                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND: POST /api/registrations                    │
│                                                                   │
│  1. Validate input data                                          │
│  2. Check for duplicate email                                    │
│  3. Generate unique Ticket ID                                    │
│  4. Save to database                                             │
│  5. Return success response                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│           ASYNCHRONOUS: Send Email & Sync to Sheets              │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Send Confirmation Email                              │   │
│  │    - Includes Ticket ID                                 │   │
│  │    - All registration details                           │   │
│  │    - Event information                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 2. Sync to Google Sheets                                │   │
│  │    - Load credentials from file                         │   │
│  │    - Authenticate with Google API                       │   │
│  │    - Append row to spreadsheet                          │   │
│  │    - Handle errors with retry logic                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE SHEETS                                 │
│                                                                   │
│  Spreadsheet: "Event Registrations"                             │
│  Sheet: "Registrations"                                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Ticket ID │ Name │ Email │ Phone │ Org │ Role │ ...     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ AHT-2025- │ John │ john@ │ +91   │ Acme│ Mgr  │ ...     │  │
│  │ 00001     │ Doe  │ ex.com│ 98765 │ Corp│      │ ...     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ AHT-2025- │ Jane │ jane@ │ +91   │ Tech│ Lead │ ...     │  │
│  │ 00002     │ Smith│ ex.com│ 87654 │ Inc │      │ ...     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                  CREDENTIALS FILE                             │
│                                                                │
│  backend/credentials/google-sheets-credentials.json           │
│                                                                │
│  {                                                             │
│    "type": "service_account",                                 │
│    "project_id": "my-project",                                │
│    "private_key_id": "key123",                                │
│    "private_key": "-----BEGIN PRIVATE KEY-----...",            │
│    "client_email": "sync@my-project.iam.gserviceaccount.com", │
│    "client_id": "123456789",                                  │
│    "auth_uri": "https://accounts.google.com/o/oauth2/auth",   │
│    "token_uri": "https://oauth2.googleapis.com/token",        │
│    ...                                                         │
│  }                                                             │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│              LOAD CREDENTIALS IN CODE                         │
│                                                                │
│  const credentials = JSON.parse(                              │
│    fs.readFileSync(credentialsPath, 'utf8')                   │
│  );                                                            │
│                                                                │
│  const auth = new google.auth.GoogleAuth({                    │
│    credentials,                                               │
│    scopes: [                                                  │
│      'https://www.googleapis.com/auth/spreadsheets'           │
│    ],                                                          │
│  });                                                           │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│            AUTHENTICATE WITH GOOGLE API                      │
│                                                                │
│  1. Use private key to sign request                           │
│  2. Send to Google OAuth2 token endpoint                      │
│  3. Receive access token                                      │
│  4. Use token for all API requests                            │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│           CALL GOOGLE SHEETS API                             │
│                                                                │
│  POST https://sheets.googleapis.com/v4/spreadsheets/          │
│       {spreadsheetId}/values/{sheetName}:append               │
│                                                                │
│  Headers:                                                      │
│  - Authorization: Bearer {access_token}                       │
│  - Content-Type: application/json                             │
│                                                                │
│  Body:                                                         │
│  {                                                             │
│    "values": [                                                │
│      ["AHT-2025-00001", "John Doe", "john@ex.com", ...]      │
│    ]                                                           │
│  }                                                             │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│              GOOGLE SHEETS UPDATED                            │
│                                                                │
│  New row appended to spreadsheet                              │
│  Data now visible in Google Sheets UI                         │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Retry Logic Flow

```
SYNC ATTEMPT 1
    ↓
    ├─ SUCCESS? → ✅ Done
    │
    └─ FAILURE?
        ↓
        ├─ TRANSIENT ERROR? (network, rate limit, 5xx)
        │   ↓
        │   → Queue for retry
        │   → Wait 1 second
        │   → SYNC ATTEMPT 2
        │
        └─ PERMANENT ERROR? (auth, 404, invalid)
            ↓
            → Move to Dead Letter Queue
            → Alert support team
            → ❌ Stop retrying


SYNC ATTEMPT 2
    ↓
    ├─ SUCCESS? → ✅ Done
    │
    └─ FAILURE?
        ↓
        ├─ TRANSIENT ERROR?
        │   ↓
        │   → Queue for retry
        │   → Wait 2 seconds
        │   → SYNC ATTEMPT 3
        │
        └─ PERMANENT ERROR?
            ↓
            → Move to Dead Letter Queue
            → ❌ Stop retrying


SYNC ATTEMPT 3
    ↓
    ├─ SUCCESS? → ✅ Done
    │
    └─ FAILURE?
        ↓
        ├─ TRANSIENT ERROR?
        │   ↓
        │   → Queue for retry
        │   → Wait 4 seconds
        │   → SYNC ATTEMPT 4
        │
        └─ PERMANENT ERROR?
            ↓
            → Move to Dead Letter Queue
            → ❌ Stop retrying


SYNC ATTEMPT 4
    ↓
    ├─ SUCCESS? → ✅ Done
    │
    └─ FAILURE?
        ↓
        → Move to Dead Letter Queue
        → ❌ Max retries exceeded
        → Manual review required
```

---

## 📊 Data Mapping

```
REGISTRATION OBJECT (from database)
│
├─ id: "reg-123"
├─ ticketId: "AHT-2025-00001"
├─ attendeeName: "John Doe"
├─ attendeeEmail: "john@example.com"
├─ attendeePhone: "+91 98765 43210"
├─ organization: "Acme Corp"
├─ role: "Manager"
├─ dietaryRestrictions: "Vegetarian"
├─ accessibilityNeeds: "Wheelchair access"
├─ createdAt: "2025-10-01T14:30:00Z"
├─ ticketType: {
│   └─ name: "General Admission"
│}
└─ event: {
    └─ name: "AllHealthTech 2025"
}
                    ↓
        MAPPING FUNCTION
        mapRegistrationToSheetRow()
                    ↓
GOOGLE SHEETS ROW
│
├─ Column A: "AHT-2025-00001"        (Ticket ID)
├─ Column B: "John Doe"              (Attendee Name)
├─ Column C: "john@example.com"      (Email)
├─ Column D: "+91 98765 43210"       (Phone)
├─ Column E: "Acme Corp"             (Organization)
├─ Column F: "Manager"               (Role)
├─ Column G: "Vegetarian"            (Dietary Restrictions)
├─ Column H: "Wheelchair access"     (Accessibility Needs)
├─ Column I: "General Admission"     (Ticket Type)
├─ Column J: "AllHealthTech 2025"    (Event Name)
└─ Column K: "2025-10-01T14:30:00Z"  (Registration Timestamp)
```

---

## 🗂️ File Structure

```
backend/
├─ credentials/                          ← Credentials folder (in .gitignore)
│  └─ google-sheets-credentials.json     ← Service account JSON file
│
├─ src/
│  ├─ services/
│  │  ├─ googleSheetsService.js          ← Main sync logic
│  │  │  ├─ getGoogleSheetsAuth()        ← Load credentials & authenticate
│  │  │  ├─ mapRegistrationToSheetRow()  ← Map data to sheet format
│  │  │  ├─ syncRegistrationToSheets()   ← Append row to sheet
│  │  │  ├─ isTransientError()           ← Classify errors
│  │  │  └─ initializeGoogleSheet()      ← Create headers
│  │  │
│  │  └─ retryManager.js                 ← Retry logic
│  │     ├─ queueFailedSync()            ← Queue for retry
│  │     ├─ processFailedSyncs()         ← Process retries
│  │     └─ moveToDeadLetter()           ← Move permanent failures
│  │
│  └─ routes/
│     └─ registrations.js                ← Registration endpoint
│        └─ syncRegistrationToGoogleSheets() ← Trigger sync
│
├─ .env                                  ← Configuration
│  ├─ GOOGLE_SHEETS_ID
│  ├─ GOOGLE_SHEETS_SHEET_NAME
│  ├─ GOOGLE_SHEETS_CREDENTIALS_PATH
│  ├─ GOOGLE_SHEETS_MAX_RETRIES
│  ├─ GOOGLE_SHEETS_INITIAL_DELAY_MS
│  └─ GOOGLE_SHEETS_BACKOFF_MULTIPLIER
│
└─ .gitignore
   └─ backend/credentials/               ← Never commit credentials!
```

---

## 🔍 Error Classification

```
ERROR OCCURS
    ↓
    ├─ Network Error?
    │  ├─ ENOTFOUND (DNS failed)
    │  ├─ ETIMEDOUT (Connection timeout)
    │  ├─ ECONNREFUSED (Connection refused)
    │  └─ → TRANSIENT (will retry)
    │
    ├─ HTTP Status Code?
    │  ├─ 429 (Rate limit)
    │  ├─ 5xx (Server error)
    │  └─ → TRANSIENT (will retry)
    │
    │  ├─ 401 (Unauthorized)
    │  ├─ 403 (Forbidden)
    │  ├─ 404 (Not found)
    │  └─ → PERMANENT (won't retry)
    │
    ├─ Timeout Error?
    │  └─ → TRANSIENT (will retry)
    │
    └─ Unknown Error?
       └─ → TRANSIENT (will retry)
```

---

## 📈 Monitoring & Metrics

```
AFTER EACH SYNC OPERATION
    ↓
COLLECT METRICS
    ├─ totalSyncs: 100
    ├─ successfulSyncs: 98
    ├─ failedSyncs: 2
    ├─ successRate: 98.00%
    ├─ failureRate: 2.00%
    ├─ transientErrors: 1
    ├─ permanentErrors: 1
    ├─ totalRetries: 3
    ├─ deadLetterCount: 1
    ├─ lastSyncTime: 2025-10-01T14:35:00Z
    └─ lastErrorTime: 2025-10-01T14:34:00Z
    ↓
LOG METRICS
    ├─ Console output
    ├─ Application logs
    └─ Monitoring system
    ↓
CHECK THRESHOLDS
    ├─ Success rate < 95%? → ALERT
    ├─ Permanent error? → ALERT
    └─ Max retries exceeded? → ALERT
```

---

## ✅ Setup Checklist

```
STEP 1: Google Cloud Setup
  ☐ Create Google Cloud project
  ☐ Enable Google Sheets API
  ☐ Create service account
  ☐ Create and download JSON key
  ☐ Copy service account email

STEP 2: Google Sheets Setup
  ☐ Create new spreadsheet
  ☐ Share with service account email
  ☐ Give "Editor" permissions
  ☐ Copy spreadsheet ID from URL

STEP 3: Application Setup
  ☐ Create backend/credentials/ folder
  ☐ Place JSON file in credentials folder
  ☐ Update .env with configuration
  ☐ Add credentials/ to .gitignore
  ☐ Run database migration

STEP 4: Verification
  ☐ Start application
  ☐ Create test registration
  ☐ Check Google Sheets for new row
  ☐ Verify all columns populated
  ☐ Check application logs for success message
```

---

## 🎯 Key Points

| Item | Details |
|------|---------|
| **Spreadsheet ID** | Found in URL: `docs.google.com/spreadsheets/d/{ID}/edit` |
| **Service Account Email** | Found in JSON credentials file |
| **Credentials File** | Never commit to Git - add to .gitignore |
| **Sync Timing** | < 1 second (typically) |
| **Retry Delays** | 1s, 2s, 4s (exponential backoff) |
| **Max Retries** | 3 (configurable) |
| **Transient Errors** | Network, rate limit, 5xx (will retry) |
| **Permanent Errors** | Auth, 404, invalid (won't retry) |
| **Dead Letter Queue** | For permanently failed syncs |
| **Monitoring** | Metrics logged after each sync |

---

## 🚀 Quick Reference

**To enable Google Sheets sync:**
1. Set `GOOGLE_SHEETS_ID` in .env
2. Set `GOOGLE_SHEETS_CREDENTIALS_PATH` in .env
3. Place credentials JSON file at the path
4. Restart application

**To disable Google Sheets sync:**
1. Remove or comment out `GOOGLE_SHEETS_ID` in .env
2. Restart application

**To check sync status:**
1. Look for `[GoogleSheets]` messages in logs
2. Query `FailedSync` table for pending retries
3. Query `DeadLetterSync` table for permanent failures

**To troubleshoot:**
1. Check credentials file exists and is readable
2. Verify spreadsheet is shared with service account
3. Verify spreadsheet ID is correct
4. Check application logs for error messages
5. Review Google Cloud Console for API errors
