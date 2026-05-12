# 🚀 Google Sheets Integration - START HERE

## What You Need (3 Things)

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  1. SPREADSHEET ID                                           │
│     From: https://docs.google.com/spreadsheets/d/{ID}/edit  │
│     Example: 1a2b3c4d5e6f7g8h9i0j                           │
│                                                               │
│  2. SERVICE ACCOUNT EMAIL                                    │
│     From: JSON credentials file                             │
│     Example: sync@project.iam.gserviceaccount.com            │
│                                                               │
│  3. CREDENTIALS FILE                                         │
│     Location: backend/credentials/                          │
│     google-sheets-credentials.json                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## How It Works (Simple)

```
User Registers
    ↓
Email Sent
    ↓
Google Sheets Updated
    ↓
✅ Done (1 second)
```

---

## Setup in 5 Steps

### Step 1: Google Cloud Console (5 min)
```
1. Go to console.cloud.google.com
2. Create project: "Event Registration Sync"
3. Enable Google Sheets API
4. Create service account
5. Download JSON credentials
```

### Step 2: Google Sheets (5 min)
```
1. Create spreadsheet: "Event Registrations"
2. Share with service account email
3. Copy spreadsheet ID from URL
```

### Step 3: Place Credentials (2 min)
```bash
mkdir backend/credentials
cp credentials.json backend/credentials/google-sheets-credentials.json
```

### Step 4: Configure .env (3 min)
```env
GOOGLE_SHEETS_ID=your_id_here
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
```

### Step 5: Test (5 min)
```bash
npm run dev
# Create test registration
# Check Google Sheets for new row
```

---

## What Gets Synced

```
✅ Ticket ID
✅ Attendee Name
✅ Email
✅ Phone
✅ Organization
✅ Role
✅ Dietary Restrictions
✅ Accessibility Needs
✅ Ticket Type
✅ Event Name
✅ Registration Timestamp
```

---

## Documentation Files

| File | Time | Purpose |
|------|------|---------|
| **GOOGLE_SHEETS_SUMMARY.md** | 5 min | Quick overview |
| **GOOGLE_SHEETS_QUICK_START.md** | 15 min | Step-by-step |
| **GOOGLE_SHEETS_SETUP_CHECKLIST.md** | 30 min | Detailed checklist |
| **GOOGLE_SHEETS_ENV_REFERENCE.md** | 10 min | Configuration |
| **GOOGLE_SHEETS_CONNECTION_DIAGRAM.md** | 15 min | Visual diagrams |
| **GOOGLE_SHEETS_SYNC_GUIDE.md** | 20 min | Technical guide |
| **GOOGLE_SHEETS_COMPLETE_GUIDE.md** | 30 min | Everything |

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Failed to load credentials" | Check file exists at `backend/credentials/google-sheets-credentials.json` |
| "Authentication failed (401)" | Verify spreadsheet is shared with service account email |
| "Sheet not found (404)" | Check sheet name matches exactly (case-sensitive) |
| Registrations not syncing | Verify `GOOGLE_SHEETS_ID` is set in `.env` |

---

## Security Checklist

- [ ] Credentials file in `.gitignore`
- [ ] Credentials file NOT committed to Git
- [ ] Spreadsheet shared with service account only
- [ ] Service account has "Editor" permission
- [ ] `.env` file NOT committed to Git

---

## Next Steps

### Option 1: Quick Setup (30 min)
1. Read: **GOOGLE_SHEETS_SUMMARY.md** (5 min)
2. Follow: **GOOGLE_SHEETS_QUICK_START.md** (15 min)
3. Verify: **GOOGLE_SHEETS_SETUP_CHECKLIST.md** (10 min)

### Option 2: Detailed Setup (60 min)
1. Read: **GOOGLE_SHEETS_COMPLETE_GUIDE.md** (30 min)
2. Follow: **GOOGLE_SHEETS_SETUP_CHECKLIST.md** (30 min)

### Option 3: Reference Only
1. Use: **GOOGLE_SHEETS_ENV_REFERENCE.md** (for configuration)
2. Use: **GOOGLE_SHEETS_SYNC_GUIDE.md** (for troubleshooting)

---

## Key Files

```
backend/
├─ credentials/
│  └─ google-sheets-credentials.json    ← Your credentials
├─ .env                                 ← Configuration
├─ .gitignore                           ← Exclude credentials
└─ src/services/
   ├─ googleSheetsService.js            ← Sync logic
   └─ retryManager.js                   ← Retry logic
```

---

## Configuration Template

```env
# Copy this to your .env file and fill in the values

GOOGLE_SHEETS_ID=
GOOGLE_SHEETS_SHEET_NAME=Registrations
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_MAX_RETRIES=3
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
```

---

## Automatic Retry Logic

```
Attempt 1 → Fails
  ↓ Wait 1 second
Attempt 2 → Fails
  ↓ Wait 2 seconds
Attempt 3 → Fails
  ↓ Wait 4 seconds
Attempt 4 → Fails
  ↓ Dead Letter Queue
```

---

## Testing

```bash
# 1. Start application
npm run dev

# 2. Create test registration
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "attendeeName": "Test User",
    "attendeeEmail": "test@example.com",
    "attendeePhone": "+91 98765 43210"
  }'

# 3. Check logs for success
# Should see: "[GoogleSheets] Registration synced successfully"

# 4. Check Google Sheets
# Should see new row with test data
```

---

## Monitoring

```
Check logs:
[Metrics] Sync successful: {
  totalSyncs: 100,
  successfulSyncs: 98,
  failedSyncs: 2,
  successRate: '98.00%'
}

Check database:
SELECT * FROM "FailedSync" ORDER BY "nextRetryTime" ASC;
SELECT * FROM "DeadLetterSync" ORDER BY "createdAt" DESC;
```

---

## 🎯 Choose Your Path

### 👨‍💻 I'm a Developer
→ Read **GOOGLE_SHEETS_QUICK_START.md**

### 📋 I want a Checklist
→ Use **GOOGLE_SHEETS_SETUP_CHECKLIST.md**

### ⚙️ I need Configuration Help
→ Reference **GOOGLE_SHEETS_ENV_REFERENCE.md**

### 🏗️ I want to Understand Architecture
→ Read **GOOGLE_SHEETS_CONNECTION_DIAGRAM.md**

### 🔧 I need to Troubleshoot
→ Check **GOOGLE_SHEETS_SYNC_GUIDE.md**

### 📚 I want Everything
→ Read **GOOGLE_SHEETS_COMPLETE_GUIDE.md**

---

## ✅ Verification Checklist

- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] Service account created
- [ ] Credentials JSON downloaded
- [ ] Spreadsheet created
- [ ] Spreadsheet shared with service account
- [ ] Credentials file placed in `backend/credentials/`
- [ ] `.env` configured
- [ ] `.gitignore` updated
- [ ] Database migration run
- [ ] Application started
- [ ] Test registration created
- [ ] New row in Google Sheets
- [ ] All data populated

---

## 📞 Need Help?

1. **Quick question?** → Check **GOOGLE_SHEETS_SUMMARY.md**
2. **Setup issue?** → Follow **GOOGLE_SHEETS_QUICK_START.md**
3. **Configuration?** → Reference **GOOGLE_SHEETS_ENV_REFERENCE.md**
4. **Troubleshooting?** → Read **GOOGLE_SHEETS_SYNC_GUIDE.md**
5. **Everything?** → Read **GOOGLE_SHEETS_COMPLETE_GUIDE.md**

---

## 🚀 Ready?

**Estimated time:** 30-45 minutes  
**Difficulty:** Intermediate  
**Status:** ✅ Ready to implement

**Start with:** GOOGLE_SHEETS_SUMMARY.md

---

**Last updated:** 2026-05-12  
**Version:** 1.0
