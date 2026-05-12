# 🔧 Google Sheets Sync Not Working - Fix Guide

## Problem Identified

The Google Sheets sync is failing with error: **"Requested entity was not found"**

This means the service account cannot access your Google Sheet.

---

## Root Cause

The service account email (`aht-538@event-registration-sync.iam.gserviceaccount.com`) **does not have permission** to access your Google Sheet.

---

## Solution (2 minutes)

### Step 1: Open Your Google Sheet
1. Go to Google Sheets
2. Open your spreadsheet (ID: `111088255104733608101`)
3. Or use this direct link: `https://docs.google.com/spreadsheets/d/111088255104733608101/edit`

### Step 2: Share with Service Account
1. Click the **"Share"** button (top right)
2. In the "Add people and groups" field, paste this email:
   ```
   aht-538@event-registration-sync.iam.gserviceaccount.com
   ```
3. Set permission to **"Editor"**
4. **IMPORTANT:** Uncheck "Notify people" (no need to send email)
5. Click **"Share"** or **"Send"**

### Step 3: Verify Sheet Name
1. Check the tab name at the bottom of your Google Sheet
2. It should be exactly: **Sheet1**
3. If it's different, either:
   - Rename the tab to "Sheet1", OR
   - Update `GOOGLE_SHEETS_SHEET_NAME` in `backend/.env` to match your tab name

### Step 4: Test the Sync
After sharing, the sync should work automatically. Test it:

```bash
# From the backend directory
cd backend
node test-sheets-sync.js
```

You should see: `✅ Sync successful!`

---

## Verification Checklist

- [ ] Service account email added to Google Sheet
- [ ] Permission set to "Editor"
- [ ] Sheet tab name is "Sheet1" (or .env updated)
- [ ] Test script runs successfully
- [ ] New registrations appear in Google Sheet

---

## What Happens After Fixing

Once you share the sheet with the service account:

1. **Immediate**: Test script will succeed
2. **Automatic**: Failed syncs will retry and succeed
3. **Ongoing**: All new registrations will sync automatically

---

## Current Status

### ✅ Working
- Backend server running
- Retry processor active
- Credentials file valid
- Configuration correct

### ❌ Not Working
- Service account cannot access Google Sheet
- **FIX**: Share sheet with service account email

---

## Quick Fix Summary

**Problem:** Service account doesn't have permission  
**Solution:** Share Google Sheet with `aht-538@event-registration-sync.iam.gserviceaccount.com` as Editor  
**Time:** 2 minutes  
**Result:** Sync will work immediately  

---

## After You Fix It

### Test Immediately
```bash
cd backend
node test-sheets-sync.js
```

### Check Failed Syncs
The retry processor will automatically retry the failed syncs within 10 seconds.

### Create New Registration
1. Go to http://localhost:5173/register
2. Fill in the form
3. Submit
4. Check Google Sheet - new row should appear within 1 second

---

## Troubleshooting

### If test script still fails after sharing:
1. Wait 30 seconds for Google to propagate permissions
2. Verify the service account email is exactly:
   `aht-538@event-registration-sync.iam.gserviceaccount.com`
3. Verify permission is "Editor" (not "Viewer")
4. Try the test script again

### If sheet name is different:
1. Check the tab name at the bottom of your Google Sheet
2. Update `backend/.env`:
   ```
   GOOGLE_SHEETS_SHEET_NAME=YourActualSheetName
   ```
3. Restart backend server
4. Test again

---

## Support

If you still have issues after sharing:
1. Verify spreadsheet ID: `111088255104733608101`
2. Verify service account email: `aht-538@event-registration-sync.iam.gserviceaccount.com`
3. Check backend logs for errors
4. Run test script to see exact error

---

**Next Step:** Share your Google Sheet with the service account email and test!

