# Requirements Document: Simplified Registration Flow

## 1. Feature Overview

Remove the "My Ticket" verification system to simplify the registration flow. Users will register through a streamlined Form → Payment → Email Confirmation flow, with all ticket information provided via email rather than through a web-based lookup system.

## 2. Functional Requirements

### 2.1 Remove "My Ticket" Page and Navigation

**Priority**: High  
**Description**: Remove the CheckRegistrationPage component and its route from the application, and remove the "My Ticket" navigation link from the Navbar component.

**Acceptance Criteria**:
- CheckRegistrationPage component is deleted
- `/check-registration` route is removed from App.jsx
- "My Ticket" link is removed from Navbar navigation array
- No broken links or references to the removed page

### 2.2 Remove Ticket Lookup API Endpoint

**Priority**: High  
**Description**: Remove the `GET /api/registrations/lookup` endpoint from the backend API.

**Acceptance Criteria**:
- Lookup endpoint handler is removed from registrations.js routes
- Lookup validation schema is removed
- Related test files for lookup functionality are removed or updated
- API documentation updated to reflect removed endpoint

### 2.3 Remove Registration Cancellation API Endpoint

**Priority**: High  
**Description**: Remove the `POST /api/registrations/:id/cancel` endpoint from the backend API.

**Acceptance Criteria**:
- Cancellation endpoint handler is removed from registrations.js routes
- Cancellation validation schema is removed
- `sendCancellationEmail` function remains available for potential admin use
- Related test files for cancellation functionality are removed or updated

### 2.4 Maintain Registration Creation Endpoint

**Priority**: High  
**Description**: Keep the `POST /api/registrations` endpoint functioning with all current validation and business logic.

**Acceptance Criteria**:
- Registration creation endpoint continues to work
- Duplicate email detection remains functional
- Ticket ID generation remains functional
- Confirmation email sending remains functional
- All validation rules remain enforced

### 2.5 Enhance Email Confirmation Content

**Priority**: High  
**Description**: Ensure confirmation emails contain all necessary ticket information since users can no longer look up their registration online.

**Acceptance Criteria**:
- Email includes ticket ID prominently
- Email includes all registration details (name, email, phone, organization, role)
- Email includes event details (name, date, location)
- Email includes ticket type
- Email includes dietary restrictions and accessibility needs if provided
- Email is formatted for easy reading and printing
- Email includes instructions to save for reference

### 2.6 Update Success Page Messaging

**Priority**: Medium  
**Description**: Update the SuccessStep component to emphasize checking email for ticket details.

**Acceptance Criteria**:
- Success message instructs users to check their email
- Success message mentions that ticket details have been sent
- Success message includes ticket ID from registration response
- Success message advises users to save the email for reference
- Success message provides support contact information

### 2.7 Simplify Registration Store

**Priority**: Low  
**Description**: Remove any state management related to ticket lookup functionality from the registration store.

**Acceptance Criteria**:
- Registration store only maintains state needed for registration flow
- Lookup-related state variables are removed if present
- Store remains functional for registration form and success page

### 2.8 Update Error Handling

**Priority**: Medium  
**Description**: Ensure error messages guide users appropriately without referencing removed lookup functionality.

**Acceptance Criteria**:
- Error messages do not reference "My Ticket" page
- Duplicate email error suggests contacting support instead of checking registration
- Network error messages remain clear and actionable
- Email sending failures are logged but don't block registration

## 3. Non-Functional Requirements

### 3.1 Performance

**Priority**: Medium  
**Description**: Registration submission should complete quickly without the overhead of removed endpoints.

**Acceptance Criteria**:
- Registration API response time < 500ms (excluding email sending)
- Email sending is asynchronous and doesn't block API response
- Database queries are optimized with proper indexes

### 3.2 Reliability

**Priority**: High  
**Description**: Email delivery must be reliable since it's the only way users receive ticket information.

**Acceptance Criteria**:
- Email sending failures are logged for monitoring
- Email service has retry logic for transient failures
- Users receive ticket ID on success page even if email fails
- Support team is notified of email delivery failures

### 3.3 Security

**Priority**: High  
**Description**: Maintain security standards with reduced attack surface from removed endpoints.

**Acceptance Criteria**:
- Input validation remains strict on registration endpoint
- Rate limiting remains in place on registration endpoint
- Email addresses are validated before sending
- HTTPS is used for all API communication
- No sensitive data is exposed in error messages

### 3.4 Usability

**Priority**: High  
**Description**: Users should have a clear, simple registration experience.

**Acceptance Criteria**:
- Registration form is easy to understand and complete
- Success page clearly communicates next steps
- Email confirmation is well-formatted and easy to read
- Users understand they need to save their confirmation email

### 3.5 Maintainability

**Priority**: Medium  
**Description**: Codebase should be cleaner with removed complexity.

**Acceptance Criteria**:
- Dead code is removed (CheckRegistrationPage, lookup/cancel endpoints)
- Test files are updated or removed as appropriate
- Documentation reflects the simplified flow
- Code comments are updated where necessary

## 4. User Stories

### 4.1 As a conference attendee, I want to register quickly without unnecessary steps

**Acceptance Criteria**:
- I can fill out the registration form in one page
- I receive immediate confirmation after submitting
- I don't need to navigate through multiple pages or verification steps

### 4.2 As a conference attendee, I want to receive all my ticket information via email

**Acceptance Criteria**:
- I receive a confirmation email immediately after registration
- The email contains my ticket ID prominently
- The email contains all my registration details
- The email contains event details (date, time, location)
- I can save or print the email for my records

### 4.3 As a conference attendee, I want clear instructions on what to do after registering

**Acceptance Criteria**:
- The success page tells me to check my email
- The success page shows my ticket ID
- The success page tells me to save my confirmation email
- The success page provides support contact information if I need help

### 4.4 As a conference organizer, I want to reduce system complexity

**Acceptance Criteria**:
- The "My Ticket" lookup system is completely removed
- The cancellation system is removed from public access
- The codebase is simpler and easier to maintain
- Email confirmations contain all necessary information

### 4.5 As a conference organizer, I want to ensure users have their ticket information

**Acceptance Criteria**:
- Confirmation emails are sent reliably
- Email failures are logged and monitored
- Users see their ticket ID on the success page
- Support team can assist users who don't receive emails

## 5. Technical Constraints

### 5.1 Email Dependency

**Description**: The system now relies entirely on email for ticket information delivery.

**Implications**:
- Email service must be highly reliable
- Email sending failures must be monitored
- Support process must handle users who don't receive emails
- Email templates must be comprehensive and clear

### 5.2 No Self-Service Cancellation

**Description**: Users can no longer cancel their own registrations through the website.

**Implications**:
- Cancellation policy must be clearly communicated
- Support team must handle cancellation requests
- Admin interface may be needed for cancellations (future consideration)

### 5.3 No Online Ticket Lookup

**Description**: Users cannot look up their registration details online.

**Implications**:
- Users must save their confirmation email
- Support team must handle lost ticket ID requests
- Database queries by support team may be needed
- Consider admin interface for support lookups (future consideration)

## 6. Out of Scope

### 6.1 Admin Interface for Ticket Lookup

**Description**: An admin-only interface for looking up registrations is not included in this feature.

**Rationale**: This feature focuses on simplifying the public-facing registration flow. Admin tools can be added separately if needed.

### 6.2 Payment Integration

**Description**: Actual payment processing integration is not included.

**Rationale**: Current system marks registrations as "PAID" automatically. Real payment integration is a separate feature.

### 6.3 Email Customization Interface

**Description**: A UI for customizing email templates is not included.

**Rationale**: Email templates are hardcoded in the email service. Template customization can be added separately if needed.

### 6.4 SMS Notifications

**Description**: SMS-based ticket delivery is not included.

**Rationale**: Email is the primary communication channel. SMS can be added as an enhancement later.

### 6.5 Ticket Transfer or Resale

**Description**: Ability to transfer tickets to another person is not included.

**Rationale**: This is a separate feature that would require additional business logic and user flows.

## 7. Assumptions

### 7.1 Email Reliability

**Assumption**: The SMTP service is reliable and properly configured.

**Validation**: Test email sending in staging environment before deployment.

### 7.2 User Email Access

**Assumption**: Users have access to the email address they provide during registration.

**Validation**: Validate email format during registration; provide support contact for email issues.

### 7.3 Support Team Availability

**Assumption**: Support team is available to handle ticket lookup and cancellation requests.

**Validation**: Document support processes before removing self-service features.

### 7.4 Database Integrity

**Assumption**: Database maintains referential integrity and ticket IDs remain unique.

**Validation**: Database constraints and indexes are properly configured.

### 7.5 No Legal Requirements for Self-Service Cancellation

**Assumption**: There are no legal requirements mandating self-service cancellation.

**Validation**: Confirm with legal/compliance team before removing cancellation feature.

## 8. Dependencies

### 8.1 Email Service Configuration

**Description**: SMTP service must be properly configured with valid credentials.

**Required Environment Variables**:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `ORGANIZER_EMAIL`

### 8.2 Database Schema

**Description**: Existing database schema must support the registration flow.

**Required Tables**:
- `Registration` (with all current fields)
- `Event`
- `TicketType`

### 8.3 Frontend Dependencies

**Description**: Frontend libraries must be compatible with the simplified flow.

**Required Libraries**:
- React 18.x
- React Router 6.x
- Zustand (state management)

### 8.4 Backend Dependencies

**Description**: Backend libraries must support registration creation and email sending.

**Required Libraries**:
- Express.js
- Prisma
- Zod
- Nodemailer

## 9. Success Metrics

### 9.1 Registration Completion Rate

**Metric**: Percentage of users who start registration and complete it successfully.

**Target**: ≥ 85% completion rate

**Measurement**: Track form submissions vs. successful registrations

### 9.2 Email Delivery Rate

**Metric**: Percentage of confirmation emails successfully delivered.

**Target**: ≥ 99% delivery rate

**Measurement**: Monitor email service logs and bounce rates

### 9.3 Support Ticket Volume

**Metric**: Number of support tickets related to registration issues.

**Target**: < 5% of total registrations require support

**Measurement**: Track support tickets tagged with "registration" or "ticket lookup"

### 9.4 User Satisfaction

**Metric**: User feedback on registration experience.

**Target**: ≥ 4.0/5.0 average rating

**Measurement**: Post-registration survey (optional)

### 9.5 System Complexity Reduction

**Metric**: Lines of code and number of API endpoints.

**Target**: 20% reduction in registration-related code

**Measurement**: Compare codebase before and after changes

## 10. Risks and Mitigations

### 10.1 Risk: Users Don't Receive Confirmation Email

**Likelihood**: Medium  
**Impact**: High

**Mitigation**:
- Display ticket ID prominently on success page
- Implement email retry logic
- Monitor email delivery failures
- Provide clear support contact information
- Log all email sending attempts

### 10.2 Risk: Users Lose Their Ticket Information

**Likelihood**: Medium  
**Impact**: Medium

**Mitigation**:
- Emphasize saving email in success page messaging
- Include ticket ID in email subject line
- Make email easy to search and find
- Provide support process for lost ticket IDs
- Consider future admin lookup interface

### 10.3 Risk: Increased Support Burden

**Likelihood**: Medium  
**Impact**: Medium

**Mitigation**:
- Document support processes before launch
- Train support team on new flow
- Create FAQ for common issues
- Monitor support ticket volume
- Consider admin tools if volume is high

### 10.4 Risk: Email Service Outage

**Likelihood**: Low  
**Impact**: High

**Mitigation**:
- Use reliable SMTP service provider
- Implement email queue with retry logic
- Monitor email service health
- Have backup email service configured
- Store all registration data for manual email resend

### 10.5 Risk: User Confusion About Cancellation

**Likelihood**: Low  
**Impact**: Low

**Mitigation**:
- Clearly communicate cancellation policy during registration
- Include cancellation instructions in confirmation email
- Provide support contact for cancellation requests
- Update FAQ and help documentation

## 11. Google Sheets Sync Requirements

### 11.1 Real-Time Sync to Google Sheets

**Priority**: High  
**Description**: Each registration should be immediately synced to Google Sheets after confirmation.

**Acceptance Criteria**:
- WHEN a registration is confirmed, THE System SHALL sync the registration data to Google Sheets within 5 seconds
- WHEN a sync fails, THE System SHALL retry the sync up to 3 times with exponential backoff
- WHEN all retries fail, THE System SHALL log the error and alert the support team
- THE System SHALL not block the registration API response while syncing to Google Sheets

### 11.2 Google Sheets Organization

**Priority**: High  
**Description**: All registrations should be stored in a single sheet with event name as a column for organization.

**Acceptance Criteria**:
- THE Google_Sheets_Sync SHALL use a single sheet for all events
- THE Google_Sheets_Sync SHALL include an "Event Name" column to distinguish registrations by event
- THE Google_Sheets_Sync SHALL append new registrations as rows to the sheet
- THE Google_Sheets_Sync SHALL maintain consistent column order across all registrations

### 11.3 Complete Registration Data Mapping

**Priority**: High  
**Description**: All registration details should be included in the Google Sheets sync.

**Acceptance Criteria**:
- THE Google_Sheets_Sync SHALL include the following columns: Ticket ID, Attendee Name, Email, Phone, Organization, Role, Dietary Restrictions, Accessibility Needs, Ticket Type, Event Name, Registration Timestamp
- THE Google_Sheets_Sync SHALL map all registration fields to corresponding sheet columns
- THE Google_Sheets_Sync SHALL format the Registration Timestamp in ISO 8601 format
- THE Google_Sheets_Sync SHALL handle optional fields gracefully (empty cells for missing data)

### 11.4 Google Sheets API Integration

**Priority**: High  
**Description**: Integrate with Google Sheets API for real-time data synchronization.

**Acceptance Criteria**:
- THE System SHALL authenticate with Google Sheets API using service account credentials
- THE System SHALL use Google Sheets API v4 for all sheet operations
- THE System SHALL validate API responses and handle errors appropriately
- THE System SHALL maintain a connection pool for efficient API usage

### 11.5 Error Handling for Google Sheets API Failures

**Priority**: High  
**Description**: Handle failures in Google Sheets API communication gracefully.

**Acceptance Criteria**:
- IF the Google Sheets API is unavailable, THEN THE System SHALL queue the sync request for retry
- IF authentication fails, THEN THE System SHALL log the error and alert the support team
- IF the sheet is not found, THEN THE System SHALL create the sheet with proper headers
- IF a rate limit is exceeded, THEN THE System SHALL implement exponential backoff retry logic
- WHEN a sync fails after all retries, THEN THE System SHALL store the failed sync in a dead letter queue for manual review

### 11.6 Security for Google Sheets Credentials

**Priority**: High  
**Description**: Protect Google Sheets API credentials and access.

**Acceptance Criteria**:
- THE System SHALL store Google Sheets credentials in environment variables, not in code
- THE System SHALL use service account authentication with minimal required permissions
- THE System SHALL rotate credentials regularly (at least annually)
- THE System SHALL log all Google Sheets API access for audit purposes
- THE System SHALL restrict Google Sheets access to the service account only

### 11.7 Data Mapping Between Registration Model and Google Sheets

**Priority**: High  
**Description**: Define clear mapping between registration data and sheet columns.

**Acceptance Criteria**:
- THE Data_Mapper SHALL map registration.ticketId to "Ticket ID" column
- THE Data_Mapper SHALL map registration.attendeeName to "Attendee Name" column
- THE Data_Mapper SHALL map registration.attendeeEmail to "Email" column
- THE Data_Mapper SHALL map registration.attendeePhone to "Phone" column
- THE Data_Mapper SHALL map registration.organization to "Organization" column
- THE Data_Mapper SHALL map registration.role to "Role" column
- THE Data_Mapper SHALL map registration.dietaryRestrictions to "Dietary Restrictions" column
- THE Data_Mapper SHALL map registration.accessibilityNeeds to "Accessibility Needs" column
- THE Data_Mapper SHALL map registration.ticketType.name to "Ticket Type" column
- THE Data_Mapper SHALL map registration.event.name to "Event Name" column
- THE Data_Mapper SHALL map registration.createdAt to "Registration Timestamp" column

### 11.8 Retry Logic for Failed Syncs

**Priority**: High  
**Description**: Implement robust retry logic for failed Google Sheets syncs.

**Acceptance Criteria**:
- THE Retry_Manager SHALL retry failed syncs with exponential backoff (1s, 2s, 4s)
- THE Retry_Manager SHALL attempt up to 3 retries before marking as failed
- THE Retry_Manager SHALL skip retries for permanent errors (authentication, invalid sheet)
- THE Retry_Manager SHALL log each retry attempt with timestamp and error details
- THE Retry_Manager SHALL move permanently failed syncs to a dead letter queue

### 11.9 Monitoring and Alerting

**Priority**: Medium  
**Description**: Monitor Google Sheets sync performance and alert on failures.

**Acceptance Criteria**:
- THE System SHALL track sync success rate and log metrics
- THE System SHALL alert the support team when sync success rate drops below 95%
- THE System SHALL provide a dashboard showing sync status and recent failures
- THE System SHALL log all sync operations for audit and debugging purposes

### 11.10 Backward Compatibility

**Priority**: Medium  
**Description**: Ensure Google Sheets sync doesn't break existing registration flow.

**Acceptance Criteria**:
- THE System SHALL not modify the registration API response or behavior
- THE System SHALL not add latency to the registration API response
- THE System SHALL handle cases where Google Sheets sync is disabled gracefully
- THE System SHALL allow disabling Google Sheets sync via configuration

## 12. Acceptance Criteria Summary

The simplified registration flow feature with Google Sheets sync is considered complete when:

1. ✅ CheckRegistrationPage component and route are removed
2. ✅ "My Ticket" navigation link is removed from Navbar
3. ✅ `GET /api/registrations/lookup` endpoint is removed
4. ✅ `POST /api/registrations/:id/cancel` endpoint is removed
5. ✅ Registration creation endpoint continues to function correctly
6. ✅ Confirmation emails contain all necessary ticket information
7. ✅ Success page emphasizes checking email for ticket details
8. ✅ All tests pass with updated or removed test files
9. ✅ Documentation is updated to reflect the simplified flow
10. ✅ Email delivery is monitored and reliable
11. ✅ Support processes are documented for ticket lookup and cancellation
12. ✅ No broken links or references to removed functionality
13. ✅ Security and performance standards are maintained
14. ✅ User experience is clear and straightforward
15. ✅ Google Sheets sync is implemented and tested
16. ✅ Real-time sync occurs within 5 seconds of registration confirmation
17. ✅ All registration data is correctly mapped to Google Sheets columns
18. ✅ Retry logic handles transient failures gracefully
19. ✅ Google Sheets credentials are securely stored and managed
20. ✅ Sync failures are logged and monitored
21. ✅ Google Sheets sync does not impact registration API performance

## 13. Approval and Sign-off

**Requirements Author**: [AI Agent]  
**Date**: [Current Date]

**Stakeholder Approval Required**:
- [ ] Product Owner
- [ ] Technical Lead
- [ ] Support Team Lead
- [ ] Security Team

**Notes**: This requirements document should be reviewed and approved by all stakeholders before implementation begins, particularly regarding the removal of self-service cancellation functionality.
