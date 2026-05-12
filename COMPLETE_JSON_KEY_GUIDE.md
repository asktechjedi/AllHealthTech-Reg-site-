# Complete Guide - How to Get JSON Key

## 🎯 What You Need

You need to download a JSON file that contains authentication credentials for Google Sheets.

**File name:** `google-sheets-credentials.json`  
**Location:** `backend/credentials/google-sheets-credentials.json`  
**Size:** ~2-3 KB  
**Format:** JSON (text file)

---

## 📋 Step-by-Step Instructions

### Step 1: Open Google Cloud Console

**URL:** https://console.cloud.google.com/

1. Open your web browser
2. Go to: `https://console.cloud.google.com/`
3. Sign in with your Google account
4. Wait for the page to fully load

**What you should see:**
- Google Cloud Console dashboard
- Project selector at top left
- Left sidebar with menu options

---

### Step 2: Select Your Project

**Look for the Project Selector:**
- At the top left of the page
- Shows current project name
- Has a dropdown arrow (▼)

**Click on it:**
1. Click the project selector dropdown
2. Look for: **"AHT Registration Sync - Google Sheets"**
3. Click on it to select it

**If you don't see it:**
- Click "New Project"
- Enter name: "AHT Registration Sync - Google Sheets"
- Click "Create"
- Wait for project to be created
- Select it from the dropdown

---

### Step 3: Navigate to APIs & Services

**In the left sidebar:**
1. Look for: **"APIs & Services"**
2. Click on it
3. A submenu will appear

**In the submenu:**
1. Click: **"Credentials"**

**What you should see:**
- Credentials page
- Different credential types listed
- "Service Accounts" section

---

### Step 4: Find Your Service Account

**Look for Service Accounts section:**
1. Scroll down to find: **"Service Accounts"**
2. Look for the account: **"aht-538"**
3. Click on it

**If you don't see "aht-538":**
1. Click "Create Service Account"
2. Fill in:
   - Service account name: `aht-538`
   - Service account ID: (auto-filled)
   - Description: `Event Registration Sync`
3. Click "Create and Continue"
4. Skip optional steps
5. Click "Done"

---

### Step 5: Go to Keys Tab

**You're now on the service account details page:**
1. Look for tabs at the top: "Details", "Permissions", "Keys"
2. Click: **"Keys"** tab

**What you should see:**
- "User-managed keys" section
- "Add Key" button
- Possibly existing keys

---

### Step 6: Create JSON Key

**Click "Add Key" button:**
1. A dropdown menu appears
2. Click: **"Create new key"**

**Choose JSON format:**
1. A dialog appears with options
2. Select: **"JSON"**
3. Click: **"Create"**

**What happens:**
- JSON file automatically downloads
- File name: `aht-registration-sync-xxxxx.json` (xxxxx = random numbers)
- Saved to your Downloads folder

---

### Step 7: Rename and Move File

**Rename the file:**
1. Go to your Downloads folder
2. Find the file: `aht-registration-sync-xxxxx.json`
3. Right-click on it
4. Select: "Rename"
5. Change name to: `google-sheets-credentials.json`
6. Press Enter

**Move to correct location:**
1. Copy the file
2. Navigate to: `backend/credentials/`
3. Paste the file there

**Final path should be:**
```
backend/credentials/google-sheets-credentials.json
```

---

## 🔍 Verify the File

### Check File Exists

**On Windows (PowerShell):**
```powershell
ls -la backend/credentials/google-sheets-credentials.json
```

**On Mac/Linux (Terminal):**
```bash
ls -la backend/credentials/google-sheets-credentials.json
```

**Expected output:**
```
-rw-r--r--  1 user  group  2500 May 12 14:30 google-sheets-credentials.json
```

### Check File Content

**Open the file:**
1. Right-click on the file
2. Select: "Open with" → "Text Editor"
3. You should see JSON content

**Look for:**
- Starts with: `{`
- Contains: `"client_email"`
- Contains: `"private_key"`
- Ends with: `}`

**Example structure:**
```json
{
  "type": "service_account",
  "project_id": "aht-registration-sync-xxxxx",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "aht-538@event-registration-sync.iam.gserviceaccount.com",
  ...
}
```

---

## 🎯 Quick Checklist

- [ ] Opened Google Cloud Console
- [ ] Selected project: "AHT Registration Sync - Google Sheets"
- [ ] Went to: APIs & Services → Credentials
- [ ] Found service account: "aht-538"
- [ ] Clicked on service account
- [ ] Went to: Keys tab
- [ ] Clicked: Add Key → Create new key
- [ ] Selected: JSON format
- [ ] Clicked: Create
- [ ] JSON file downloaded
- [ ] Renamed to: google-sheets-credentials.json
- [ ] Moved to: backend/credentials/
- [ ] Verified file exists
- [ ] Verified file contains JSON

---

## 🔐 Security Important

### DO NOT:
- ❌ Share the JSON file
- ❌ Commit to Git
- ❌ Post online
- ❌ Email to anyone
- ❌ Put in public repositories

### DO:
- ✅ Keep it secure
- ✅ Store locally only
- ✅ Add folder to .gitignore
- ✅ Use only for this application

---

## 🆘 Troubleshooting

### Problem: "I can't find the service account"

**Solution:**
1. Make sure you're in the right project
2. Check project name: "AHT Registration Sync - Google Sheets"
3. Go to: APIs & Services → Credentials
4. Look for "Service Accounts" section
5. If not found, create new one:
   - Click "Create Service Account"
   - Name: "aht-538"
   - Click "Create and Continue"
   - Skip optional steps
   - Click "Done"

### Problem: "I don't see the Keys tab"

**Solution:**
1. Make sure you clicked on the service account name
2. You should be on the service account details page
3. Look for tabs at the top
4. Click "Keys" tab
5. If still not visible, refresh the page

### Problem: "The JSON file won't download"

**Solution:**
1. Check browser download settings
2. Try a different browser
3. Check if pop-ups are blocked
4. Try creating a new key instead
5. Check your Downloads folder

### Problem: "I can't find my Downloads folder"

**Solution:**
- Windows: Usually `C:\Users\YourName\Downloads`
- Mac: Usually `~/Downloads`
- Linux: Usually `~/Downloads`

---

## 📸 Screenshots Reference

### Google Cloud Console
```
┌─────────────────────────────────────────┐
│ Google Cloud Console                    │
├─────────────────────────────────────────┤
│ [Project Selector ▼]                    │
│ AHT Registration Sync - Google Sheets   │
│                                         │
│ Left Menu:                              │
│ • APIs & Services                       │
│   • Credentials ← Click here            │
│                                         │
│ Main Area:                              │
│ Service Accounts                        │
│ • aht-538 ← Click here                  │
└─────────────────────────────────────────┘
```

### Service Account Details
```
┌─────────────────────────────────────────┐
│ Service Account: aht-538                │
├─────────────────────────────────────────┤
│ [Details] [Permissions] [Keys] ← Click  │
│                                         │
│ User-managed keys                       │
│ [Add Key ▼]                             │
│   • Create new key                      │
│     • JSON ← Select                     │
│     • P12                               │
│                                         │
│ [Create]                                │
└─────────────────────────────────────────┘
```

---

## ✅ Next Steps

Once you have the JSON file in `backend/credentials/`:

1. ✅ JSON file placed
2. ⏳ Share Google Sheet with service account
3. ⏳ Verify sync works

---

## 📞 Need Help?

If you're stuck:
1. Check the screenshots above
2. Make sure you're in the right project
3. Verify the service account name is "aht-538"
4. Try creating a new key if the old one doesn't work
5. Refresh the page if things look wrong

---

**Time to complete:** 5-10 minutes  
**Difficulty:** Easy  
**Status:** Ready to proceed
