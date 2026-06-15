import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Custom error classes for Google Sheets sync
 */
export class TransientSyncError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TransientSyncError';
    this.isTransient = true;
  }
}

export class PermanentSyncError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PermanentSyncError';
    this.isTransient = false;
  }
}

export const REGISTRATION_SHEET_HEADERS = [
  'Ticket ID',
  'Attendee Name',
  'Email',
  'Phone',
  'Organization',
  'Role',
  'Dietary Restrictions',
  'Accessibility Needs',
  'Registration Timestamp',
];

export const REGISTRATION_SHEET_COLUMNS = [
  'ticketId',
  'attendeeName',
  'email',
  'phone',
  'organization',
  'role',
  'dietaryRestrictions',
  'accessibilityNeeds',
  'registrationTimestamp',
];

export function isGoogleSheetsConfigured() {
  return Boolean(
    process.env.GOOGLE_SHEETS_ID?.trim() &&
    process.env.GOOGLE_SHEETS_CREDENTIALS_JSON?.trim()
  );
}

export function getGoogleSheetsConfig() {
  return {
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || 'Registrations',
  };
}

export function getGoogleSheetsServiceAccountEmail() {
  try {
    const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS_JSON?.trim();
    if (!credentialsJson) return null;
    return JSON.parse(credentialsJson).client_email ?? null;
  } catch {
    return null;
  }
}

/** @returns {{ ok: true, title: string, sheetTabs: string[] } | { ok: false, message: string }} */
export async function verifyGoogleSheetsAccess() {
  const { spreadsheetId } = getGoogleSheetsConfig();
  try {
    const auth = await getGoogleSheetsAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    return {
      ok: true,
      title: meta.data.properties?.title ?? '(untitled)',
      sheetTabs: meta.data.sheets?.map((s) => s.properties?.title).filter(Boolean) ?? [],
    };
  } catch (error) {
    return { ok: false, message: formatGoogleSheetsError(error) };
  }
}

/**
 * Get authenticated Google Sheets client
 * @returns {Promise<Object>} Authenticated sheets API client
 */
async function getGoogleSheetsAuth() {
  try {
    const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS_JSON?.trim();
    if (!credentialsJson) {
      throw new Error('GOOGLE_SHEETS_CREDENTIALS_JSON is not configured');
    }
    const credentials = JSON.parse(credentialsJson);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return auth;
  } catch (error) {
    throw new PermanentSyncError(`Failed to load Google Sheets credentials: ${error.message}`);
  }
}

function formatRegistrationTimestamp(createdAt) {
  if (!createdAt) {
    return new Date().toISOString();
  }

  if (createdAt instanceof Date) {
    return createdAt.toISOString();
  }

  const parsedDate = new Date(createdAt);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new PermanentSyncError(`Invalid registration timestamp: ${createdAt}`);
  }

  return parsedDate.toISOString();
}

/**
 * Map registration data to Google Sheets row format
 * @param {Object} registration - Registration object from database
 * @returns {Object} Mapped row data
 */
export function mapRegistrationToSheetRow(registration) {
  return {
    ticketId: registration.ticketId,
    attendeeName: registration.attendeeName,
    email: registration.attendeeEmail,
    phone: registration.attendeePhone,
    organization: registration.organization || '',
    role: registration.role || '',
    dietaryRestrictions: registration.dietaryRestrictions || '',
    accessibilityNeeds: registration.accessibilityNeeds || '',
    registrationTimestamp: formatRegistrationTimestamp(registration.createdAt),
  };
}

export function mapRegistrationToSheetValues(registration) {
  const sheetRow = mapRegistrationToSheetRow(registration);
  return REGISTRATION_SHEET_COLUMNS.map((column) => sheetRow[column]);
}

/**
 * Determine if an error is transient or permanent
 * @param {Error} error - The error to classify
 * @returns {boolean} true if transient, false if permanent
 */
function isTransientError(error) {
  // Network errors are transient
  if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
    return true;
  }

  // HTTP status codes
  if (error.status) {
    // 429 = Rate limit (transient)
    if (error.status === 429) {
      return true;
    }

    // 5xx = Server errors (transient)
    if (error.status >= 500) {
      return true;
    }

    // 401/403 = Auth errors (permanent)
    if (error.status === 401 || error.status === 403) {
      return false;
    }

    // 404 = Not found (permanent)
    if (error.status === 404) {
      return false;
    }
  }

  // Timeout errors are transient
  if (error.message && error.message.includes('timeout')) {
    return true;
  }

  // Default to transient for unknown errors
  return true;
}

/**
 * Sync a registration to Google Sheets
 * @param {Object} registration - Registration object with event and ticketType relations
 * @param {Object} config - Configuration object
 * @param {string} config.spreadsheetId - Google Sheets spreadsheet ID
 * @param {string} config.sheetName - Sheet name (default: "Registrations")
 * @returns {Promise<void>}
 * @throws {TransientSyncError} If error is transient and should be retried
 * @throws {PermanentSyncError} If error is permanent and should not be retried
 */
export async function syncRegistrationToSheets(registration, config) {
  const { spreadsheetId, sheetName = 'Registrations' } = config;

  try {
    const auth = await getGoogleSheetsAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Guard against duplicate rows: check if this ticketId already exists in column A.
    // This handles the case where a sync timed out on our side but actually succeeded in Sheets,
    // causing the retry manager to append the same row again.
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:A`,
    });
    const existingTicketIds = (existing.data.values || []).flat();
    if (existingTicketIds.includes(registration.ticketId)) {
      console.log('[GoogleSheets] Registration already in sheet, skipping duplicate sync', {
        ticketId: registration.ticketId,
      });
      return;
    }

    const values = [mapRegistrationToSheetValues(registration)];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:I`,
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });

    if (!response.data.updates || response.data.updates.updatedRows === 0) {
      throw new Error('Failed to append row to sheet');
    }

    console.log('[GoogleSheets] Registration synced successfully', {
      registrationId: registration.id,
      ticketId: registration.ticketId,
      updatedRows: response.data.updates.updatedRows,
    });
  } catch (error) {
    const message = formatGoogleSheetsError(error);
    if (isTransientError(error)) {
      throw new TransientSyncError(message);
    } else {
      throw new PermanentSyncError(message);
    }
  }
}

function formatGoogleSheetsError(error) {
  const apiMessage = error.response?.data?.error?.message || error.message;
  const isPermissionDenied =
    error.code === 403 ||
    error.status === 403 ||
    apiMessage?.includes('permission') ||
    apiMessage?.includes('PERMISSION_DENIED');

  if (!isPermissionDenied) {
    return apiMessage;
  }

  let serviceAccountEmail = 'your service account';
  try {
    const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS_JSON?.trim();
    if (credentialsJson) {
      serviceAccountEmail = JSON.parse(credentialsJson).client_email || serviceAccountEmail;
    }
  } catch {
    // Keep default label if credentials cannot be parsed for logging.
  }

  return (
    `${apiMessage}. Share the spreadsheet (ID: ${process.env.GOOGLE_SHEETS_ID}) with ` +
    `${serviceAccountEmail} as Editor, or update GOOGLE_SHEETS_ID to a sheet this account can access.`
  );
}

/**
 * Initialize Google Sheets with headers if needed
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
export async function initializeGoogleSheet(config) {
  const { spreadsheetId, sheetName = 'Registrations' } = config;

  try {
    const auth = await getGoogleSheetsAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Check if sheet has headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:K1`,
    });

    const headers = response.data.values?.[0];
    const expectedHeaders = REGISTRATION_SHEET_HEADERS;
    const headersMatch =
      headers &&
      headers.length === expectedHeaders.length &&
      expectedHeaders.every((header, index) => headers[index] === header);

    // If headers don't exist or don't match, add them
    if (!headersMatch) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:I1`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [expectedHeaders] },
      });

      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `${sheetName}!J1:K1`,
      });

      console.log('[GoogleSheets] Sheet headers initialized');
    }
  } catch (error) {
    console.error('[GoogleSheets] Failed to initialize sheet:', error.message);
    throw error;
  }
}
