# Google Sheets Setup - Verification & Testing

## ✅ Current Status

### Database Migration
✅ **Status:** Complete  
- FailedSync table: Ready
- DeadLetterSync table: Ready
- Prisma Client: Generated

### Environment Configuration
✅ **Status:** Complete  
```
GOOGLE_SHEETS_ID=111088255104733608101
GOOGLE_SHEETS_SHEET_NAME=Registrations
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_MAX_RETRIES=3
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
```

### Credentials Folder
✅ **Status:** Created  
- Location: `backend/credentials/`
- Ready to receive JSON file

---

## 📋 What You Need to Do Now

### Step 1: Download Credentials JSON (2 minutes)

**From Google Cloud Console:**
1. Go to: https://console.cloud.google.com/
2. Select project: "AHT Registration Sync - Google Sheets"
3. Navigate to: APIs & Services → Credentials
4. Click service account: "aht-538"
5. Go to: Keys tab
6. Download: JSON key

**Save the file as:**
```
backend/credentials/google-sheets-credentials.json
```

**Verify file exists:**
```bash
ls -la backend/credentials/google-sheets-credentials.json
```

---

### Step 2: Share Google Sheet (2 minutes)

**In Google Sheets:**
1. Open: https://docs.google.com/spreadsheets/d/111088255104733608101/edit
2. Click: Share button (top right)
3. Paste email: `aht-538@event-registration-sync.iam.gserviceaccount.com`
4. Select: Editor permission
5. Uncheck: "Notify people"
6. Click: Share

**Verify sharing:**
- Service account email appears in share list
- Permission shows "Editor"

---

### Step 3: Test the Setup (5 minutes)

**Start the application:**
```bash
cd backend
npm run dev
```

**Expected output:**
```
Server running on port 3000
Database connected
Google Sheets sync configured
```

**Create a test registration:**
```bash
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "attendeeName": "Test User",
    "attendeeEmail": "test@example.com",
    "attendeePhone": "+91 98765 43210",
    "organization": "Test Org",
    "role": "Tester"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "registrationId": "reg-123",
  "ticketId": "AHT-2025-00001"
}
```

---

## 🔍 Verification Checklist

### Configuration Files
- [ ] `.env` has all 6 Google Sheets variables
- [ ] `GOOGLE_SHEETS_ID` = 111088255104733608101
- [ ] `GOOGLE_SHEETS_CREDENTIALS_PATH` = ./credentials/google-sheets-credentials.json
- [ ] `backend/credentials/` folder exists

### Credentials File
- [ ] JSON file downloaded from Google Cloud
- [ ] File saved as: `backend/credentials/google-sheets-credentials.json`
- [ ] File is readable: `ls -la backend/credentials/google-sheets-credentials.json`
- [ ] File contains valid JSON

### Google Sheet
- [ ] Spreadsheet opened: https://docs.google.com/spreadsheets/d/111088255104733608101/edit
- [ ] Shared with: aht-538@event-registration-sync.iam.gserviceaccount.com
- [ ] Permission: Editor
- [ ] Sheet name: "Registrations" (or verify actual name)

### Application
- [ ] Application starts: `npm run dev`
- [ ] No error messages in logs
- [ ] Server listening on port 3000

### Test Registration
- [ ] Test registration created successfully
- [ ] Response includes registrationId and ticketId
- [ ] Check logs for sync message

### Google Sheet Verification
- [ ] Open your Google Sheet
- [ ] Look for new row with test data
- [ ] Verify columns:
  - [ ] Ticket ID
  - [ ] Attendee Name
  - [ ] Email
  - [ ] Phone
  - [ ] Organization
  - [ ] Role
  - [ ] Dietary Restrictions
  - [ ] Accessibility Needs
  - [ ] Ticket Type
  - [ ] Event Name
  - [ ] Registration Timestamp

---

## 📊 Expected Logs

### Application Start
```
[GoogleSheets] Configuration loaded:
  Spreadsheet ID: 111088255104733608101
  Sheet Name: Registrations
  Credentials Path: ./credentials/google-sheets-credentials.json
```

### Successful Registration
```
[Registration] Registration created:
  ID: reg-123
  Ticket ID: AHT-2025-00001
  Email: test@example.com

[GoogleSheets] Registration synced successfully {
  registrationId: 'reg-123',
  ticketId: 'AHT-2025-00001',
  updatedRows: 1
}

[Metrics] Sync successful: {
  totalSyncs: 1,
  successfulSyncs: 1,
  failedSyncs: 0,
  successRate: '100.00%'
}
```

---

## ❌ Troubleshooting

### Issue: "Failed to load Google Sheets credentials"

**Cause:** Credentials file not found or invalid path

**Solution:**
1. Verify file exists: `ls -la backend/credentials/google-sheets-credentials.json`
2. Check file permissions: `chmod 600 backend/credentials/google-sheets-credentials.json`
3. Verify JSON is valid: `cat backend/credentials/google-sheets-credentials.json | jq .`
4. Restart application

### Issue: "Authentication failed (401)"

**Cause:** Service account doesn't have permission to access spreadsheet

**Solution:**
1. Verify spreadsheet is shared with: `aht-538@event-registration-sync.iam.gserviceaccount.com`
2. Check permission is set to "Editor"
3. Try re-sharing the spreadsheet
4. Restart application

### Issue: "Sheet not found (404)"

**Cause:** Sheet name doesn't match

**Solution:**
1. Verify sheet name in `.env` matches exactly (case-sensitive)
2. Check sheet exists in spreadsheet
3. Try renaming sheet to "Registrations"
4. Restart application

### Issue: Registrations not syncing

**Cause:** Configuration not set or credentials file missing

**Solution:**
1. Check `GOOGLE_SHEETS_ID` is set in `.env`
2. Check `GOOGLE_SHEETS_CREDENTIALS_PATH` is set
3. Verify credentials file exists
4. Check application logs for errors
5. Restart application

---

## 🔐 Security Verification

### Credentials Protection
- [ ] Credentials file in `.gitignore`
- [ ] Credentials file NOT committed to Git
- [ ] Only JSON file in credentials folder
- [ ] No credentials in .env file

### Spreadsheet Security
- [ ] Spreadsheet shared with service account only
- [ ] Service account has "Editor" permission
- [ ] Spreadsheet NOT shared publicly
- [ ] No other users have access

---

## 📈 Monitoring

### Check Sync Status
```bash
# View application logs
npm run dev

# Look for [GoogleSheets] messages
```

### Check Database
```sql
-- View pending retries
SELECT * FROM "FailedSync" ORDER BY "nextRetryTime" ASC;

-- View permanently failed syncs
SELECT * FROM "DeadLetterSync" ORDER BY "createdAt" DESC;
```

### Check Google Sheet
1. Open your spreadsheet
2. Look for new rows
3. Verify data is correct
4. Check timestamps are recent

---

## ✅ Success Criteria

All of the following should be true:

1. ✅ Application starts without errors
2. ✅ Test registration created successfully
3. ✅ Logs show successful sync message
4. ✅ New row appears in Google Sheet
5. ✅ All columns populated correctly
6. ✅ Timestamp is recent
7. ✅ No error messages in logs

---

## 🎉 You're Ready!

Once you complete the 3 steps above and verify everything:

✅ Google Sheets sync is working  
✅ Real-time updates enabled  
✅ Automatic retry logic active  
✅ Monitoring in place  

Every registration will now automatically sync to your Google Sheet!

---

## 📞 Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Review application logs for error messages
3. Verify all configuration values
4. Check Google Cloud Console for API errors
5. Refer to: `GOOGLE_SHEETS_SYNC_GUIDE.md`

---

**Status:** Ready for final verification  
**Next:** Download credentials file and complete 3 steps  
**Time:** 10 minutes
