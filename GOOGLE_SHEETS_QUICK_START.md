# Google Sheets Connection - Quick Start Guide

## 🎯 What You Need

1. **Google Spreadsheet ID** - The unique ID of your Google Sheet
2. **Service Account Credentials** - JSON file with authentication keys
3. **Environment Variables** - Configuration in your `.env` file

---

## 📋 Step-by-Step Setup

### Step 1: Get Your Spreadsheet ID

**Where to find it:**
```
URL: https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
                                          ↑ This is your Spreadsheet ID
```

**Copy this ID** - you'll need it in Step 4.

---

### Step 2: Create Google Service Account

**Go to:** https://console.cloud.google.com/

**Follow these steps:**

1. **Create Project** (if needed)
   - Click "Select a Project" at top
   - Click "New Project"
   - Name it (e.g., "Event Registration")
   - Click "Create"

2. **Enable Google Sheets API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click on it
   - Click "Enable"

3. **Create Service Account**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Fill in details:
     - Service account name: `event-registration-sync`
     - Click "Create and Continue"
   - Skip optional steps
   - Click "Done"

4. **Create and Download Key**
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON" format
   - Click "Create"
   - **Save this file securely** - it contains your credentials

---

### Step 3: Share Google Sheet with Service Account

**In the JSON file you downloaded, find:**
```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "event-registration-sync@your-project.iam.gserviceaccount.com",
  ...
}
```

**Copy the `client_email` value** (looks like: `event-registration-sync@your-project.iam.gserviceaccount.com`)

**In Google Sheets:**
1. Open your spreadsheet
2. Click "Share" button (top right)
3. Paste the `client_email` in the share dialog
4. Give "Editor" permissions
5. Click "Share"

---

### Step 4: Configure Your Application

**Create credentials folder:**
```bash
mkdir backend/credentials
```

**Copy the JSON file:**
```bash
# Copy your downloaded credentials.json to:
cp /path/to/credentials.json backend/credentials/google-sheets-credentials.json
```

**Update `.env` file:**
```env
# Google Sheets Configuration
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_SHEETS_SHEET_NAME=Registrations
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_MAX_RETRIES=3
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
```

**Add to `.gitignore`:**
```
backend/credentials/
```

---

### Step 5: Initialize Database

```bash
cd backend
npm run db:migrate
```

This creates the tables for tracking failed syncs.

---

### Step 6: Start Your Application

```bash
npm run dev
```

The system will automatically:
- ✅ Connect to Google Sheets
- ✅ Sync registrations in real-time
- ✅ Retry failed syncs automatically
- ✅ Log all sync activity

---

## 🔍 How It Works

### Registration Flow with Google Sheets Sync

```
User Registers
    ↓
Registration Created in Database
    ↓
Confirmation Email Sent
    ↓
Google Sheets Sync Triggered
    ↓
Data Appended to Google Sheet
    ↓
✅ Complete (within 5 seconds)
```

### What Gets Synced

Each registration row includes:
- **Ticket ID** - Unique identifier (e.g., AHT-2025-00001)
- **Attendee Name** - Full name
- **Email** - Contact email
- **Phone** - Contact phone
- **Organization** - Company/organization
- **Role** - Job title/role
- **Dietary Restrictions** - Any dietary needs
- **Accessibility Needs** - Any accessibility requirements
- **Ticket Type** - Type of ticket purchased
- **Event Name** - Which event they registered for
- **Registration Timestamp** - When they registered

---

## 🔄 Retry Logic

If sync fails (network issue, rate limit, etc.):

```
Sync Attempt 1 → Fails
    ↓ (wait 1 second)
Sync Attempt 2 → Fails
    ↓ (wait 2 seconds)
Sync Attempt 3 → Fails
    ↓ (wait 4 seconds)
Sync Attempt 4 → Fails
    ↓
Moved to Dead Letter Queue (for manual review)
```

---

## 📊 Monitoring

### Check Sync Status

**View in logs:**
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

---

## ❌ Troubleshooting

### "Failed to load Google Sheets credentials"
- ✅ Check file exists: `backend/credentials/google-sheets-credentials.json`
- ✅ Check file permissions (should be readable)
- ✅ Verify JSON file is valid

### "Authentication failed (401)"
- ✅ Verify spreadsheet is shared with service account email
- ✅ Check service account has "Editor" permissions
- ✅ Verify email matches exactly

### "Sheet not found (404)"
- ✅ Check sheet name matches exactly (case-sensitive)
- ✅ Verify sheet exists in spreadsheet
- ✅ System will create sheet with headers if missing

### "Rate limit exceeded (429)"
- ✅ System automatically retries with backoff
- ✅ Increase `GOOGLE_SHEETS_INITIAL_DELAY_MS` if needed
- ✅ Spread registrations over time if possible

### Registrations not syncing
- ✅ Verify `GOOGLE_SHEETS_ID` is set
- ✅ Verify `GOOGLE_SHEETS_CREDENTIALS_PATH` is set
- ✅ Check application logs for errors
- ✅ Restart application after setting variables

---

## 🔐 Security Best Practices

1. **Never commit credentials to Git**
   - Add `backend/credentials/` to `.gitignore`
   - Use environment variables for paths

2. **Rotate credentials annually**
   - Create new key in Google Cloud Console
   - Update environment variable
   - Delete old key

3. **Limit permissions**
   - Only grant "Editor" access to the specific spreadsheet
   - Don't use service account for other purposes

4. **Protect the spreadsheet**
   - Don't share publicly
   - Use Google Sheets sharing controls
   - Enable version history for audit trail

---

## 📚 Reference

| Item | Value |
|------|-------|
| Spreadsheet ID | From URL: `docs.google.com/spreadsheets/d/{ID}/edit` |
| Service Account Email | From JSON credentials file |
| Credentials File | `backend/credentials/google-sheets-credentials.json` |
| Sheet Name | `Registrations` (default) |
| Sync Latency | < 1 second (typically) |
| Max Retries | 3 (configurable) |
| Retry Delays | 1s, 2s, 4s (exponential backoff) |

---

## ✅ Verification Checklist

- [ ] Spreadsheet ID copied
- [ ] Service account created
- [ ] Google Sheets API enabled
- [ ] Credentials JSON downloaded
- [ ] Spreadsheet shared with service account
- [ ] Credentials file placed in `backend/credentials/`
- [ ] `.env` file updated with configuration
- [ ] `.gitignore` updated to exclude credentials
- [ ] Database migrated (`npm run db:migrate`)
- [ ] Application started (`npm run dev`)
- [ ] First registration synced to Google Sheets

---

## 🎉 You're All Set!

Once you complete these steps, your registrations will automatically sync to Google Sheets in real-time. Each registration will appear as a new row with all attendee information.

**Questions?** Check the full guide: `GOOGLE_SHEETS_SYNC_GUIDE.md`
