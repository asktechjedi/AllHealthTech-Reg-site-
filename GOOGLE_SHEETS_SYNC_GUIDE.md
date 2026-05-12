# Google Sheets Sync Implementation Guide

## Overview

The Google Sheets Sync feature automatically synchronizes registration data to a Google Sheets spreadsheet in real-time. Each registration is synced within 5 seconds of confirmation, with automatic retry logic for transient failures and a dead letter queue for permanent failures.

## Architecture

### Components

1. **Google Sheets Service** (`backend/src/services/googleSheetsService.js`)
   - Authenticates with Google Sheets API using service account credentials
   - Maps registration data to sheet columns
   - Appends registration rows to the sheet
   - Classifies errors as transient or permanent

2. **Retry Manager** (`backend/src/services/retryManager.js`)
   - Queues failed syncs for retry
   - Implements exponential backoff (1s, 2s, 4s)
   - Moves permanently failed syncs to dead letter queue
   - Processes pending retries on a background interval

3. **Metrics Collector** (`backend/src/lib/metricsCollector.js`)
   - Tracks sync success rate
   - Monitors retry attempts
   - Alerts when success rate drops below threshold

4. **Database Models**
   - `FailedSync`: Stores failed syncs queued for retry
   - `DeadLetterSync`: Stores permanently failed syncs for manual review

## Setup Instructions

### 1. Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create a service account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the service account details
   - Click "Create and Continue"
   - Skip optional steps and click "Done"
5. Create a key for the service account:
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Click "Create"
   - Save the JSON file securely

### 2. Create Google Sheets Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it (e.g., "Event Registrations")
4. Share the spreadsheet with the service account email:
   - Click "Share" button
   - Copy the service account email from the JSON credentials file
   - Paste it in the share dialog
   - Give "Editor" permissions
   - Click "Share"
5. Note the spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
   - Copy the `{SPREADSHEET_ID}` part

### 3. Configure Environment Variables

Add the following to your `.env` file:

```env
# Google Sheets Sync Configuration
GOOGLE_SHEETS_ID=your_spreadsheet_id_here
GOOGLE_SHEETS_SHEET_NAME=Registrations
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_MAX_RETRIES=3
GOOGLE_SHEETS_INITIAL_DELAY_MS=1000
GOOGLE_SHEETS_BACKOFF_MULTIPLIER=2
```

### 4. Store Credentials File

1. Create a `credentials` directory in the backend folder:
   ```bash
   mkdir backend/credentials
   ```

2. Place the JSON credentials file in this directory:
   ```bash
   cp /path/to/downloaded/credentials.json backend/credentials/google-sheets-credentials.json
   ```

3. Add the credentials directory to `.gitignore`:
   ```
   backend/credentials/
   ```

### 5. Initialize Database

Run the database migration to create the FailedSync and DeadLetterSync tables:

```bash
cd backend
npm run db:migrate
```

### 6. Start the Retry Processor

The retry processor runs automatically when the application starts. It processes pending retries every 10 seconds.

To start the application:

```bash
npm run dev
```

## Configuration Guide

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GOOGLE_SHEETS_ID` | Required | Google Sheets spreadsheet ID |
| `GOOGLE_SHEETS_SHEET_NAME` | `Registrations` | Sheet name within the spreadsheet |
| `GOOGLE_SHEETS_CREDENTIALS_PATH` | Required | Path to service account credentials JSON file |
| `GOOGLE_SHEETS_MAX_RETRIES` | `3` | Maximum number of retry attempts |
| `GOOGLE_SHEETS_INITIAL_DELAY_MS` | `1000` | Initial retry delay in milliseconds |
| `GOOGLE_SHEETS_BACKOFF_MULTIPLIER` | `2` | Exponential backoff multiplier |

### Retry Logic

The retry manager uses exponential backoff to handle transient failures:

- **Retry 0**: 1 second delay (1000 × 2^0)
- **Retry 1**: 2 seconds delay (1000 × 2^1)
- **Retry 2**: 4 seconds delay (1000 × 2^2)
- **Retry 3**: Failed - moved to dead letter queue

### Error Classification

**Transient Errors** (will be retried):
- Network timeouts
- DNS resolution failures
- Connection refused
- HTTP 429 (Rate limit)
- HTTP 5xx (Server errors)

**Permanent Errors** (moved to dead letter queue):
- HTTP 401 (Unauthorized)
- HTTP 403 (Forbidden)
- HTTP 404 (Not found)
- Invalid credentials
- Invalid sheet ID

## Data Mapping

The following registration fields are synced to Google Sheets:

| Column | Source Field | Type | Example |
|--------|--------------|------|---------|
| Ticket ID | `registration.ticketId` | String | `AHT-2025-00001` |
| Attendee Name | `registration.attendeeName` | String | `John Doe` |
| Email | `registration.attendeeEmail` | String | `john@example.com` |
| Phone | `registration.attendeePhone` | String | `+91 98765 43210` |
| Organization | `registration.organization` | String | `Acme Corp` |
| Role | `registration.role` | String | `Manager` |
| Dietary Restrictions | `registration.dietaryRestrictions` | String | `Vegetarian` |
| Accessibility Needs | `registration.accessibilityNeeds` | String | `Wheelchair access` |
| Ticket Type | `registration.ticketType.name` | String | `General Admission` |
| Event Name | `registration.event.name` | String | `AllHealthTech 2025` |
| Registration Timestamp | `registration.createdAt` | ISO 8601 | `2025-10-01T14:30:00Z` |

## Monitoring Guide

### Viewing Metrics

The application logs metrics after each sync operation:

```
[Metrics] Sync successful: {
  totalSyncs: 100,
  successfulSyncs: 98,
  failedSyncs: 2,
  successRate: '98.00%',
  failureRate: '2.00%',
  transientErrors: 1,
  permanentErrors: 1,
  totalRetries: 3,
  deadLetterCount: 1,
  lastSyncTime: 2025-10-01T14:35:00.000Z,
  lastErrorTime: 2025-10-01T14:34:00.000Z
}
```

### Checking Failed Syncs

Query the database to view failed syncs:

```sql
-- View pending retries
SELECT * FROM "FailedSync" 
ORDER BY "nextRetryTime" ASC;

-- View dead letter queue
SELECT * FROM "DeadLetterSync" 
ORDER BY "createdAt" DESC;
```

### Alerts

The system logs alerts when:
- Success rate drops below 95%
- Permanent errors occur
- Max retries exceeded

Example alert:
```
[ALERT] Google Sheets sync success rate below 95%: {
  successRate: '90.00%',
  totalSyncs: 100,
  successfulSyncs: 90,
  failedSyncs: 10
}
```

## Troubleshooting Guide

### Issue: "Failed to load Google Sheets credentials"

**Cause**: Credentials file not found or invalid path

**Solution**:
1. Verify the credentials file exists at the path specified in `GOOGLE_SHEETS_CREDENTIALS_PATH`
2. Check file permissions (should be readable)
3. Verify the JSON file is valid (not corrupted)

### Issue: "Authentication failed (401)"

**Cause**: Service account doesn't have permission to access the spreadsheet

**Solution**:
1. Verify the spreadsheet is shared with the service account email
2. Check that the service account has "Editor" permissions
3. Verify the service account email in the credentials file matches the shared email

### Issue: "Sheet not found (404)"

**Cause**: Sheet name doesn't exist in the spreadsheet

**Solution**:
1. Verify the sheet name in `GOOGLE_SHEETS_SHEET_NAME` matches exactly (case-sensitive)
2. Check that the sheet exists in the spreadsheet
3. The system will attempt to create the sheet with headers if it doesn't exist

### Issue: "Rate limit exceeded (429)"

**Cause**: Too many requests to Google Sheets API

**Solution**:
1. The system automatically retries with exponential backoff
2. Increase `GOOGLE_SHEETS_INITIAL_DELAY_MS` if rate limiting persists
3. Consider spreading registrations over time if possible

### Issue: Syncs stuck in retry queue

**Cause**: Transient errors persisting beyond retry attempts

**Solution**:
1. Check the error message in the `FailedSync` table
2. Verify network connectivity to Google Sheets API
3. Check Google Cloud Console for API quota issues
4. Manually move syncs to dead letter queue if needed:
   ```sql
   INSERT INTO "DeadLetterSync" 
   SELECT id, "registrationId", "registrationData", error, "errorType", "retryCount", NOW()
   FROM "FailedSync" 
   WHERE "nextRetryTime" < NOW() - INTERVAL '1 hour';
   
   DELETE FROM "FailedSync" 
   WHERE "nextRetryTime" < NOW() - INTERVAL '1 hour';
   ```

### Issue: Registrations not syncing

**Cause**: Google Sheets sync not configured

**Solution**:
1. Verify `GOOGLE_SHEETS_ID` is set in environment variables
2. Verify `GOOGLE_SHEETS_CREDENTIALS_PATH` is set
3. Check application logs for configuration errors
4. Restart the application after setting environment variables

## Manual Sync Operations

### Retry a Failed Sync

```javascript
import { retryFailedSync } from './backend/src/services/retryManager.js';

const failedSyncId = 'sync-id-from-database';
const config = {
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffMultiplier: 2,
};
const googleSheetsConfig = {
  spreadsheetId: process.env.GOOGLE_SHEETS_ID,
  sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME,
  credentialsPath: process.env.GOOGLE_SHEETS_CREDENTIALS_PATH,
};

await retryFailedSync(failedSyncId, config, googleSheetsConfig);
```

### Initialize Sheet Headers

```javascript
import { initializeGoogleSheet } from './backend/src/services/googleSheetsService.js';

const config = {
  spreadsheetId: process.env.GOOGLE_SHEETS_ID,
  sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME,
  credentialsPath: process.env.GOOGLE_SHEETS_CREDENTIALS_PATH,
};

await initializeGoogleSheet(config);
```

## Performance Considerations

### Sync Latency

- **Target**: Sync within 5 seconds of registration confirmation
- **Actual**: Typically < 1 second for successful syncs
- **With retries**: Up to 15 seconds (1s + 2s + 4s + 8s) for transient errors

### API Quota

Google Sheets API has the following quotas:
- 500 requests per 100 seconds per user
- 100 concurrent requests per user

The system respects these quotas through:
- Exponential backoff on rate limit errors
- Sequential processing of retries

### Database Performance

The FailedSync and DeadLetterSync tables have indexes on:
- `nextRetryTime` (for efficient retry queue processing)
- `registrationId` (for looking up syncs by registration)
- `createdAt` (for dead letter queue queries)

## Security Considerations

### Credentials Management

1. **Never commit credentials to version control**
   - Add `backend/credentials/` to `.gitignore`
   - Use environment variables for paths

2. **Rotate credentials regularly**
   - Recommended: At least annually
   - Process: Create new key, update environment variable, delete old key

3. **Limit service account permissions**
   - Only grant "Editor" access to the specific spreadsheet
   - Don't use service account for other purposes

4. **Monitor API access**
   - Check Google Cloud Console for unusual activity
   - Review API quota usage regularly

### Data Protection

1. **Registration data in Google Sheets**
   - Ensure spreadsheet is not shared publicly
   - Use Google Sheets sharing controls to limit access
   - Consider enabling version history for audit trail

2. **Failed sync data in database**
   - Contains full registration data for retry
   - Ensure database backups are secure
   - Consider encrypting sensitive fields

## Disabling Google Sheets Sync

To disable Google Sheets sync without removing code:

1. Remove or comment out environment variables:
   ```env
   # GOOGLE_SHEETS_ID=...
   # GOOGLE_SHEETS_CREDENTIALS_PATH=...
   ```

2. The system will automatically skip sync operations if not configured

3. Existing failed syncs will remain in the database for manual review

## Future Enhancements

Potential improvements for future versions:

1. **Batch syncing**: Group multiple registrations into single API call
2. **Custom field mapping**: Allow configuration of which fields to sync
3. **Multiple sheets**: Support syncing to different sheets based on event
4. **Webhook notifications**: Alert external systems on sync failures
5. **Admin dashboard**: UI for monitoring sync status and managing dead letter queue
6. **Automatic sheet creation**: Create sheets automatically if they don't exist
7. **Data validation**: Add data validation rules to Google Sheets columns
8. **Conditional formatting**: Highlight important fields or error conditions

## Support

For issues or questions:

1. Check the Troubleshooting Guide above
2. Review application logs for error messages
3. Check Google Cloud Console for API errors
4. Contact the development team with:
   - Error message and timestamp
   - Registration ID that failed to sync
   - Recent changes to configuration
   - Google Sheets API quota usage

## References

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Google Sheets API Quotas](https://developers.google.com/sheets/api/limits)
- [googleapis npm package](https://www.npmjs.com/package/googleapis)
