# Testing Guide - Simplified Registration Flow

## Overview

This guide provides comprehensive testing procedures for the simplified registration flow. Tests should be performed in the following order:

1. Unit Tests (automated)
2. Integration Tests (automated)
3. Manual Testing (staging environment)
4. Performance Testing (staging environment)
5. Security Testing (staging environment)
6. Browser/Device Testing (staging environment)
7. Production Verification (production environment)

---

## Unit Tests

### Backend Unit Tests

**Location:** `backend/src/routes/registrations.test.js`

**Run Command:**
```bash
npm test -- registrations.test.js
```

**Test Cases:**
- [x] Create registration with all fields
- [x] Return 409 Conflict for duplicate email
- [x] Use default ticket type when not provided
- [x] Send confirmation email asynchronously
- [x] Return success with ticketId and registrationId
- [x] Validate optional fields
- [x] Check for duplicate email before creating
- [x] Return DUPLICATE_EMAIL error code
- [x] Set status to CONFIRMED and paymentStatus to PAID
- [x] Handle email sending failures gracefully

**Expected Results:**
- All tests pass
- No errors or warnings
- Email service called asynchronously

### Security Unit Tests

**Location:** `backend/src/routes/registrations.security.test.js`

**Run Command:**
```bash
npm test -- registrations.security.test.js
```

**Test Cases:**
- [x] Reject XSS attempts in name field
- [x] Trim whitespace from all fields
- [x] Convert email to lowercase
- [x] Reject name longer than 100 characters
- [x] Reject email longer than 255 characters
- [x] Reject phone with invalid characters
- [x] Accept valid phone formats
- [x] Reject phone longer than 20 characters
- [x] Reject organization longer than 200 characters
- [x] Reject dietary restrictions longer than 500 characters
- [x] Convert empty strings to undefined
- [x] Protect against SQL injection

**Expected Results:**
- All tests pass
- Input validation working correctly
- No security vulnerabilities

---

## Integration Tests

### Complete Registration Flow

**Test Scenario:** User completes full registration flow

**Steps:**
1. Navigate to `/register`
2. Fill out registration form with valid data
3. Submit form
4. Verify success page displays
5. Verify ticket ID is shown
6. Verify email is sent
7. Check email for confirmation

**Expected Results:**
- Form submits successfully
- Success page displays with ticket ID
- Email received within 5 seconds
- Email contains all registration details
- Email includes ticket ID prominently

**Test Data:**
```json
{
  "attendeeName": "Test User",
  "attendeeEmail": "test@example.com",
  "attendeePhone": "+1 (555) 123-4567",
  "organization": "Test Corp",
  "role": "Tester",
  "dietaryRestrictions": "None",
  "accessibilityNeeds": "None"
}
```

### Duplicate Email Handling

**Test Scenario:** User tries to register with email already registered

**Steps:**
1. Register first user with email: test1@example.com
2. Try to register second user with same email
3. Verify error message displays
4. Verify error suggests contacting support

**Expected Results:**
- First registration succeeds
- Second registration fails with 409 Conflict
- Error message: "This email is already registered for the event. If you need assistance, please contact our support team..."
- User can retry with different email

### Validation Error Handling

**Test Scenario:** User submits form with invalid data

**Test Cases:**
1. Empty name field
2. Invalid email format
3. Phone number too short
4. Organization name too long
5. Dietary restrictions too long

**Expected Results:**
- Form validation prevents submission
- Error messages display for each field
- User can correct and resubmit

### Network Error Handling

**Test Scenario:** Network connection fails during submission

**Steps:**
1. Disable network connection
2. Submit registration form
3. Verify error message displays
4. Re-enable network connection
5. Verify user can retry

**Expected Results:**
- Error message: "Unable to connect to the server..."
- User can retry after connection restored
- No data loss

### Server Error Handling

**Test Scenario:** Server returns 500 error

**Steps:**
1. Simulate server error
2. Submit registration form
3. Verify error message displays
4. Verify user can retry

**Expected Results:**
- Error message: "Server error occurred..."
- User can retry
- No data loss

---

## Manual Testing - Staging Environment

### Test Environment Setup

**Prerequisites:**
- Staging environment deployed
- Test database populated with event and ticket types
- Email service configured and tested
- Test email account set up

**Test Credentials:**
- Event: AllHealthTech Conference 2025
- Ticket Type: General Admission
- Email: test-registrations@example.com

### Registration Form Testing

**Test Case 1: Basic Registration**
- [ ] Navigate to `/register`
- [ ] Form displays correctly
- [ ] All fields are visible
- [ ] Required fields marked with asterisk
- [ ] Optional fields labeled as optional
- [ ] Submit button is enabled

**Test Case 2: Form Validation**
- [ ] Leave name empty, try to submit → Error displays
- [ ] Enter invalid email, try to submit → Error displays
- [ ] Enter phone < 7 characters, try to submit → Error displays
- [ ] Enter organization > 200 characters → Error displays
- [ ] Correct errors, form submits successfully

**Test Case 3: Form Submission**
- [ ] Fill out all fields with valid data
- [ ] Click submit button
- [ ] Loading state displays
- [ ] Form is disabled during submission
- [ ] Success page displays after submission

**Test Case 4: Success Page**
- [ ] Ticket ID displays prominently
- [ ] Event details display correctly
- [ ] Support contact information displays
- [ ] Instructions to check email display
- [ ] "Back to Home" button works

**Test Case 5: Email Delivery**
- [ ] Check email inbox
- [ ] Email received within 5 seconds
- [ ] Email subject includes ticket ID
- [ ] Email contains all registration details
- [ ] Email is formatted correctly
- [ ] Email includes support contact information

### Error Scenario Testing

**Test Case 6: Duplicate Email**
- [ ] Register first user with email: test1@example.com
- [ ] Try to register second user with same email
- [ ] Error message displays: "This email is already registered..."
- [ ] Error message suggests contacting support
- [ ] User can try with different email

**Test Case 7: Network Error**
- [ ] Disable network connection
- [ ] Try to submit form
- [ ] Error message displays: "Unable to connect to the server..."
- [ ] Re-enable network connection
- [ ] User can retry

**Test Case 8: Server Error**
- [ ] Simulate server error (500)
- [ ] Try to submit form
- [ ] Error message displays: "Server error occurred..."
- [ ] User can retry

### Mobile Testing

**Test Case 9: Mobile Form**
- [ ] Navigate to `/register` on mobile device
- [ ] Form displays correctly on small screen
- [ ] All fields are accessible
- [ ] Keyboard doesn't cover form
- [ ] Submit button is easily clickable
- [ ] Success page displays correctly

**Test Case 10: Mobile Navigation**
- [ ] Navbar displays correctly on mobile
- [ ] Mobile menu opens/closes
- [ ] All navigation links work
- [ ] "Register Now" button works

---

## Performance Testing

### Response Time Testing

**Test Case 1: API Response Time**
- [ ] Measure registration API response time
- [ ] Expected: < 500ms (excluding email)
- [ ] Test with various payload sizes
- [ ] Test with concurrent requests

**Test Case 2: Email Sending**
- [ ] Verify email sending is asynchronous
- [ ] Verify API response doesn't wait for email
- [ ] Measure email delivery time
- [ ] Expected: < 5 seconds

**Test Case 3: Concurrent Registrations**
- [ ] Submit 10 concurrent registrations
- [ ] Verify all succeed
- [ ] Verify no data loss
- [ ] Verify all emails sent

**Test Case 4: Database Performance**
- [ ] Monitor database query time
- [ ] Verify indexes are used
- [ ] Check for slow queries
- [ ] Monitor connection pool

### Load Testing

**Test Case 5: High Load**
- [ ] Submit 100 registrations in 1 minute
- [ ] Verify system handles load
- [ ] Monitor response times
- [ ] Monitor error rates
- [ ] Monitor resource usage

---

## Security Testing

### Input Validation Testing

**Test Case 1: XSS Prevention**
- [ ] Try to submit: `<script>alert('xss')</script>` in name field
- [ ] Verify script is not executed
- [ ] Verify data is sanitized

**Test Case 2: SQL Injection Prevention**
- [ ] Try to submit: `' OR '1'='1` in email field
- [ ] Verify query fails validation
- [ ] Verify no data is exposed

**Test Case 3: Field Length Validation**
- [ ] Try to submit name > 100 characters → Rejected
- [ ] Try to submit email > 255 characters → Rejected
- [ ] Try to submit phone > 20 characters → Rejected
- [ ] Try to submit organization > 200 characters → Rejected

**Test Case 4: Email Format Validation**
- [ ] Try to submit invalid email formats → Rejected
- [ ] Valid formats accepted:
  - user@example.com
  - user.name@example.com
  - user+tag@example.co.uk

### Rate Limiting Testing

**Test Case 5: Rate Limiting**
- [ ] Submit 10 requests from same IP in 1 minute
- [ ] Verify rate limit is enforced
- [ ] Verify 429 Too Many Requests returned
- [ ] Verify rate limit resets after timeout

### HTTPS Testing

**Test Case 6: HTTPS Enforcement**
- [ ] Verify all API calls use HTTPS
- [ ] Verify no HTTP fallback
- [ ] Verify SSL certificate is valid
- [ ] Verify no mixed content warnings

---

## Browser Testing

### Desktop Browsers

**Test Case 1: Chrome (Latest)**
- [ ] Form displays correctly
- [ ] All functionality works
- [ ] No console errors
- [ ] Email received

**Test Case 2: Firefox (Latest)**
- [ ] Form displays correctly
- [ ] All functionality works
- [ ] No console errors
- [ ] Email received

**Test Case 3: Safari (Latest)**
- [ ] Form displays correctly
- [ ] All functionality works
- [ ] No console errors
- [ ] Email received

**Test Case 4: Edge (Latest)**
- [ ] Form displays correctly
- [ ] All functionality works
- [ ] No console errors
- [ ] Email received

### Mobile Browsers

**Test Case 5: iOS Safari**
- [ ] Form displays correctly
- [ ] All functionality works
- [ ] Keyboard handling works
- [ ] Email received

**Test Case 6: Android Chrome**
- [ ] Form displays correctly
- [ ] All functionality works
- [ ] Keyboard handling works
- [ ] Email received

---

## Accessibility Testing

### WCAG 2.1 Compliance

**Test Case 1: Keyboard Navigation**
- [ ] Tab through all form fields
- [ ] Tab order is logical
- [ ] All buttons are keyboard accessible
- [ ] Enter key submits form

**Test Case 2: Screen Reader Testing**
- [ ] Form labels are announced correctly
- [ ] Error messages are announced
- [ ] Success message is announced
- [ ] All buttons are announced

**Test Case 3: Color Contrast**
- [ ] Text has sufficient contrast
- [ ] Error messages are visible
- [ ] Links are distinguishable

**Test Case 4: Form Labels**
- [ ] All fields have labels
- [ ] Labels are associated with inputs
- [ ] Required fields are marked

---

## Production Verification

### Pre-Production Checklist

- [ ] All tests passing
- [ ] Email service configured
- [ ] Support team trained
- [ ] Documentation updated
- [ ] Rollback plan documented

### Production Deployment

**Test Case 1: Deployment Verification**
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] No errors in logs
- [ ] All endpoints responding

**Test Case 2: Production Registration**
- [ ] Complete registration flow works
- [ ] Email delivered to production email
- [ ] Ticket ID generated correctly
- [ ] Database updated correctly

**Test Case 3: Production Monitoring**
- [ ] Email delivery rate monitored
- [ ] Registration completion rate monitored
- [ ] API error rate monitored
- [ ] Support ticket volume monitored

### Post-Production Monitoring

**Daily Checks:**
- [ ] Email delivery rate ≥ 99%
- [ ] Registration completion rate ≥ 85%
- [ ] API error rate < 1%
- [ ] No critical errors in logs

**Weekly Reports:**
- [ ] Total registrations
- [ ] Email delivery metrics
- [ ] Support ticket volume
- [ ] System performance

---

## Test Data

### Valid Registration Data
```json
{
  "attendeeName": "Jane Doe",
  "attendeeEmail": "jane@example.com",
  "attendeePhone": "+1 (555) 123-4567",
  "organization": "Acme Corp",
  "role": "Product Manager",
  "dietaryRestrictions": "Vegetarian",
  "accessibilityNeeds": "Wheelchair access"
}
```

### Invalid Registration Data
```json
{
  "attendeeName": "",
  "attendeeEmail": "invalid-email",
  "attendeePhone": "123",
  "organization": "A".repeat(201),
  "role": "A".repeat(101),
  "dietaryRestrictions": "A".repeat(501),
  "accessibilityNeeds": "A".repeat(501)
}
```

---

## Test Results Template

### Test Execution Report

**Date:** [Date]  
**Tester:** [Name]  
**Environment:** [Staging/Production]  
**Build Version:** [Version]

| Test Case | Status | Notes |
|-----------|--------|-------|
| Basic Registration | PASS/FAIL | |
| Duplicate Email | PASS/FAIL | |
| Validation Errors | PASS/FAIL | |
| Network Error | PASS/FAIL | |
| Email Delivery | PASS/FAIL | |
| Mobile Form | PASS/FAIL | |
| Performance | PASS/FAIL | |
| Security | PASS/FAIL | |
| Accessibility | PASS/FAIL | |

**Summary:**
- Total Tests: [Number]
- Passed: [Number]
- Failed: [Number]
- Blocked: [Number]

**Issues Found:**
1. [Issue 1]
2. [Issue 2]

**Recommendations:**
1. [Recommendation 1]
2. [Recommendation 2]

---

## Continuous Testing

### Automated Tests
- Run unit tests on every commit
- Run integration tests on every PR
- Run security tests weekly
- Run performance tests weekly

### Manual Testing
- Test in staging before each production deployment
- Test on multiple browsers and devices
- Test error scenarios
- Test edge cases

### Monitoring
- Monitor email delivery rate daily
- Monitor registration completion rate daily
- Monitor API error rate daily
- Monitor support ticket volume daily

---

**Last Updated:** 2026-05-11  
**Version:** 1.0  
**Status:** Active
