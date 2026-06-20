# Plan: Registration Process DB Logging

## Context
The system currently logs all registration and payment events only to `console.log` (stdout). These logs disappear on server restart and cannot be queried, audited, or monitored. The goal is to persist every step — form submission → Razorpay payment → registration confirmation → email → Google Sheets sync — into a PostgreSQL `RegistrationLog` table.

---

## Senior Developer Recommendation: Write Directly to PostgreSQL

**Do NOT use a cron job or an external intermediate store (Firebase, file, Redis).** Here is why:

| Approach | Complexity | Reliability | Recommendation |
|---|---|---|---|
| Direct write to PostgreSQL (async, fire-and-forget) | Low | High | ✅ Best for this use case |
| Write to Firebase → cron → PostgreSQL | High | Low (two failure points) | ❌ Avoid |
| Write to log file → cron → PostgreSQL | Medium | Medium | ❌ Avoid |

**Reasons to write directly:**
- You already have Prisma + PostgreSQL — adding one table is trivial
- Each log write takes < 5ms and is done **asynchronously** (fire-and-forget), so it never slows down the registration or payment response
- Cron jobs add delay (you only see logs every N minutes) and a second point of failure
- For an event registration site (not millions of requests/sec), direct writes are perfectly scalable

---

## Full Registration Flow (events to log)

```
1. FORM_SUBMITTED           → User submitted the registration form
2. AVAILABILITY_CHECKED     → Email/phone duplicate check result
3. PAYMENT_ORDER_CREATED    → Razorpay order created (orderId assigned)
4. PAYMENT_INITIATED        → User opened Razorpay checkout modal
5. PAYMENT_COMPLETED        → Razorpay confirmed payment success
6. PAYMENT_CANCELLED        → User dismissed the payment modal
7. PAYMENT_FAILED           → Razorpay payment failed
8. PAYMENT_VERIFIED         → Backend verified HMAC-SHA256 signature
9. PAYMENT_REUSE_CHECKED    → Check same paymentId not used twice
10. REGISTRATION_CREATED    → DB record committed, ticketId assigned
11. EMAIL_SENT              → Confirmation email sent via AWS SES
12. EMAIL_FAILED            → Email delivery failed
13. SHEETS_SYNCED           → Row appended to Google Sheets
14. SHEETS_SYNC_FAILED      → Sheets sync failed, queued for retry
15. SHEETS_SYNC_DEAD_LETTER → Permanent failure after all retries
```

---

## Step 1 — Run This SQL in PostgreSQL to Create the Table

Run this directly in **psql**, **pgAdmin**, or **TablePlus**:

```sql
-- ── 1. Create enum types ──────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE log_event AS ENUM (
    'FORM_SUBMITTED',
    'AVAILABILITY_CHECKED',
    'PAYMENT_ORDER_CREATED',
    'PAYMENT_INITIATED',
    'PAYMENT_COMPLETED',
    'PAYMENT_CANCELLED',
    'PAYMENT_FAILED',
    'PAYMENT_VERIFIED',
    'PAYMENT_REUSE_CHECKED',
    'REGISTRATION_CREATED',
    'EMAIL_SENT',
    'EMAIL_FAILED',
    'SHEETS_SYNCED',
    'SHEETS_SYNC_FAILED',
    'SHEETS_SYNC_DEAD_LETTER'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE log_status AS ENUM (
    'SUCCESS',
    'FAILED',
    'PENDING',
    'CANCELLED',
    'SKIPPED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 2. Create the log table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS "RegistrationLog" (
  "id"                 TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "sessionId"          TEXT,              -- Frontend UUID to group one registration attempt
  "registrationId"     TEXT,              -- FK to Registration.id (NULL until record is created)
  "ticketId"           TEXT,              -- Filled after REGISTRATION_CREATED
  "event"              log_event   NOT NULL,
  "status"             log_status  NOT NULL,
  "attendeeEmail"      TEXT,              -- Masked: first3***@domain
  "attendeePhone"      TEXT,              -- Masked: ****1234
  "razorpayOrderId"    TEXT,
  "razorpayPaymentId"  TEXT,
  "amountPaise"        INTEGER,           -- e.g. 299900 = INR 2,999
  "message"            TEXT,              -- Human-readable description of this event
  "errorCode"          TEXT,              -- e.g. PAYMENT_VERIFICATION_FAILED
  "errorMessage"       TEXT,              -- Full error message on failure
  "ipAddress"          TEXT,              -- Client IP
  "userAgent"          TEXT,              -- Browser / app info
  "durationMs"         INTEGER,           -- How long this step took (ms)
  "metadata"           JSONB,             -- Any extra structured data
  "createdAt"          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "RegistrationLog_pkey" PRIMARY KEY ("id")
);

-- ── 3. Create indexes ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS "idx_reglog_registrationId"    ON "RegistrationLog" ("registrationId");
CREATE INDEX IF NOT EXISTS "idx_reglog_sessionId"         ON "RegistrationLog" ("sessionId");
CREATE INDEX IF NOT EXISTS "idx_reglog_event"             ON "RegistrationLog" ("event");
CREATE INDEX IF NOT EXISTS "idx_reglog_status"            ON "RegistrationLog" ("status");
CREATE INDEX IF NOT EXISTS "idx_reglog_createdAt"         ON "RegistrationLog" ("createdAt");
CREATE INDEX IF NOT EXISTS "idx_reglog_razorpayOrderId"   ON "RegistrationLog" ("razorpayOrderId");
CREATE INDEX IF NOT EXISTS "idx_reglog_razorpayPaymentId" ON "RegistrationLog" ("razorpayPaymentId");
```

---

## Step 2 — Manual INSERT Queries (one per event)

### 1. Form Submitted
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "event", "status", "attendeeEmail", "attendeePhone", "ipAddress", "userAgent", "message")
VALUES
  ('sess_abc123', 'FORM_SUBMITTED', 'SUCCESS',
   'sre***@gmail.com', '******1234',
   '192.168.1.1', 'Mozilla/5.0 Chrome/120',
   'User submitted registration form');
```

### 2. Availability Checked — OK
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "event", "status", "attendeeEmail", "attendeePhone", "message", "metadata")
VALUES
  ('sess_abc123', 'AVAILABILITY_CHECKED', 'SUCCESS',
   'sre***@gmail.com', '******1234',
   'Email and phone are available',
   '{"emailAvailable": true, "phoneAvailable": true}'::jsonb);
```

### 3. Availability Checked — Already Registered
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "event", "status", "attendeeEmail", "message", "errorCode", "metadata")
VALUES
  ('sess_abc123', 'AVAILABILITY_CHECKED', 'FAILED',
   'sre***@gmail.com',
   'Email already registered',
   'EMAIL_ALREADY_REGISTERED',
   '{"emailAvailable": false, "phoneAvailable": true}'::jsonb);
```

### 4. Razorpay Order Created
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "event", "status", "attendeeEmail", "razorpayOrderId", "amountPaise", "durationMs", "message")
VALUES
  ('sess_abc123', 'PAYMENT_ORDER_CREATED', 'SUCCESS',
   'sre***@gmail.com', 'order_ABC123XYZ', 299900, 320,
   'Razorpay order created successfully');
```

### 5. Payment Initiated (user opened modal)
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "event", "status", "attendeeEmail", "razorpayOrderId", "message")
VALUES
  ('sess_abc123', 'PAYMENT_INITIATED', 'PENDING',
   'sre***@gmail.com', 'order_ABC123XYZ',
   'Razorpay payment modal opened by user');
```

### 6. Payment Completed
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "event", "status", "attendeeEmail",
   "razorpayOrderId", "razorpayPaymentId", "amountPaise", "message")
VALUES
  ('sess_abc123', 'PAYMENT_COMPLETED', 'SUCCESS',
   'sre***@gmail.com', 'order_ABC123XYZ', 'pay_XYZ789', 299900,
   'User completed payment via Razorpay');
```

### 7. Payment Cancelled (user dismissed modal)
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "event", "status", "attendeeEmail", "razorpayOrderId", "message", "metadata")
VALUES
  ('sess_abc123', 'PAYMENT_CANCELLED', 'CANCELLED',
   'sre***@gmail.com', 'order_ABC123XYZ',
   'User cancelled payment modal',
   '{"reason": "modal_dismissed"}'::jsonb);
```

### 8. Payment Signature Verified — OK
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "event", "status", "attendeeEmail",
   "razorpayOrderId", "razorpayPaymentId", "message")
VALUES
  ('sess_abc123', 'PAYMENT_VERIFIED', 'SUCCESS',
   'sre***@gmail.com', 'order_ABC123XYZ', 'pay_XYZ789',
   'HMAC-SHA256 signature verified successfully');
```

### 9. Payment Verification Failed
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "event", "status", "attendeeEmail",
   "razorpayOrderId", "razorpayPaymentId", "errorCode", "message")
VALUES
  ('sess_abc123', 'PAYMENT_VERIFIED', 'FAILED',
   'sre***@gmail.com', 'order_ABC123XYZ', 'pay_XYZ789',
   'PAYMENT_VERIFICATION_FAILED',
   'Razorpay signature mismatch');
```

### 10. Registration Created (ticket assigned)
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "registrationId", "ticketId", "event", "status",
   "attendeeEmail", "razorpayOrderId", "razorpayPaymentId",
   "amountPaise", "durationMs", "message")
VALUES
  ('sess_abc123', 'cluid_reg_001', 'AHT-2024-001',
   'REGISTRATION_CREATED', 'SUCCESS',
   'sre***@gmail.com', 'order_ABC123XYZ', 'pay_XYZ789',
   299900, 45,
   'Registration created and ticket AHT-2024-001 assigned');
```

### 11. Confirmation Email Sent
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "registrationId", "ticketId", "event", "status",
   "attendeeEmail", "durationMs", "message")
VALUES
  ('sess_abc123', 'cluid_reg_001', 'AHT-2024-001',
   'EMAIL_SENT', 'SUCCESS',
   'sre***@gmail.com', 850,
   'Confirmation email sent via AWS SES');
```

### 12. Email Failed
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "registrationId", "ticketId", "event", "status",
   "attendeeEmail", "errorCode", "errorMessage", "message")
VALUES
  ('sess_abc123', 'cluid_reg_001', 'AHT-2024-001',
   'EMAIL_FAILED', 'FAILED',
   'sre***@gmail.com', 'SES_SEND_ERROR', 'Sending paused for this account',
   'Confirmation email failed');
```

### 13. Google Sheets Synced
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "registrationId", "ticketId", "event", "status",
   "attendeeEmail", "durationMs", "message")
VALUES
  ('sess_abc123', 'cluid_reg_001', 'AHT-2024-001',
   'SHEETS_SYNCED', 'SUCCESS',
   'sre***@gmail.com', 1100,
   'Row appended to Google Sheets successfully');
```

### 14. Sheets Sync Failed (queued for retry)
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "registrationId", "ticketId", "event", "status",
   "attendeeEmail", "errorCode", "errorMessage", "message", "metadata")
VALUES
  ('sess_abc123', 'cluid_reg_001', 'AHT-2024-001',
   'SHEETS_SYNC_FAILED', 'FAILED',
   'sre***@gmail.com', 'TRANSIENT_ERROR', 'connect ECONNREFUSED',
   'Sheets sync failed — queued for retry',
   '{"retryCount": 1, "nextRetryTime": "2024-01-15T10:05:00Z"}'::jsonb);
```

### 15. Dead Letter (permanent failure)
```sql
INSERT INTO "RegistrationLog"
  ("sessionId", "registrationId", "ticketId", "event", "status",
   "attendeeEmail", "errorCode", "errorMessage", "message", "metadata")
VALUES
  ('sess_abc123', 'cluid_reg_001', 'AHT-2024-001',
   'SHEETS_SYNC_DEAD_LETTER', 'FAILED',
   'sre***@gmail.com', 'PERMANENT_ERROR', 'Invalid spreadsheet ID',
   'Moved to dead letter queue after all retries exhausted',
   '{"retryCount": 5}'::jsonb);
```

---

## Step 3 — Useful SELECT Queries

### Full journey for one registration (by ticketId)
```sql
SELECT event, status, message, "razorpayOrderId", "razorpayPaymentId",
       "durationMs", "errorCode", "errorMessage", "createdAt"
FROM "RegistrationLog"
WHERE "ticketId" = 'AHT-2024-001'
ORDER BY "createdAt" ASC;
```

### Full journey by sessionId (before ticketId is assigned)
```sql
SELECT event, status, message, "durationMs", "errorCode", "createdAt"
FROM "RegistrationLog"
WHERE "sessionId" = 'sess_abc123'
ORDER BY "createdAt" ASC;
```

### All failed payments today
```sql
SELECT "attendeeEmail", "razorpayOrderId", "errorCode", "errorMessage", "createdAt"
FROM "RegistrationLog"
WHERE event IN ('PAYMENT_VERIFIED', 'PAYMENT_FAILED')
  AND status = 'FAILED'
  AND "createdAt" >= CURRENT_DATE
ORDER BY "createdAt" DESC;
```

### Registrations per day
```sql
SELECT DATE("createdAt") AS day, COUNT(*) AS registrations
FROM "RegistrationLog"
WHERE event = 'REGISTRATION_CREATED' AND status = 'SUCCESS'
GROUP BY day
ORDER BY day DESC;
```

### Funnel — how many reached each step
```sql
SELECT event, status, COUNT(*) AS count
FROM "RegistrationLog"
GROUP BY event, status
ORDER BY MIN("createdAt");
```

### Who paid but has email failure
```sql
SELECT "ticketId", "attendeeEmail", "errorMessage", "createdAt"
FROM "RegistrationLog"
WHERE event = 'EMAIL_FAILED';
```

---

## Step 4 — Add to Prisma Schema (so Prisma manages it going forward)

Add to `backend/prisma/schema.prisma`:

```prisma
enum LogEvent {
  FORM_SUBMITTED
  AVAILABILITY_CHECKED
  PAYMENT_ORDER_CREATED
  PAYMENT_INITIATED
  PAYMENT_COMPLETED
  PAYMENT_CANCELLED
  PAYMENT_FAILED
  PAYMENT_VERIFIED
  PAYMENT_REUSE_CHECKED
  REGISTRATION_CREATED
  EMAIL_SENT
  EMAIL_FAILED
  SHEETS_SYNCED
  SHEETS_SYNC_FAILED
  SHEETS_SYNC_DEAD_LETTER
}

enum LogStatus {
  SUCCESS
  FAILED
  PENDING
  CANCELLED
  SKIPPED
}

model RegistrationLog {
  id                 String    @id @default(cuid())
  sessionId          String?
  registrationId     String?
  ticketId           String?
  event              LogEvent
  status             LogStatus
  attendeeEmail      String?
  attendeePhone      String?
  razorpayOrderId    String?
  razorpayPaymentId  String?
  amountPaise        Int?
  message            String?
  errorCode          String?
  errorMessage       String?
  ipAddress          String?
  userAgent          String?
  durationMs         Int?
  metadata           Json?
  createdAt          DateTime  @default(now())

  @@index([registrationId])
  @@index([sessionId])
  @@index([event])
  @@index([status])
  @@index([createdAt])
  @@index([razorpayOrderId])
  @@index([razorpayPaymentId])
}
```

Then run: `npx prisma migrate dev --name add_registration_log`

---

## Files to modify when wiring logs into code (next step)

| File | What to add |
|---|---|
| `backend/prisma/schema.prisma` | Add `RegistrationLog` model + enums |
| `backend/src/routes/payments.js` | Log `PAYMENT_ORDER_CREATED`, `PAYMENT_CANCELLED` |
| `backend/src/routes/registrations.js` | Log all steps from availability check to ticket creation |
| `backend/src/services/emailService.js` | Log `EMAIL_SENT` / `EMAIL_FAILED` |
| `backend/src/services/googleSheetsService.js` | Log `SHEETS_SYNCED` / `SHEETS_SYNC_FAILED` |

All log writes should be **fire-and-forget** (`.catch(err => console.error(...))`) so they never block the registration response.

---

## Verification

1. Run Step 1 DDL in psql → confirm table + indexes created
2. Run a few Step 2 INSERT queries → confirm rows appear
3. Run Step 3 SELECT queries → confirm data is visible and filterable
4. Check index usage: `EXPLAIN ANALYZE SELECT * FROM "RegistrationLog" WHERE "registrationId" = 'xxx'`
