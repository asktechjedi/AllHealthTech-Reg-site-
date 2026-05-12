# How to Get JSON Key from Google Cloud Console

## 📋 Step-by-Step Guide

### Step 1: Go to Google Cloud Console

**URL:** https://console.cloud.google.com/

1. Open your browser
2. Go to: `https://console.cloud.google.com/`
3. Sign in with your Google account (if not already signed in)

---

### Step 2: Select Your Project

1. At the top left, click the **Project Selector** (dropdown)
2. Look for: **"AHT Registration Sync - Google Sheets"**
3. Click on it to select it

**If you don't see it:**
- Click "New Project"
- Name it: "AHT Registration Sync - Google Sheets"
- Click "Create"

---

### Step 3: Navigate to Service Accounts

1. In the left sidebar, click **"APIs & Services"**
2. Click **"Credentials"**

You should see a page with different credential types.

---

### Step 4: Find Your Service Account

1. Look for the section: **"Service Accounts"**
2. Find the service account: **"aht-538"**
3. Click on it

**If you don't see it:**
- Click "Create Service Account"
- Name: "aht-538"
- Click "Create and Continue"
- Skip optional steps
- Click "Done"

---

### Step 5: Go to Keys Tab

1. You're now on the service account details page
2. Click the **"Keys"** tab (at the top)

You should see a section: "User-managed keys"

---

### Step 6: Create or Download JSON Key

#### Option A: If you already have a key

1. Look for existing keys in the list
2. If you see a JSON key, click the **three dots** (⋮) next to it
3. Click **"Download"**
4. Save the file

#### Option B: If you don't have a key

1. Click **"Add Key"** button
2. Click **"Create new key"**
3. Choose **"JSON"** format
4. Click **"Create"**
5. The JSON file will automatically download

---

### Step 7: Save the File

1. The JSON file will download (usually named like: `aht-registration-sync-xxxxx.json`)
2. **Rename it to:** `google-sheets-credentials.json`
3. **Move it to:** `backend/credentials/`

**Full path should be:**
```
backend/credentials/google-sheets-credentials.json
```

---

## 📸 Visual Steps

```
Google Cloud Console
    ↓
Select Project: "AHT Registration Sync - Google Sheets"
    ↓
APIs & Services → Credentials
    ↓
Find Service Account: "aht-538"
    ↓
Click on "aht-538"
    ↓
Go to "Keys" tab
    ↓
Click "Add Key" → "Create new key"
    ↓
Choose "JSON" format
    ↓
Click "Create"
    ↓
JSON file downloads
    ↓
Rename to: google-sheets-credentials.json
    ↓
Move to: backend/credentials/
    ↓
✅ Done!
```

---

## 🔍 What the JSON File Contains

The JSON file will look like this (don't share this!):

```json
{
  "type": "service_account",
  "project_id": "aht-registration-sync-xxxxx",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nxxxxx\n-----END PRIVATE KEY-----\n",
  "client_email": "aht-538@event-registration-sync.iam.gserviceaccount.com",
  "client_id": "xxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "xxxxx"
}
```

**Important:** Never share this file! It contains your private key.

---

## ✅ Verification Checklist

- [ ] Opened Google Cloud Console
- [ ] Selected project: "AHT Registration Sync - Google Sheets"
- [ ] Went to APIs & Services → Credentials
- [ ] Found service account: "aht-538"
- [ ] Clicked on service account
- [ ] Went to Keys tab
- [ ] Created or downloaded JSON key
- [ ] File downloaded successfully
- [ ] Renamed to: google-sheets-credentials.json
- [ ] Moved to: backend/credentials/

---

## 🔐 Security Reminder

⚠️ **IMPORTANT:**
- Never share the JSON file
- Never commit it to Git
- Never post it online
- Keep it secure
- Only use it for this application

---

## 📍 File Location

After downloading, your file should be at:

```
D:\ATsite\backend\credentials\google-sheets-credentials.json
```

Or on Mac/Linux:
```
/path/to/project/backend/credentials/google-sheets-credentials.json
```

---

## ✨ Next Steps

Once you have the JSON file in the correct location:

1. ✅ JSON file placed in `backend/credentials/`
2. ⏳ Share Google Sheet with service account
3. ⏳ Verify sync to Google Sheet

---

## 🆘 Troubleshooting

### "I can't find the service account"

**Solution:**
1. Make sure you're in the right project
2. Check the project name: "AHT Registration Sync - Google Sheets"
3. If not found, create a new service account:
   - Click "Create Service Account"
   - Name: "aht-538"
   - Click "Create and Continue"
   - Skip optional steps
   - Click "Done"

### "I don't see the Keys tab"

**Solution:**
1. Make sure you clicked on the service account name
2. You should be on the service account details page
3. Look for tabs at the top: "Details", "Permissions", "Keys"
4. Click "Keys"

### "The JSON file won't download"

**Solution:**
1. Check your browser's download settings
2. Try a different browser
3. Check if pop-ups are blocked
4. Try creating a new key instead of downloading an old one

---

## 📞 Need Help?

If you're stuck:
1. Check the screenshots in Google Cloud Console
2. Make sure you're in the right project
3. Verify the service account name is "aht-538"
4. Try creating a new key if the old one doesn't work

---

**Time to complete:** 5 minutes  
**Difficulty:** Easy  
**Status:** Ready to proceed
