# Your Google Sheets Setup - Configuration Complete ✅

## Your Configuration Details

```
Project Name: AHT Registration Sync - Google Sheets
Spreadsheet ID: 111088255104733608101
Service Account Email: aht-538@event-registration-sync.iam.gserviceaccount.com
```

---

## ✅ What's Been Done

### 1. Environment Variables Updated
Your `.env` file has been updated with:
```env
GOOGLE_SHEETS_ID=111088255104733608101
GOOGLE_SHEETS_SHEET_NAME=Registrations
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_MAX_RETRIES=3
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
```

---

## 📋 Next Steps (3 Steps Only)

### Step 1: Place Your Credentials File (2 minutes)

You need to download the JSON credentials file from Google Cloud Console and place it here:

```bash
# Create credentials folder
mkdir backend/credentials

# Place your JSON file here:
# backend/credentials/google-sheets-credentials.json
```

**Where to get the JSON file:**
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Select your project: "AHT Registration Sync - Google Sheets"
3. Go to "APIs & Services" → "Credentials"
4. Click on service account: "aht-538"
5. Go to "Keys" tab
6. If you don't have a key, click "Add Key" → "Create new key" → "JSON"
7. Download the JSON file
8. Save it as: `backend/credentials/google-sheets-credentials.json`

### Step 2: Share Your Google Sheet (2 minutes)

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/111088255104733608101/edit
2. Click "Share" button (top right)
3. Paste this email: `aht-538@event-registration-sync.iam.gserviceaccount.com`
4. Select "Editor" permission
5. Uncheck "Notify people"
6. Click "Share"

### Step 3: Run Migration & Test (5 minutes)

```bash
# Navigate to backend
cd backend

# Run database migration
npm run db:migrate

# Start application
npm run dev

# In another terminal, create test registration:
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "attendeeName": "Test User",
    "attendeeEmail": "test@example.com",
    "attendeePhone": "+91 98765 43210"
  }'

# Check logs for success:
# Should see: "[GoogleSheets] Registration synced successfully"

# Check your Google Sheet:
# Should see new row with test data
```

---

## 🔍 Verification

### Check 1: Credentials File
```bash
ls -la backend/credentials/google-sheets-credentials.json
```
Should show the file exists and is readable.

### Check 2: Environment Variables
```bash
grep GOOGLE_SHEETS backend/.env
```
Should show all 6 Google Sheets variables.

### Check 3: Application Logs
When you run `npm run dev`, you should see:
```
[GoogleSheets] Registration synced successfully {
  registrationId: 'reg-123',
  ticketId: 'AHT-2025-00001',
  updatedRows: 1
}
```

### Check 4: Google Sheet
Open your spreadsheet and look for:
- Row 1: Headers (Ticket ID, Attendee Name, Email, etc.)
- Row 2+: Your registration data

---

## 📊 What Will Happen

When someone registers:

```
1. Registration form submitted
   ↓
2. Backend saves to database
   ↓
3. Confirmation email sent
   ↓
4. Google Sheets sync triggered
   ↓
5. New row added to your spreadsheet
   ↓
✅ Complete (within 1 second)
```

---

## 🔄 Automatic Retry Logic

If sync fails (network issue, rate limit, etc.):

```
Attempt 1 → Fails → Wait 1 second
Attempt 2 → Fails → Wait 2 seconds
Attempt 3 → Fails → Wait 4 seconds
Attempt 4 → Fails → Dead Letter Queue
```

The system automatically retries transient errors (network, rate limit, server errors).

---

## 📊 What Gets Synced

Each registration creates a new row with:
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

---

## ❌ Troubleshooting

### Issue: "Failed to load credentials"
**Solution:** 
- Verify file exists: `backend/credentials/google-sheets-credentials.json`
- Check file is readable: `ls -la backend/credentials/`
- Verify JSON is valid (open and check for syntax errors)

### Issue: "Authentication failed (401)"
**Solution:**
- Verify spreadsheet is shared with: `aht-538@event-registration-sync.iam.gserviceaccount.com`
- Check permission is set to "Editor"
- Try re-sharing the spreadsheet

### Issue: Registrations not syncing
**Solution:**
- Check `GOOGLE_SHEETS_ID` is set in `.env`
- Check `GOOGLE_SHEETS_CREDENTIALS_PATH` is set
- Check application logs for errors
- Restart application

---

## 🔐 Security

### DO ✅
- Keep credentials file in `.gitignore`
- Never commit credentials to Git
- Store credentials in `backend/credentials/` folder
- Rotate credentials annually

### DON'T ❌
- Share credentials file
- Commit to Git
- Use for other purposes
- Share spreadsheet publicly

---

## 📝 Your Configuration Summary

| Item | Value |
|------|-------|
| Spreadsheet ID | 111088255104733608101 |
| Service Account Email | aht-538@event-registration-sync.iam.gserviceaccount.com |
| Sheet Name | Registrations |
| Credentials Path | ./credentials/google-sheets-credentials.json |
| Max Retries | 3 |
| Initial Delay | 1000 ms (1 second) |
| Backoff Multiplier | 2 |

---

## ✅ Quick Checklist

- [ ] JSON credentials file downloaded
- [ ] Credentials file placed in `backend/credentials/`
- [ ] Google Sheet shared with service account email
- [ ] Service account has "Editor" permission
- [ ] `.env` file has all Google Sheets variables
- [ ] Database migration run (`npm run db:migrate`)
- [ ] Application started (`npm run dev`)
- [ ] Test registration created
- [ ] New row appears in Google Sheet
- [ ] All data populated correctly

---

## 🎉 You're Ready!

Once you complete the 3 steps above, your Google Sheets sync will be working automatically.

Every registration will:
1. Be saved to your database
2. Send a confirmation email
3. Sync to your Google Sheet
4. All within 1 second

---

## 📞 Need Help?

Refer to these guides:
- **GOOGLE_SHEETS_QUICK_START.md** - Step-by-step guide
- **GOOGLE_SHEETS_SYNC_GUIDE.md** - Technical details
- **GOOGLE_SHEETS_ENV_REFERENCE.md** - Configuration reference

---

**Status:** ✅ Configuration Complete  
**Next:** Download credentials file and place in `backend/credentials/`  
**Time to complete:** 10 minutes
