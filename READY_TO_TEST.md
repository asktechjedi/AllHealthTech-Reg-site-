# 🚀 Google Sheets Integration - Ready to Test!

## ✅ Everything is Prepared

Your Google Sheets integration is **ready to test**. All backend setup is complete.

---

## 📋 Current Status

### ✅ Database
- Migration complete
- FailedSync table created
- DeadLetterSync table created
- Prisma Client generated

### ✅ Environment Configuration
- All 6 Google Sheets variables added to `.env`
- Spreadsheet ID: `111088255104733608101`
- Service Account: `aht-538@event-registration-sync.iam.gserviceaccount.com`
- Credentials path: `./credentials/google-sheets-credentials.json`

### ✅ Credentials Folder
- Created: `backend/credentials/`
- Ready to receive JSON file

### ✅ Code Implementation
- Google Sheets service: Ready
- Retry logic: Ready
- Metrics tracking: Ready
- Integration: Ready

---

## 🎯 Final 3 Steps (10 minutes)

### Step 1: Download Credentials (2 min)

**From Google Cloud Console:**
```
1. Go to: https://console.cloud.google.com/
2. Select: "AHT Registration Sync - Google Sheets"
3. Go to: APIs & Services → Credentials
4. Click: Service account "aht-538"
5. Go to: Keys tab
6. Download: JSON key
7. Save as: backend/credentials/google-sheets-credentials.json
```

### Step 2: Share Google Sheet (2 min)

**In Google Sheets:**
```
1. Open: https://docs.google.com/spreadsheets/d/111088255104733608101/edit
2. Click: Share button
3. Paste: aht-538@event-registration-sync.iam.gserviceaccount.com
4. Select: Editor permission
5. Click: Share
```

### Step 3: Test (5 min)

**Start application:**
```bash
cd backend
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

**Verify:**
- Check logs for: `[GoogleSheets] Registration synced successfully`
- Check Google Sheet for new row
- Verify all data populated

---

## 📊 What Will Sync

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

---

## 🔄 Automatic Features

✅ **Real-time Sync** - Within 1 second  
✅ **Automatic Retry** - Exponential backoff (1s, 2s, 4s)  
✅ **Error Handling** - Dead letter queue  
✅ **Monitoring** - Logs all activity  
✅ **Metrics** - Tracks success rate  

---

## 📚 Documentation

**For testing:**
- `GOOGLE_SHEETS_SETUP_VERIFICATION.md` - Verification checklist
- `GOOGLE_SHEETS_YOUR_SETUP.md` - Your specific setup

**For reference:**
- `GOOGLE_SHEETS_SYNC_GUIDE.md` - Technical guide
- `GOOGLE_SHEETS_ENV_REFERENCE.md` - Configuration

---

## ✨ Configuration Summary

```
Project:           AHT Registration Sync - Google Sheets
Spreadsheet ID:    111088255104733608101
Service Account:   aht-538@event-registration-sync.iam.gserviceaccount.com
Sheet Name:        Registrations
Credentials Path:  ./credentials/google-sheets-credentials.json
Max Retries:       3
Retry Delays:      1s, 2s, 4s
Status:            ✅ Ready to test
```

---

## 🎉 Next Action

👉 **Download credentials JSON file**  
👉 **Place in `backend/credentials/google-sheets-credentials.json`**  
👉 **Share Google Sheet with service account**  
👉 **Run `npm run dev` and test**  

---

**Time to complete:** 10 minutes  
**Status:** ✅ Ready for testing  
**Next:** Download credentials file
