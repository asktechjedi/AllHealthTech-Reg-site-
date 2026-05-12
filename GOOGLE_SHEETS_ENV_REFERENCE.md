# Google Sheets - Environment Configuration Reference

## 📝 .env Configuration

### Complete Example

```env
# ============================================
# GOOGLE SHEETS SYNC CONFIGURATION
# ============================================

# REQUIRED: Your Google Sheets spreadsheet ID
# Where to find: In the URL of your spreadsheet
# URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
# Example: 1a2b3c4d5e6f7g8h9i0j
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j

# REQUIRED: Path to service account credentials JSON file
# Where to place: backend/credentials/google-sheets-credentials.json
# This file should NOT be committed to Git
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json

# OPTIONAL: Name of the sheet within the spreadsheet
# Default: Registrations
# Note: Case-sensitive, must match exactly
GOOGLE_SHEETS_SHEET_NAME=Registrations

# OPTIONAL: Maximum number of retry attempts for failed syncs
# Default: 3
# Range: 1-10
# Higher values = more retry attempts before giving up
GOOGLE_SHEETS_MAX_RETRIES=3

# OPTIONAL: Initial delay in milliseconds before first retry
# Default: 1000 (1 second)
# Range: 100-10000
# Used with exponential backoff: 1s, 2s, 4s, 8s, etc.
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000

# OPTIONAL: Exponential backoff multiplier
# Default: 2
# Range: 1.5-3
# Retry delays: 1s × 2^0, 1s × 2^1, 1s × 2^2, etc.
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
```

---

## 🔍 Finding Your Values

### 1. GOOGLE_SHEETS_ID

**Step 1:** Open your Google Sheets spreadsheet

**Step 2:** Look at the URL in your browser:
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit#gid=0
                                      ↑ Copy this part
```

**Step 3:** Copy the ID (the long string between `/d/` and `/edit`)

**Example:**
```
URL: https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
ID:  1a2b3c4d5e6f7g8h9i0j
```

**In .env:**
```env
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
```

---

### 2. GOOGLE_SHEETS_CREDENTIALS_PATH

**Step 1:** Download credentials JSON from Google Cloud Console

**Step 2:** Create folder in backend:
```bash
mkdir backend/credentials
```

**Step 3:** Place JSON file in folder:
```bash
cp /path/to/downloaded/credentials.json backend/credentials/google-sheets-credentials.json
```

**Step 4:** In .env, use the path:
```env
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
```

**Verify file exists:**
```bash
ls -la backend/credentials/google-sheets-credentials.json
```

---

### 3. GOOGLE_SHEETS_SHEET_NAME

**Step 1:** Open your Google Sheets spreadsheet

**Step 2:** Look at the sheet tabs at the bottom:
```
┌─────────────────────────────────────────┐
│ [Registrations] [Sheet2] [Sheet3]       │
│  ↑ This is the sheet name               │
└─────────────────────────────────────────┘
```

**Step 3:** Use the exact name (case-sensitive):
```env
GOOGLE_SHEETS_SHEET_NAME=Registrations
```

**Note:** If you rename the sheet, update this value

---

## 🔧 Configuration Scenarios

### Scenario 1: Basic Setup (Recommended)

```env
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_SHEETS_SHEET_NAME=Registrations
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_MAX_RETRIES=3
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
```

**Use when:** Standard setup with default retry behavior

---

### Scenario 2: High Volume (Many Registrations)

```env
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_SHEETS_SHEET_NAME=Registrations
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_MAX_RETRIES=5
GOOGLE_SHEETS_INITIAL_DELAY_MS=500
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
```

**Use when:** Expecting many registrations, want more retries

**Changes:**
- `MAX_RETRIES`: 3 → 5 (more retry attempts)
- `INITIAL_DELAY_MS`: 1000 → 500 (faster retries)

---

### Scenario 3: Rate Limit Issues

```env
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_SHEETS_SHEET_NAME=Registrations
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_MAX_RETRIES=5
GOOGLE_SHEETS_INITIAL_DELAY_MS=2000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=3
```

**Use when:** Getting rate limit errors (429)

**Changes:**
- `MAX_RETRIES`: 3 → 5 (more attempts)
- `INITIAL_DELAY_MS`: 1000 → 2000 (longer delays)
- `BACKOFF_MULTIPLIER`: 2 → 3 (exponential growth: 2s, 6s, 18s, etc.)

---

### Scenario 4: Minimal Setup (Testing)

```env
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
```

**Use when:** Testing, using all defaults

**Note:** Other values will use defaults:
- `SHEET_NAME`: "Registrations"
- `MAX_RETRIES`: 3
- `INITIAL_DELAY_MS`: 1000
- `BACKOFF_MULTIPLIER`: 2

---

### Scenario 5: Disabled (No Sync)

```env
# Comment out or remove these lines:
# GOOGLE_SHEETS_ID=...
# GOOGLE_SHEETS_CREDENTIALS_PATH=...
```

**Use when:** Want to disable Google Sheets sync

**Result:** Registrations will work, but won't sync to Google Sheets

---

## 📊 Retry Behavior Examples

### Example 1: Default Configuration

```env
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
GOOGLE_SHEETS_MAX_RETRIES=3
```

**Retry timeline:**
```
Attempt 1: Fails
  ↓ Wait 1 second (1000 × 2^0)
Attempt 2: Fails
  ↓ Wait 2 seconds (1000 × 2^1)
Attempt 3: Fails
  ↓ Wait 4 seconds (1000 × 2^2)
Attempt 4: Fails
  ↓ Moved to Dead Letter Queue
Total time: 1 + 2 + 4 = 7 seconds
```

---

### Example 2: Aggressive Retries

```env
GOOGLE_SHEETS_INITIAL_DELAY_MS=500
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
GOOGLE_SHEETS_MAX_RETRIES=5
```

**Retry timeline:**
```
Attempt 1: Fails
  ↓ Wait 0.5 seconds (500 × 2^0)
Attempt 2: Fails
  ↓ Wait 1 second (500 × 2^1)
Attempt 3: Fails
  ↓ Wait 2 seconds (500 × 2^2)
Attempt 4: Fails
  ↓ Wait 4 seconds (500 × 2^3)
Attempt 5: Fails
  ↓ Wait 8 seconds (500 × 2^4)
Attempt 6: Fails
  ↓ Moved to Dead Letter Queue
Total time: 0.5 + 1 + 2 + 4 + 8 = 15.5 seconds
```

---

### Example 3: Conservative Retries

```env
GOOGLE_SHEETS_INITIAL_DELAY_MS=2000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=3
GOOGLE_SHEETS_MAX_RETRIES=2
```

**Retry timeline:**
```
Attempt 1: Fails
  ↓ Wait 2 seconds (2000 × 3^0)
Attempt 2: Fails
  ↓ Wait 6 seconds (2000 × 3^1)
Attempt 3: Fails
  ↓ Moved to Dead Letter Queue
Total time: 2 + 6 = 8 seconds
```

---

## ✅ Validation Checklist

### Before Starting Application

- [ ] `GOOGLE_SHEETS_ID` is set and not empty
- [ ] `GOOGLE_SHEETS_ID` is a valid spreadsheet ID (long string)
- [ ] `GOOGLE_SHEETS_CREDENTIALS_PATH` is set
- [ ] Credentials file exists at the path
- [ ] Credentials file is readable
- [ ] Credentials file contains valid JSON
- [ ] `.gitignore` includes `credentials/` folder
- [ ] Spreadsheet is shared with service account email
- [ ] Service account has "Editor" permissions

### After Starting Application

- [ ] No "Google Sheets" error messages in logs
- [ ] Application starts successfully
- [ ] Create test registration
- [ ] Check logs for sync success message
- [ ] Verify new row in Google Sheets

---

## 🔐 Security Checklist

- [ ] Credentials file NOT committed to Git
- [ ] `credentials/` folder in `.gitignore`
- [ ] Credentials file permissions are restrictive (600)
- [ ] Only service account has access to spreadsheet
- [ ] Service account email not shared publicly
- [ ] Credentials file stored securely
- [ ] Environment variables not logged
- [ ] `.env` file not committed to Git

---

## 📋 Configuration Template

**Copy and paste into your `.env` file:**

```env
# ============================================
# GOOGLE SHEETS SYNC CONFIGURATION
# ============================================

# REQUIRED: Your Google Sheets spreadsheet ID
GOOGLE_SHEETS_ID=

# REQUIRED: Path to service account credentials JSON file
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json

# OPTIONAL: Name of the sheet within the spreadsheet
GOOGLE_SHEETS_SHEET_NAME=Registrations

# OPTIONAL: Maximum number of retry attempts
GOOGLE_SHEETS_MAX_RETRIES=3

# OPTIONAL: Initial delay in milliseconds before first retry
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000

# OPTIONAL: Exponential backoff multiplier
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
```

---

## 🧪 Testing Configuration

**To test if configuration is correct:**

```bash
# 1. Check credentials file exists
ls -la backend/credentials/google-sheets-credentials.json

# 2. Check .env file has values
grep GOOGLE_SHEETS backend/.env

# 3. Start application
npm run dev

# 4. Check logs for configuration message
# Should see: "Google Sheets sync configured"

# 5. Create test registration
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "attendeeName": "Test",
    "attendeeEmail": "test@example.com",
    "attendeePhone": "+91 98765 43210"
  }'

# 6. Check logs for sync success
# Should see: "[GoogleSheets] Registration synced successfully"

# 7. Check Google Sheets
# Should see new row with test data
```

---

## 🚨 Common Configuration Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `GOOGLE_SHEETS_ID is not set` | Missing in .env | Add `GOOGLE_SHEETS_ID=your_id` |
| `Failed to load credentials` | File not found | Check path and file exists |
| `Invalid JSON in credentials` | Corrupted file | Re-download from Google Cloud |
| `Authentication failed (401)` | Wrong credentials | Verify service account email |
| `Sheet not found (404)` | Wrong sheet name | Check sheet name (case-sensitive) |
| `Rate limit exceeded (429)` | Too many requests | Increase `INITIAL_DELAY_MS` |

---

## 📞 Support

If configuration issues persist:

1. Verify all values are correct
2. Check credentials file is valid JSON
3. Verify spreadsheet is shared
4. Check application logs for specific errors
5. Review Google Cloud Console for API errors
6. Contact development team with error message

---

**Last updated:** 2026-05-12  
**Version:** 1.0
