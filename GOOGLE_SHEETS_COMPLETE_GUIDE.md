# Google Sheets Integration - Complete Guide

## 📚 Documentation Overview

This guide explains how to connect your event registration system to Google Sheets for real-time data synchronization.

### Available Documentation

1. **GOOGLE_SHEETS_SUMMARY.md** ← **START HERE**
   - Quick overview of what you need to know
   - 5-step setup process
   - Common issues and solutions

2. **GOOGLE_SHEETS_QUICK_START.md**
   - Step-by-step visual guide
   - Detailed instructions for each step
   - Verification at each stage

3. **GOOGLE_SHEETS_SETUP_CHECKLIST.md**
   - Complete checklist with verification
   - Organized by parts (Google Cloud, Google Sheets, Application)
   - Troubleshooting guide

4. **GOOGLE_SHEETS_ENV_REFERENCE.md**
   - Environment variable reference
   - Configuration scenarios
   - Retry behavior examples

5. **GOOGLE_SHEETS_CONNECTION_DIAGRAM.md**
   - Visual diagrams of the flow
   - Architecture overview
   - Data mapping examples

6. **GOOGLE_SHEETS_SYNC_GUIDE.md**
   - Complete technical guide
   - Monitoring and troubleshooting
   - Performance considerations

---

## 🎯 Quick Start (5 Minutes)

### What You Need

1. **Google Account** - Personal or workspace
2. **Google Cloud Project** - Free tier available
3. **Backend Application** - Already set up
4. **Text Editor** - To edit `.env` file

### The 3 Key IDs

```
1. Spreadsheet ID
   From: https://docs.google.com/spreadsheets/d/{ID}/edit
   Example: 1a2b3c4d5e6f7g8h9i0j

2. Service Account Email
   From: JSON credentials file
   Example: sync@project.iam.gserviceaccount.com

3. Credentials File
   Location: backend/credentials/google-sheets-credentials.json
```

### 5-Step Setup

```
Step 1: Create Google Service Account
        ↓
Step 2: Create Google Spreadsheet
        ↓
Step 3: Place Credentials File
        ↓
Step 4: Configure .env File
        ↓
Step 5: Test & Verify
```

---

## 🔗 How It Works

### Registration Flow

```
User Registers
    ↓
Backend saves to database
    ↓
Confirmation email sent
    ↓
Google Sheets sync triggered
    ↓
New row added to spreadsheet
    ↓
✅ Complete (within 1 second)
```

### What Gets Synced

Each registration creates a row with:
- Ticket ID
- Attendee Name
- Email
- Phone
- Organization
- Role
- Dietary Restrictions
- Accessibility Needs
- Ticket Type
- Event Name
- Registration Timestamp

### Automatic Retry Logic

If sync fails:
```
Attempt 1 → Fails → Wait 1s → Attempt 2
Attempt 2 → Fails → Wait 2s → Attempt 3
Attempt 3 → Fails → Wait 4s → Attempt 4
Attempt 4 → Fails → Dead Letter Queue
```

---

## 📋 Step-by-Step Setup

### Part 1: Google Cloud Console (15 minutes)

**1.1 Create Project**
- Go to https://console.cloud.google.com/
- Click "Select a Project"
- Click "New Project"
- Name: "Event Registration Sync"
- Click "Create"

**1.2 Enable Google Sheets API**
- Go to "APIs & Services" → "Library"
- Search "Google Sheets API"
- Click "Enable"

**1.3 Create Service Account**
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "Service Account"
- Name: "event-registration-sync"
- Click "Create and Continue"
- Skip optional steps
- Click "Done"

**1.4 Create and Download Key**
- Click on service account
- Go to "Keys" tab
- Click "Add Key" → "Create new key"
- Choose "JSON"
- Click "Create"
- Save file securely

**1.5 Copy Service Account Email**
- Open downloaded JSON file
- Find `client_email` field
- Copy the email address

---

### Part 2: Google Sheets (10 minutes)

**2.1 Create Spreadsheet**
- Go to https://sheets.google.com/
- Click "Create" → "Blank spreadsheet"
- Name: "Event Registrations"

**2.2 Share with Service Account**
- Click "Share"
- Paste service account email
- Select "Editor" permission
- Click "Share"

**2.3 Get Spreadsheet ID**
- Copy from URL: `docs.google.com/spreadsheets/d/{ID}/edit`
- Save the ID

**2.4 Verify Sheet Name**
- Default sheet is "Sheet1"
- Optionally rename to "Registrations"

---

### Part 3: Application Setup (10 minutes)

**3.1 Create Credentials Folder**
```bash
cd backend
mkdir credentials
```

**3.2 Place Credentials File**
```bash
cp /path/to/credentials.json backend/credentials/google-sheets-credentials.json
```

**3.3 Update .env File**
```env
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_SHEETS_SHEET_NAME=Registrations
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_MAX_RETRIES=3
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
```

**3.4 Update .gitignore**
```
backend/credentials/
```

**3.5 Run Migration**
```bash
npm run db:migrate
```

---

### Part 4: Verification (5 minutes)

**4.1 Start Application**
```bash
npm run dev
```

**4.2 Create Test Registration**
```bash
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "attendeeName": "Test User",
    "attendeeEmail": "test@example.com",
    "attendeePhone": "+91 98765 43210"
  }'
```

**4.3 Check Logs**
```
[GoogleSheets] Registration synced successfully {
  registrationId: 'reg-123',
  ticketId: 'AHT-2025-00001',
  updatedRows: 1
}
```

**4.4 Verify in Google Sheets**
- Open your spreadsheet
- Look for new row with test data
- All columns should be populated

---

## 🔐 Security Best Practices

### DO ✅

- Keep credentials file in `.gitignore`
- Store credentials in `backend/credentials/` folder
- Use environment variables for paths
- Rotate credentials annually
- Limit service account to specific spreadsheet
- Use strong permissions (Editor only for sync)

### DON'T ❌

- Commit credentials to Git
- Share credentials file
- Use credentials for other purposes
- Share spreadsheet publicly
- Log credentials in error messages
- Hardcode credentials in code

---

## 🧪 Testing

### Test 1: Configuration
```bash
# Check credentials file exists
ls -la backend/credentials/google-sheets-credentials.json

# Check .env has values
grep GOOGLE_SHEETS backend/.env
```

### Test 2: Application
```bash
# Start application
npm run dev

# Check for configuration message
# Should see: "Google Sheets sync configured"
```

### Test 3: Registration
```bash
# Create test registration
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "attendeeName": "Test User",
    "attendeeEmail": "test@example.com",
    "attendeePhone": "+91 98765 43210"
  }'

# Check logs for success
# Should see: "[GoogleSheets] Registration synced successfully"
```

### Test 4: Google Sheets
```
1. Open your spreadsheet
2. Look for new row
3. Verify all data is correct
4. Check timestamp is recent
```

---

## 📊 Monitoring

### Check Sync Status

**In logs:**
```
[Metrics] Sync successful: {
  totalSyncs: 100,
  successfulSyncs: 98,
  failedSyncs: 2,
  successRate: '98.00%'
}
```

### Check Failed Syncs

**In database:**
```sql
-- View pending retries
SELECT * FROM "FailedSync" ORDER BY "nextRetryTime" ASC;

-- View permanently failed syncs
SELECT * FROM "DeadLetterSync" ORDER BY "createdAt" DESC;
```

### Alerts

System logs alerts when:
- Success rate drops below 95%
- Permanent errors occur
- Max retries exceeded

---

## ❌ Troubleshooting

### Issue: "Failed to load Google Sheets credentials"

**Cause:** Credentials file not found

**Solution:**
1. Verify file exists: `backend/credentials/google-sheets-credentials.json`
2. Check file permissions: `ls -la backend/credentials/`
3. Verify JSON is valid
4. Restart application

### Issue: "Authentication failed (401)"

**Cause:** Service account doesn't have permission

**Solution:**
1. Verify spreadsheet is shared with service account email
2. Check permissions are set to "Editor"
3. Verify email matches exactly
4. Try re-sharing the spreadsheet

### Issue: "Sheet not found (404)"

**Cause:** Sheet name doesn't match

**Solution:**
1. Verify sheet name in `.env` matches exactly (case-sensitive)
2. Check sheet exists in spreadsheet
3. Try renaming sheet to "Registrations"
4. Restart application

### Issue: Registrations not syncing

**Cause:** Configuration not set

**Solution:**
1. Check `GOOGLE_SHEETS_ID` is set in `.env`
2. Check `GOOGLE_SHEETS_CREDENTIALS_PATH` is set
3. Check application logs for errors
4. Verify credentials file exists
5. Restart application

### Issue: Rate limit errors (429)

**Cause:** Too many requests to Google API

**Solution:**
1. System automatically retries with backoff
2. Increase `GOOGLE_SHEETS_INITIAL_DELAY_MS` if needed
3. Spread registrations over time if possible
4. Check Google Cloud Console for quota usage

---

## 📁 File Structure

```
backend/
├─ credentials/                          ← Credentials folder
│  └─ google-sheets-credentials.json     ← Your credentials file
│
├─ src/
│  ├─ services/
│  │  ├─ googleSheetsService.js          ← Sync logic
│  │  └─ retryManager.js                 ← Retry logic
│  └─ routes/
│     └─ registrations.js                ← Triggers sync
│
├─ .env                                  ← Configuration
├─ .gitignore                            ← Exclude credentials
└─ prisma/
   └─ schema.prisma                      ← Database models
```

---

## 🔧 Configuration Reference

### Required Variables

```env
GOOGLE_SHEETS_ID=your_spreadsheet_id
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
```

### Optional Variables

```env
GOOGLE_SHEETS_SHEET_NAME=Registrations          # Default: Registrations
GOOGLE_SHEETS_MAX_RETRIES=3                     # Default: 3
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000             # Default: 1000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2              # Default: 2
```

### Configuration Scenarios

**Basic Setup:**
```env
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
```

**High Volume:**
```env
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_MAX_RETRIES=5
GOOGLE_SHEETS_INITIAL_DELAY_MS=500
```

**Rate Limit Issues:**
```env
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_MAX_RETRIES=5
GOOGLE_SHEETS_INITIAL_DELAY_MS=2000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=3
```

---

## ✅ Verification Checklist

- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] Service account created
- [ ] Credentials JSON downloaded
- [ ] Spreadsheet created
- [ ] Spreadsheet shared with service account
- [ ] Credentials file placed in `backend/credentials/`
- [ ] `.env` configured with all values
- [ ] `.gitignore` updated to exclude credentials
- [ ] Database migration run
- [ ] Application started successfully
- [ ] Test registration created
- [ ] New row appears in Google Sheets
- [ ] All data populated correctly
- [ ] Logs show successful sync

---

## 📞 Support Resources

### Documentation Files
- `GOOGLE_SHEETS_SUMMARY.md` - Quick overview
- `GOOGLE_SHEETS_QUICK_START.md` - Step-by-step guide
- `GOOGLE_SHEETS_SETUP_CHECKLIST.md` - Detailed checklist
- `GOOGLE_SHEETS_ENV_REFERENCE.md` - Configuration reference
- `GOOGLE_SHEETS_CONNECTION_DIAGRAM.md` - Visual diagrams
- `GOOGLE_SHEETS_SYNC_GUIDE.md` - Technical guide

### External Resources
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Google Sheets API Quotas](https://developers.google.com/sheets/api/limits)

---

## 🎉 You're Ready!

Once you complete the setup:

1. **Automatic Sync** - Every registration syncs automatically
2. **Real-Time** - Syncs within 1 second
3. **Reliable** - Automatic retries for transient errors
4. **Monitored** - All activity logged
5. **Secure** - Credentials protected

---

## 📈 Next Steps

1. **Read GOOGLE_SHEETS_SUMMARY.md** for quick overview
2. **Follow GOOGLE_SHEETS_QUICK_START.md** for setup
3. **Use GOOGLE_SHEETS_SETUP_CHECKLIST.md** for verification
4. **Reference GOOGLE_SHEETS_ENV_REFERENCE.md** for configuration
5. **Check GOOGLE_SHEETS_SYNC_GUIDE.md** for troubleshooting

---

**Status:** ✅ Ready to implement  
**Estimated setup time:** 30-45 minutes  
**Difficulty level:** Intermediate  
**Last updated:** 2026-05-12
