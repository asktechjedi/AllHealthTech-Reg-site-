# Google Sheets Setup - Complete Checklist

## 📋 Pre-Setup Requirements

- [ ] Google account (personal or workspace)
- [ ] Access to Google Cloud Console
- [ ] Backend application running locally or in staging
- [ ] Text editor to edit `.env` file

---

## 🔧 PART 1: Google Cloud Console Setup (15 minutes)

### Step 1.1: Create or Select Google Cloud Project

**URL:** https://console.cloud.google.com/

```
1. Click "Select a Project" (top left)
2. Click "New Project"
3. Enter project name: "Event Registration Sync"
4. Click "Create"
5. Wait for project to be created (1-2 minutes)
6. Project will be automatically selected
```

**Verification:**
- [ ] Project name appears in top left selector
- [ ] You're in the new project dashboard

---

### Step 1.2: Enable Google Sheets API

**URL:** https://console.cloud.google.com/apis/library

```
1. In search box, type "Google Sheets API"
2. Click on "Google Sheets API" result
3. Click "Enable" button
4. Wait for API to be enabled (30 seconds)
```

**Verification:**
- [ ] Page shows "Google Sheets API" with "Manage" button
- [ ] Status shows "API enabled"

---

### Step 1.3: Create Service Account

**URL:** https://console.cloud.google.com/iam-admin/serviceaccounts

```
1. Click "Create Service Account" button
2. Fill in the form:
   - Service account name: "event-registration-sync"
   - Service account ID: (auto-filled)
   - Description: "Syncs event registrations to Google Sheets"
3. Click "Create and Continue"
4. Skip the optional steps (Grant this service account access to project)
5. Click "Done"
```

**Verification:**
- [ ] Service account appears in the list
- [ ] Service account email shows (e.g., event-registration-sync@project-id.iam.gserviceaccount.com)

---

### Step 1.4: Create and Download Service Account Key

**URL:** https://console.cloud.google.com/iam-admin/serviceaccounts

```
1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Click "Create"
6. JSON file will download automatically
7. Save it securely (you'll need it in Part 2)
```

**Verification:**
- [ ] JSON file downloaded (usually named like `project-id-xxxxx.json`)
- [ ] File contains `client_email` field
- [ ] File contains `private_key` field

---

### Step 1.5: Copy Service Account Email

**In the JSON file you downloaded:**

```json
{
  "type": "service_account",
  "project_id": "event-registration-sync-xxxxx",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "event-registration-sync@event-registration-sync-xxxxx.iam.gserviceaccount.com",
  ...
}
```

**Copy the `client_email` value:**
```
event-registration-sync@event-registration-sync-xxxxx.iam.gserviceaccount.com
```

**Verification:**
- [ ] Email copied to clipboard or notepad
- [ ] Email format: `name@project-id.iam.gserviceaccount.com`

---

## 📊 PART 2: Google Sheets Setup (10 minutes)

### Step 2.1: Create New Spreadsheet

**URL:** https://sheets.google.com/

```
1. Click "Create" or "+" button
2. Click "Blank spreadsheet"
3. Name the spreadsheet: "Event Registrations"
4. Spreadsheet will open
```

**Verification:**
- [ ] Spreadsheet created and opened
- [ ] Title shows "Event Registrations"

---

### Step 2.2: Share Spreadsheet with Service Account

```
1. Click "Share" button (top right)
2. In the dialog, paste the service account email:
   event-registration-sync@event-registration-sync-xxxxx.iam.gserviceaccount.com
3. In the permissions dropdown, select "Editor"
4. Uncheck "Notify people" (service account doesn't need email)
5. Click "Share"
```

**Verification:**
- [ ] Service account email appears in share list
- [ ] Permission shows "Editor"
- [ ] No error messages

---

### Step 2.3: Get Spreadsheet ID

**In the URL bar:**
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit#gid=0
                                      ↑ This is your Spreadsheet ID
```

**Copy the Spreadsheet ID:**
```
1a2b3c4d5e6f7g8h9i0j
```

**Verification:**
- [ ] Spreadsheet ID copied
- [ ] ID is a long string of letters and numbers
- [ ] ID doesn't include `/edit` or `#gid=0`

---

### Step 2.4: Verify Sheet Name

```
1. Look at the sheet tabs at the bottom
2. Default sheet is usually named "Sheet1"
3. You can rename it to "Registrations" (optional)
   - Right-click on sheet tab
   - Click "Rename"
   - Type "Registrations"
   - Press Enter
```

**Verification:**
- [ ] Sheet name noted (default: "Sheet1" or renamed to "Registrations")
- [ ] Sheet is visible and accessible

---

## 💻 PART 3: Application Setup (10 minutes)

### Step 3.1: Create Credentials Folder

**In your terminal:**

```bash
# Navigate to backend directory
cd backend

# Create credentials folder
mkdir credentials

# Verify folder created
ls -la credentials
```

**Verification:**
- [ ] `backend/credentials/` folder exists
- [ ] Folder is empty

---

### Step 3.2: Place Credentials File

**Copy the JSON file you downloaded:**

```bash
# Copy the file to credentials folder
cp /path/to/downloaded/project-id-xxxxx.json backend/credentials/google-sheets-credentials.json

# Verify file is there
ls -la backend/credentials/
```

**Expected output:**
```
-rw-r--r--  1 user  group  2500 May 12 14:30 google-sheets-credentials.json
```

**Verification:**
- [ ] File exists at `backend/credentials/google-sheets-credentials.json`
- [ ] File is readable
- [ ] File size is > 1KB

---

### Step 3.3: Update .env File

**Edit `backend/.env`:**

```env
# Add these lines (or update if they exist):

GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_SHEETS_SHEET_NAME=Registrations
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_MAX_RETRIES=3
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
```

**Replace with your values:**
- `GOOGLE_SHEETS_ID`: Your spreadsheet ID from Step 2.3
- `GOOGLE_SHEETS_SHEET_NAME`: Your sheet name (default: "Registrations")
- `GOOGLE_SHEETS_CREDENTIALS_PATH`: Path to credentials file (usually `./credentials/google-sheets-credentials.json`)

**Verification:**
- [ ] `.env` file updated
- [ ] All values filled in correctly
- [ ] No typos in variable names

---

### Step 3.4: Update .gitignore

**Edit `backend/.gitignore`:**

```
# Add this line:
credentials/
```

**Verification:**
- [ ] `credentials/` added to `.gitignore`
- [ ] Credentials folder will not be committed to Git

---

### Step 3.5: Run Database Migration

**In terminal:**

```bash
cd backend

# Run migration to create FailedSync and DeadLetterSync tables
npm run db:migrate

# Or if using Prisma directly:
npx prisma migrate deploy
```

**Expected output:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "allhealthtech" at "localhost:5432"

1 migration found in prisma/migrations

Applying migration `20260511181546_add_google_sheets_sync_tables`

The following migration(s) have been applied:

migrations/
  └─ 20260511181546_add_google_sheets_sync_tables/
    └─ migration.sql

All migrations have been applied successfully.
```

**Verification:**
- [ ] Migration completed successfully
- [ ] No error messages
- [ ] Database tables created

---

## 🚀 PART 4: Verification (5 minutes)

### Step 4.1: Start Application

**In terminal:**

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

**Verification:**
- [ ] Application starts without errors
- [ ] No "Google Sheets" error messages
- [ ] Server listening on port 3000

---

### Step 4.2: Create Test Registration

**Using curl or Postman:**

```bash
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "attendeeName": "Test User",
    "attendeeEmail": "test@example.com",
    "attendeePhone": "+91 98765 43210",
    "organization": "Test Org",
    "role": "Tester",
    "dietaryRestrictions": "None",
    "accessibilityNeeds": "None"
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

**Verification:**
- [ ] Registration created successfully
- [ ] Ticket ID generated
- [ ] No error messages

---

### Step 4.3: Check Application Logs

**In terminal where app is running:**

```
[GoogleSheets] Registration synced successfully {
  registrationId: 'reg-123',
  ticketId: 'AHT-2025-00001',
  updatedRows: 1
}
```

**Verification:**
- [ ] Log shows successful sync
- [ ] No error messages
- [ ] `updatedRows: 1` indicates row was added

---

### Step 4.4: Verify in Google Sheets

**In Google Sheets:**

```
1. Go to your "Event Registrations" spreadsheet
2. Look at the "Registrations" sheet
3. You should see:
   - Row 1: Headers (Ticket ID, Attendee Name, Email, etc.)
   - Row 2: Your test registration data
```

**Expected data:**
```
Ticket ID      | Attendee Name | Email              | Phone          | ...
AHT-2025-00001 | Test User     | test@example.com   | +91 98765 43210| ...
```

**Verification:**
- [ ] New row appears in Google Sheets
- [ ] All columns populated correctly
- [ ] Data matches what you submitted

---

## ✅ Final Checklist

### Google Cloud Setup
- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] Service account created
- [ ] Service account key downloaded (JSON file)
- [ ] Service account email copied

### Google Sheets Setup
- [ ] Spreadsheet created
- [ ] Spreadsheet shared with service account
- [ ] Spreadsheet ID copied
- [ ] Sheet name verified

### Application Setup
- [ ] Credentials folder created
- [ ] JSON file placed in credentials folder
- [ ] `.env` file updated with all values
- [ ] `.gitignore` updated to exclude credentials
- [ ] Database migration run
- [ ] Application started successfully

### Verification
- [ ] Test registration created
- [ ] Application logs show successful sync
- [ ] New row appears in Google Sheets
- [ ] All data populated correctly

---

## 🎉 Success!

If all checkboxes are checked, your Google Sheets sync is working!

**What happens next:**
1. Every time someone registers, a new row is added to Google Sheets
2. Sync happens automatically within 1 second
3. If sync fails, it retries automatically with exponential backoff
4. Failed syncs are logged and can be reviewed

---

## 🔧 Troubleshooting

### Issue: "Failed to load Google Sheets credentials"

**Solution:**
1. Verify file exists: `backend/credentials/google-sheets-credentials.json`
2. Check file permissions: `ls -la backend/credentials/`
3. Verify JSON is valid: Open file and check for syntax errors
4. Restart application

### Issue: "Authentication failed (401)"

**Solution:**
1. Verify spreadsheet is shared with service account email
2. Check permissions are set to "Editor"
3. Verify service account email matches exactly
4. Try re-sharing the spreadsheet

### Issue: "Sheet not found (404)"

**Solution:**
1. Verify sheet name in `.env` matches exactly (case-sensitive)
2. Check sheet exists in spreadsheet
3. Try renaming sheet to "Registrations"
4. Restart application

### Issue: Registrations not syncing

**Solution:**
1. Check `GOOGLE_SHEETS_ID` is set in `.env`
2. Check `GOOGLE_SHEETS_CREDENTIALS_PATH` is set in `.env`
3. Check application logs for errors
4. Verify credentials file exists and is readable
5. Restart application

### Issue: Rate limit errors (429)

**Solution:**
1. System automatically retries with backoff
2. Increase `GOOGLE_SHEETS_INITIAL_DELAY_MS` if needed
3. Spread registrations over time if possible
4. Check Google Cloud Console for quota usage

---

## 📞 Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Review application logs for error messages
3. Check Google Cloud Console for API errors
4. Verify all configuration values are correct
5. Contact the development team with:
   - Error message and timestamp
   - Registration ID that failed
   - Recent changes to configuration
   - Google Sheets API quota usage

---

## 📚 Additional Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Google Sheets API Quotas](https://developers.google.com/sheets/api/limits)
- Full guide: `GOOGLE_SHEETS_SYNC_GUIDE.md`
- Connection diagram: `GOOGLE_SHEETS_CONNECTION_DIAGRAM.md`

---

**Setup completed on:** _______________  
**Verified by:** _______________  
**Notes:** _______________
