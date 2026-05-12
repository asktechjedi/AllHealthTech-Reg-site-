# Google Sheets Connection - Summary

## 🎯 What You Need to Know

### The 3 Key IDs

1. **Spreadsheet ID** - Unique identifier for your Google Sheet
   - Found in URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
   - Example: `1a2b3c4d5e6f7g8h9i0j`
   - Where to get: Copy from Google Sheets URL

2. **Service Account Email** - Email that authenticates with Google
   - Format: `name@project-id.iam.gserviceaccount.com`
   - Example: `event-registration-sync@my-project.iam.gserviceaccount.com`
   - Where to get: In the JSON credentials file

3. **Credentials File** - JSON file with authentication keys
   - Name: `google-sheets-credentials.json`
   - Location: `backend/credentials/google-sheets-credentials.json`
   - Where to get: Download from Google Cloud Console

---

## 🔗 How It Works (Simple Version)

```
User Registers
    ↓
Backend saves to database
    ↓
Backend sends email
    ↓
Backend syncs to Google Sheets
    ↓
New row appears in spreadsheet
```

---

## 📋 Setup in 5 Steps

### Step 1: Create Google Service Account
- Go to Google Cloud Console
- Create service account
- Download JSON credentials file
- Copy service account email

### Step 2: Create Google Spreadsheet
- Create new spreadsheet
- Share with service account email
- Copy spreadsheet ID from URL

### Step 3: Place Credentials File
- Create `backend/credentials/` folder
- Place JSON file in folder
- Add folder to `.gitignore`

### Step 4: Configure Environment
- Update `.env` with:
  - `GOOGLE_SHEETS_ID`
  - `GOOGLE_SHEETS_CREDENTIALS_PATH`
  - `GOOGLE_SHEETS_SHEET_NAME`

### Step 5: Run Migration & Start
- Run `npm run db:migrate`
- Start application with `npm run dev`
- Test with a registration

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

## 🔄 Automatic Retry Logic

If sync fails:
1. **Attempt 1** → Wait 1 second → Retry
2. **Attempt 2** → Wait 2 seconds → Retry
3. **Attempt 3** → Wait 4 seconds → Retry
4. **Attempt 4** → Failed → Move to Dead Letter Queue

**Transient errors** (will retry):
- Network issues
- Rate limits (429)
- Server errors (5xx)

**Permanent errors** (won't retry):
- Authentication failed (401)
- Permission denied (403)
- Not found (404)

---

## 📁 File Locations

```
backend/
├─ credentials/
│  └─ google-sheets-credentials.json    ← Your credentials file
├─ .env                                 ← Configuration
├─ .gitignore                           ← Exclude credentials
└─ src/
   ├─ services/
   │  ├─ googleSheetsService.js         ← Sync logic
   │  └─ retryManager.js                ← Retry logic
   └─ routes/
      └─ registrations.js               ← Triggers sync
```

---

## 🔐 Security

**DO:**
- ✅ Keep credentials file in `.gitignore`
- ✅ Store credentials in `backend/credentials/` folder
- ✅ Use environment variables for paths
- ✅ Rotate credentials annually
- ✅ Limit service account to specific spreadsheet

**DON'T:**
- ❌ Commit credentials to Git
- ❌ Share credentials file
- ❌ Use credentials for other purposes
- ❌ Share spreadsheet publicly

---

## 🧪 Testing

**Create a test registration:**
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
```
[GoogleSheets] Registration synced successfully {
  registrationId: 'reg-123',
  ticketId: 'AHT-2025-00001',
  updatedRows: 1
}
```

**Verify in Google Sheets:**
- Open your spreadsheet
- Look for new row with test data

---

## 📊 Monitoring

**Check sync status in logs:**
```
[Metrics] Sync successful: {
  totalSyncs: 100,
  successfulSyncs: 98,
  failedSyncs: 2,
  successRate: '98.00%'
}
```

**Check failed syncs in database:**
```sql
SELECT * FROM "FailedSync" ORDER BY "nextRetryTime" ASC;
SELECT * FROM "DeadLetterSync" ORDER BY "createdAt" DESC;
```

---

## ❌ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Failed to load credentials" | Check file exists at `backend/credentials/google-sheets-credentials.json` |
| "Authentication failed (401)" | Verify spreadsheet is shared with service account email |
| "Sheet not found (404)" | Check sheet name matches exactly (case-sensitive) |
| "Rate limit exceeded (429)" | System retries automatically; increase delay if needed |
| Registrations not syncing | Verify `GOOGLE_SHEETS_ID` and `GOOGLE_SHEETS_CREDENTIALS_PATH` in `.env` |

---

## 📚 Documentation Files

1. **GOOGLE_SHEETS_QUICK_START.md** - Step-by-step setup guide
2. **GOOGLE_SHEETS_SETUP_CHECKLIST.md** - Detailed checklist with verification
3. **GOOGLE_SHEETS_CONNECTION_DIAGRAM.md** - Visual diagrams and flows
4. **GOOGLE_SHEETS_SYNC_GUIDE.md** - Complete technical guide
5. **GOOGLE_SHEETS_IMPLEMENTATION_SUMMARY.md** - Implementation details

---

## 🎯 Key Configuration Values

```env
# Required
GOOGLE_SHEETS_ID=your_spreadsheet_id
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json

# Optional (defaults shown)
GOOGLE_SHEETS_SHEET_NAME=Registrations
GOOGLE_SHEETS_MAX_RETRIES=3
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
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
- [ ] `.gitignore` updated
- [ ] Database migration run
- [ ] Application started
- [ ] Test registration created
- [ ] New row appears in Google Sheets
- [ ] All data populated correctly

---

## 🚀 Next Steps

1. **Follow the setup guide:** `GOOGLE_SHEETS_QUICK_START.md`
2. **Use the checklist:** `GOOGLE_SHEETS_SETUP_CHECKLIST.md`
3. **Test with a registration**
4. **Monitor the logs**
5. **Check Google Sheets for new rows**

---

## 💡 Tips

- **Sync is automatic** - No manual action needed
- **Sync is fast** - Usually < 1 second
- **Sync is reliable** - Automatic retries for transient errors
- **Sync is non-blocking** - Doesn't slow down registration
- **Sync is monitored** - Logs track all activity

---

## 📞 Need Help?

1. Check the troubleshooting section above
2. Review application logs for error messages
3. Check Google Cloud Console for API errors
4. Read the full guide: `GOOGLE_SHEETS_SYNC_GUIDE.md`
5. Contact the development team

---

**Status:** ✅ Ready to implement  
**Estimated setup time:** 30-45 minutes  
**Difficulty level:** Intermediate
