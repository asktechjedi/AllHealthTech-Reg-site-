# Google Sheets Setup - Final Checklist ✅

## Your Configuration

```
✅ Spreadsheet ID: 111088255104733608101
✅ Service Account Email: aht-538@event-registration-sync.iam.gserviceaccount.com
✅ Project: AHT Registration Sync - Google Sheets
✅ Environment Variables: Updated in .env
```

---

## 3 Steps to Complete Setup

### ✅ STEP 1: Download & Place Credentials File (2 minutes)

**What to do:**
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Select project: "AHT Registration Sync - Google Sheets"
3. Go to "APIs & Services" → "Credentials"
4. Click service account: "aht-538"
5. Go to "Keys" tab
6. Download JSON key (or create new one if needed)
7. Save as: `backend/credentials/google-sheets-credentials.json`

**Verify:**
```bash
ls -la backend/credentials/google-sheets-credentials.json
```

**Checklist:**
- [ ] JSON file downloaded
- [ ] File placed in `backend/credentials/`
- [ ] File is readable
- [ ] File contains valid JSON

---

### ✅ STEP 2: Share Google Sheet (2 minutes)

**What to do:**
1. Open your spreadsheet: https://docs.google.com/spreadsheets/d/111088255104733608101/edit
2. Click "Share" button (top right)
3. Paste email: `aht-538@event-registration-sync.iam.gserviceaccount.com`
4. Select "Editor" permission
5. Uncheck "Notify people"
6. Click "Share"

**Verify:**
- [ ] Spreadsheet opened
- [ ] Service account email pasted
- [ ] "Editor" permission selected
- [ ] Share completed

---

### ✅ STEP 3: Test & Verify (5 minutes)

**Run migration:**
```bash
cd backend
npm run db:migrate
```

**Start application:**
```bash
npm run dev
```

**Create test registration:**
```bash
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "attendeeName": "Test User",
    "attendeeEmail": "test@example.com",
    "attendeePhone": "+91 98765 43210"
  }'
```

**Check logs:**
Look for this message:
```
[GoogleSheets] Registration synced successfully {
  registrationId: 'reg-123',
  ticketId: 'AHT-2025-00001',
  updatedRows: 1
}
```

**Check Google Sheet:**
1. Open your spreadsheet
2. Look for new row with test data
3. Verify all columns are populated

**Checklist:**
- [ ] Migration completed
- [ ] Application started
- [ ] Test registration created
- [ ] Success message in logs
- [ ] New row in Google Sheet
- [ ] All data populated

---

## Configuration Verification

### .env File
```bash
grep GOOGLE_SHEETS backend/.env
```

Should show:
```
GOOGLE_SHEETS_ID=111088255104733608101
GOOGLE_SHEETS_SHEET_NAME=Registrations
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_MAX_RETRIES=3
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
```

**Checklist:**
- [ ] All 6 variables present
- [ ] Spreadsheet ID correct
- [ ] Credentials path correct
- [ ] No typos

---

## Security Verification

**Check .gitignore:**
```bash
grep "credentials/" backend/.gitignore
```

Should show:
```
backend/credentials/
```

**Checklist:**
- [ ] credentials/ in .gitignore
- [ ] Credentials file NOT committed
- [ ] .env file NOT committed
- [ ] Only JSON file in credentials folder

---

## Final Verification Checklist

### Setup Complete
- [ ] Spreadsheet ID: 111088255104733608101
- [ ] Service Account Email: aht-538@event-registration-sync.iam.gserviceaccount.com
- [ ] Credentials file placed in backend/credentials/
- [ ] .env file updated with all variables
- [ ] .gitignore updated to exclude credentials

### Testing Complete
- [ ] Database migration run
- [ ] Application started successfully
- [ ] Test registration created
- [ ] Logs show successful sync
- [ ] New row in Google Sheet
- [ ] All data populated correctly

### Security Complete
- [ ] Credentials file in .gitignore
- [ ] Credentials file NOT committed to Git
- [ ] .env file NOT committed to Git
- [ ] Spreadsheet shared with service account only
- [ ] Service account has "Editor" permission

---

## What Happens Next

### Automatic Sync
Every time someone registers:
1. ✅ Registration saved to database
2. ✅ Confirmation email sent
3. ✅ Google Sheet updated
4. ✅ All within 1 second

### Automatic Retry
If sync fails:
1. ✅ Retry after 1 second
2. ✅ Retry after 2 seconds
3. ✅ Retry after 4 seconds
4. ✅ Move to dead letter queue if all fail

### Monitoring
- ✅ Logs show all sync activity
- ✅ Metrics tracked in database
- ✅ Failed syncs queued for retry
- ✅ Permanent failures logged

---

## Troubleshooting

### If credentials file not found:
```bash
# Check file exists
ls -la backend/credentials/google-sheets-credentials.json

# Check permissions
chmod 600 backend/credentials/google-sheets-credentials.json

# Verify JSON is valid
cat backend/credentials/google-sheets-credentials.json | jq .
```

### If authentication fails:
1. Verify spreadsheet is shared with: `aht-538@event-registration-sync.iam.gserviceaccount.com`
2. Check permission is "Editor"
3. Try re-sharing the spreadsheet
4. Restart application

### If registrations not syncing:
1. Check `GOOGLE_SHEETS_ID` in .env
2. Check `GOOGLE_SHEETS_CREDENTIALS_PATH` in .env
3. Check application logs for errors
4. Verify credentials file exists
5. Restart application

---

## Quick Reference

| Item | Value |
|------|-------|
| Spreadsheet ID | 111088255104733608101 |
| Service Account | aht-538@event-registration-sync.iam.gserviceaccount.com |
| Credentials Path | ./credentials/google-sheets-credentials.json |
| Sheet Name | Registrations |
| Max Retries | 3 |
| Retry Delays | 1s, 2s, 4s |

---

## Status

✅ **Configuration:** Complete  
✅ **Environment Variables:** Updated  
⏳ **Credentials File:** Awaiting download  
⏳ **Google Sheet:** Awaiting share  
⏳ **Testing:** Awaiting verification  

---

## Next Action

👉 **Download credentials JSON file and place in `backend/credentials/`**

Then follow the 3 steps above to complete setup.

---

**Estimated time to complete:** 10 minutes  
**Difficulty:** Easy  
**Status:** Ready to proceed
