# Support Quick Reference - Simplified Registration Flow

## Quick Links

- **Registration Page:** https://www.allhealthtech.com/register
- **Support Email:** support@allhealthtech.com
- **Support Phone:** +1 (555) 123-4567
- **Admin Panel:** [URL]
- **Database Access:** [Connection Info]

---

## Common Issues & Quick Fixes

### User Lost Confirmation Email
**Quick Fix:**
1. Ask for email address
2. Look up in database: `SELECT ticketId FROM registrations WHERE attendeeEmail = ?`
3. Provide ticket ID
4. Resend email via admin panel

**Response Template:**
```
Your Ticket ID: AHT-2025-XXXXX
I've resent your confirmation email. Check inbox and spam folder.
```

### User Wants to Cancel
**Quick Fix:**
1. Verify identity (email, ticket ID, name)
2. Update status: `UPDATE registrations SET status = 'CANCELLED' WHERE ticketId = ?`
3. Send cancellation email
4. Process refund if applicable

**Response Template:**
```
Your cancellation has been processed.
Refund: ₹5,000 (5-7 business days)
```

### User Didn't Receive Email
**Quick Fix:**
1. Verify registration exists
2. Check email service logs
3. Resend email
4. Provide ticket ID directly

**Response Template:**
```
Your Ticket ID: AHT-2025-XXXXX
I've resent your email. If still not received, contact us.
```

### User Wants to Modify Registration
**Quick Fix:**
1. Verify identity
2. Update field in database
3. Resend confirmation email

**Response Template:**
```
Your registration has been updated.
Updated: [Field Name]
New value: [New Value]
```

---

## Database Queries

### Look Up by Email
```sql
SELECT * FROM registrations 
WHERE attendeeEmail = 'user@example.com' 
AND status != 'CANCELLED';
```

### Look Up by Ticket ID
```sql
SELECT * FROM registrations 
WHERE ticketId = 'AHT-2025-00123';
```

### Find Duplicates
```sql
SELECT attendeeEmail, COUNT(*) 
FROM registrations 
WHERE eventId = 'event-1' 
AND status != 'CANCELLED'
GROUP BY attendeeEmail 
HAVING COUNT(*) > 1;
```

### Cancel Registration
```sql
UPDATE registrations 
SET status = 'CANCELLED', cancelledAt = NOW() 
WHERE ticketId = 'AHT-2025-00123';
```

### Update Field
```sql
UPDATE registrations 
SET dietaryRestrictions = 'Vegetarian' 
WHERE ticketId = 'AHT-2025-00123';
```

---

## Email Templates

### Resend Confirmation
**Subject:** Your AllHealthTech 2025 Ticket Confirmation - [TICKET_ID]

**Body:** [Use standard confirmation template]

### Cancellation Confirmation
**Subject:** Registration Cancellation Confirmed - [TICKET_ID]

**Body:** [Use standard cancellation template]

### Support Response
**Subject:** Re: Your AllHealthTech 2025 Registration

**Body:** [Personalized response with relevant info]

---

## Escalation Contacts

| Issue | Contact | Phone |
|-------|---------|-------|
| Technical | Tech Lead | [Phone] |
| Refund | Manager | [Phone] |
| Security | Security | [Phone] |
| Emergency | On-Call | [Phone] |

---

## Key Information

**Event:** AllHealthTech Conference 2025  
**Date:** October 15-17, 2025  
**Location:** San Francisco Convention Center, CA  
**Ticket Format:** AHT-2025-XXXXX (5-digit number)

---

## Response Templates

### Ticket Lookup
```
Thank you for contacting us!

Your Ticket ID: AHT-2025-XXXXX
Event: AllHealthTech Conference 2025
Date: October 15-17, 2025
Location: San Francisco Convention Center, CA

I've resent your confirmation email. Check inbox and spam folder.
```

### Cancellation
```
Your cancellation has been processed.

Ticket ID: AHT-2025-XXXXX
Refund Amount: ₹5,000
Refund Timeline: 5-7 business days

Refund will be credited to your original payment method.
```

### Email Resend
```
I've resent your confirmation email to [email].

Your Ticket ID: AHT-2025-XXXXX

Please check your inbox and spam folder. If you still don't receive it, let me know.
```

### Modification
```
Your registration has been updated.

Updated Field: [Field Name]
New Value: [New Value]

Your updated confirmation email has been sent.
```

---

## Troubleshooting

### Email Not Sending
- Check SMTP service status
- Verify email address is valid
- Check email service logs
- Try resending

### Database Error
- Check database connection
- Verify query syntax
- Check for locks
- Escalate to tech team

### User Not Found
- Verify email address spelling
- Check if registration was cancelled
- Search by ticket ID instead
- Ask user to re-register

### System Down
- Check status page
- Verify API is responding
- Check logs for errors
- Escalate to tech team

---

## Metrics to Monitor

**Daily:**
- Email delivery rate (target: ≥ 99%)
- Registration completion rate (target: ≥ 85%)
- Support ticket volume
- System uptime

**Weekly:**
- Total registrations
- Cancellations
- Support tickets by category
- Common issues

---

## Important Notes

- ✅ Users receive ALL ticket info via email
- ✅ No online ticket lookup available
- ✅ Support team handles lookups
- ✅ Cancellations require support
- ✅ Ticket ID format: AHT-2025-XXXXX
- ✅ Email is primary communication channel

---

## Do's and Don'ts

### Do's
- ✅ Verify user identity before providing info
- ✅ Provide ticket ID and event details
- ✅ Resend confirmation emails
- ✅ Document all interactions
- ✅ Escalate when needed

### Don'ts
- ❌ Don't provide info without verification
- ❌ Don't modify registrations without permission
- ❌ Don't promise refunds without approval
- ❌ Don't share sensitive data
- ❌ Don't ignore escalation requests

---

## Contact Information

**Support Email:** support@allhealthtech.com  
**Support Phone:** +1 (555) 123-4567  
**Hours:** Monday-Friday, 9 AM - 5 PM EST

**Tech Support:** [Contact]  
**Manager:** [Contact]  
**On-Call:** [Phone]

---

**Last Updated:** 2026-05-11  
**Version:** 1.0
