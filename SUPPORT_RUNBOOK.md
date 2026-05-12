# Support Runbook - Simplified Registration Flow

## Overview

This runbook provides support team members with step-by-step procedures for handling common registration-related requests in the simplified registration flow.

## Common Support Scenarios

## 1. User Lost Confirmation Email

### Symptoms
- User cannot find their confirmation email
- User needs ticket ID for check-in
- User needs event details

### Resolution Steps

1. **Collect Information**
   - Ask for the email address used during registration
   - Ask for the name used during registration
   - Verify user identity if needed

2. **Look Up Registration**
   - Access the database or admin panel
   - Query: `SELECT * FROM registrations WHERE attendeeEmail = ? AND status != 'CANCELLED'`
   - Verify the name matches

3. **Provide Information**
   - Share the ticket ID (format: AHT-2025-XXXXX)
   - Share event date and location
   - Share event name

4. **Resend Email (Optional)**
   - If user requests, resend the confirmation email
   - Use the resend function in the admin panel
   - Confirm email was sent successfully

5. **Document**
   - Log the support ticket
   - Note the resolution
   - Track for monitoring

### Example Response
```
Thank you for contacting us! I found your registration.

Your Ticket ID: AHT-2025-00123
Event: AllHealthTech Conference 2025
Date: October 15-17, 2025
Location: San Francisco Convention Center, CA

I've resent your confirmation email to [email]. Please check your inbox and spam folder. 
If you don't receive it within 5 minutes, please let me know.

You'll need your Ticket ID for check-in at the event.
```

---

## 2. User Wants to Cancel Registration

### Symptoms
- User requests cancellation
- User wants refund
- User cannot attend event

### Resolution Steps

1. **Verify User Identity**
   - Ask for email address
   - Ask for ticket ID
   - Ask for name
   - Verify information matches database

2. **Check Cancellation Policy**
   - Verify cancellation is allowed
   - Check refund eligibility
   - Note any deadlines

3. **Process Cancellation**
   - Update registration status to "CANCELLED"
   - Record cancellation timestamp
   - Generate refund ID if applicable
   - Calculate refund amount

4. **Send Cancellation Email**
   - Use sendCancellationEmail() function
   - Include ticket ID
   - Include refund amount and status
   - Include refund timeline

5. **Process Refund**
   - If applicable, initiate refund
   - Note refund method (original payment method)
   - Provide refund timeline (typically 5-7 business days)

6. **Document**
   - Log the cancellation
   - Note reason if provided
   - Track for monitoring

### Example Response
```
Thank you for letting us know. I've processed your cancellation.

Ticket ID: AHT-2025-00123
Refund Amount: ₹5,000
Refund Status: Pending
Refund Timeline: 5-7 business days

Your refund will be credited to your original payment method. 
If you have any questions, please don't hesitate to reach out.

We hope to see you at a future event!
```

---

## 3. User Didn't Receive Confirmation Email

### Symptoms
- User completed registration but didn't receive email
- User checked spam folder
- User waited more than 5 minutes

### Resolution Steps

1. **Verify Registration**
   - Confirm registration was created successfully
   - Check registration status in database
   - Verify email address is correct

2. **Check Email Service**
   - Check email service logs for errors
   - Verify SMTP service is running
   - Check for rate limiting issues
   - Look for bounce notifications

3. **Resend Email**
   - Use the resend function in admin panel
   - Resend to the correct email address
   - Wait for confirmation

4. **Verify Delivery**
   - Check email service logs again
   - Confirm email was sent
   - Ask user to check inbox and spam folder

5. **Alternative Solution**
   - If email still not received, provide ticket ID directly
   - Offer to send details via alternative method
   - Escalate to technical team if pattern detected

6. **Document**
   - Log the issue
   - Note email address
   - Track for monitoring

### Example Response
```
I apologize for the email delay. Let me help you right away.

Your Ticket ID: AHT-2025-00123

Here are your registration details:
- Name: Jane Doe
- Email: jane@example.com
- Event: AllHealthTech Conference 2025
- Date: October 15-17, 2025
- Location: San Francisco Convention Center, CA

I've resent your confirmation email. Please check your inbox and spam folder. 
If you still don't receive it within 5 minutes, please let me know and I'll investigate further.
```

---

## 4. User Wants to Modify Registration

### Symptoms
- User wants to change name
- User wants to change email
- User wants to change dietary restrictions
- User wants to change accessibility needs

### Resolution Steps

1. **Collect New Information**
   - Ask for the field(s) to be changed
   - Ask for the new value(s)
   - Verify user identity

2. **Check Modification Policy**
   - Verify modification is allowed
   - Check if there are any restrictions
   - Note any deadlines

3. **Update Registration**
   - Update the field(s) in database
   - Record modification timestamp
   - Note what was changed

4. **Send Confirmation**
   - Send updated confirmation email
   - Include all current registration details
   - Highlight the changes made

5. **Document**
   - Log the modification
   - Note what was changed
   - Track for monitoring

### Example Response
```
Thank you for providing the updated information. I've updated your registration.

Updated Field: Dietary Restrictions
Previous: None
New: Vegetarian

Your updated confirmation email has been sent to jane@example.com.
Please review it to ensure all information is correct.

If you need any other changes, please let me know.
```

---

## 5. User Has Duplicate Registrations

### Symptoms
- User registered twice
- User received two confirmation emails
- User has two ticket IDs

### Resolution Steps

1. **Verify Duplicate**
   - Query database for multiple registrations with same email
   - Check registration dates
   - Verify both are for the same event

2. **Determine Intent**
   - Ask user which registration they want to keep
   - Ask if they want to cancel the duplicate
   - Verify user identity

3. **Process Cancellation**
   - Cancel the unwanted registration
   - Update status to "CANCELLED"
   - Send cancellation confirmation

4. **Confirm Active Registration**
   - Verify the kept registration is active
   - Resend confirmation email if needed
   - Provide ticket ID

5. **Document**
   - Log the duplicate
   - Note which was cancelled
   - Track for monitoring

### Example Response
```
I found that you have two registrations for the event. Let me help you clean this up.

Registration 1: AHT-2025-00123 (Created: Oct 1, 2025)
Registration 2: AHT-2025-00124 (Created: Oct 2, 2025)

Which registration would you like to keep? I'll cancel the other one.

Once you let me know, I'll send you a confirmation email for the active registration.
```

---

## 6. User Wants to Know Event Details

### Symptoms
- User asks about event date
- User asks about event location
- User asks about event schedule
- User asks about event details

### Resolution Steps

1. **Provide Event Information**
   - Event Name: AllHealthTech Conference 2025
   - Date: October 15-17, 2025
   - Location: San Francisco Convention Center, CA
   - Time: 9 AM - 5 PM (daily)

2. **Provide Additional Details**
   - Share event website link
   - Share agenda if available
   - Share speaker information if available
   - Share parking/transportation info

3. **Provide Check-in Information**
   - Explain check-in process
   - Explain what to bring (ticket ID, confirmation email)
   - Explain check-in location and time

4. **Document**
   - Log the inquiry
   - Note what information was provided

### Example Response
```
Great question! Here are the event details:

Event: AllHealthTech Conference 2025
Date: October 15-17, 2025
Time: 9 AM - 5 PM (daily)
Location: San Francisco Convention Center, CA
Address: 747 Market Street, San Francisco, CA 94103

For more details, visit: www.allhealthtech.com/2025

At check-in, please bring:
- Your Ticket ID (AHT-2025-XXXXX)
- Your confirmation email (printed or on phone)

Check-in opens at 8:30 AM each day.

Is there anything else I can help you with?
```

---

## 7. User Has Technical Issues

### Symptoms
- User cannot access registration form
- User gets error message
- User cannot submit registration
- User gets blank page

### Resolution Steps

1. **Collect Information**
   - Ask what browser they're using
   - Ask what device (desktop/mobile)
   - Ask what error message they see
   - Ask what steps they took

2. **Troubleshoot**
   - Ask them to clear browser cache
   - Ask them to try different browser
   - Ask them to try different device
   - Ask them to check internet connection

3. **Verify System Status**
   - Check if registration system is up
   - Check if there are any known issues
   - Check error logs for patterns

4. **Escalate if Needed**
   - If issue persists, escalate to technical team
   - Provide all collected information
   - Offer alternative registration method if available

5. **Document**
   - Log the technical issue
   - Note browser and device
   - Note error message
   - Track for monitoring

### Example Response
```
I'm sorry you're experiencing technical difficulties. Let me help you troubleshoot.

Can you please try the following:
1. Clear your browser cache (Ctrl+Shift+Delete on Windows, Cmd+Shift+Delete on Mac)
2. Try a different browser (Chrome, Firefox, Safari, or Edge)
3. Try on a different device if possible
4. Check your internet connection

If the issue persists, please let me know:
- What browser and version you're using
- What device you're using (desktop/mobile)
- What error message you see
- What steps you took before the error

I'll escalate this to our technical team for further investigation.
```

---

## Database Queries

### Look Up Registration by Email
```sql
SELECT * FROM registrations 
WHERE attendeeEmail = ? 
AND status != 'CANCELLED'
ORDER BY createdAt DESC
LIMIT 1;
```

### Look Up Registration by Ticket ID
```sql
SELECT * FROM registrations 
WHERE ticketId = ? 
AND status != 'CANCELLED';
```

### Find Duplicate Registrations
```sql
SELECT attendeeEmail, COUNT(*) as count 
FROM registrations 
WHERE eventId = ? 
AND status != 'CANCELLED'
GROUP BY attendeeEmail 
HAVING count > 1;
```

### Get All Registrations for Event
```sql
SELECT * FROM registrations 
WHERE eventId = ? 
AND status = 'CONFIRMED'
ORDER BY createdAt DESC;
```

### Get Cancelled Registrations
```sql
SELECT * FROM registrations 
WHERE eventId = ? 
AND status = 'CANCELLED'
ORDER BY cancelledAt DESC;
```

---

## Email Templates

### Resend Confirmation Email
**Subject:** Your AllHealthTech 2025 Ticket Confirmation - [TICKET_ID]

**Body:** Use the standard confirmation email template with all registration details.

### Cancellation Confirmation Email
**Subject:** Registration Cancellation Confirmed - [TICKET_ID]

**Body:** Use the standard cancellation email template with refund details.

### Support Response Email
**Subject:** Re: Your AllHealthTech 2025 Registration

**Body:** Personalized response with relevant information and next steps.

---

## Escalation Procedures

### When to Escalate to Technical Team
- System is down or not responding
- Database errors
- Email service failures
- Repeated technical issues
- Security concerns

### When to Escalate to Management
- Refund disputes
- Policy exceptions
- Complaints or negative feedback
- Unusual patterns or fraud concerns
- Media inquiries

### Escalation Contact Information
- **Technical Lead:** [contact info]
- **Manager:** [contact info]
- **Security Team:** [contact info]

---

## Monitoring and Reporting

### Daily Checks
- [ ] Email delivery rate
- [ ] Registration completion rate
- [ ] Support ticket volume
- [ ] System uptime

### Weekly Reports
- [ ] Total registrations
- [ ] Cancellations
- [ ] Support tickets by category
- [ ] Common issues

### Monthly Reports
- [ ] Registration trends
- [ ] Support metrics
- [ ] System performance
- [ ] Recommendations for improvement

---

## Quick Reference

| Scenario | Action | Contact |
|----------|--------|---------|
| Lost email | Resend confirmation | Support |
| Cancel registration | Update status, send email | Support |
| Didn't receive email | Resend, check logs | Support/Tech |
| Modify registration | Update field, send email | Support |
| Duplicate registration | Cancel one, confirm other | Support |
| Event details | Provide info | Support |
| Technical issue | Troubleshoot, escalate | Tech |
| Refund dispute | Escalate | Manager |

---

## Training Checklist

- [ ] Understand registration flow
- [ ] Know how to look up registrations
- [ ] Know how to resend emails
- [ ] Know how to process cancellations
- [ ] Know how to handle common issues
- [ ] Know when to escalate
- [ ] Know support contact information
- [ ] Know email templates
- [ ] Know database queries
- [ ] Know monitoring procedures

---

**Last Updated:** 2026-05-11  
**Version:** 1.0  
**Status:** Active
