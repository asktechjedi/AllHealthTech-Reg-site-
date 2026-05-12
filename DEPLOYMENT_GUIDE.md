# Deployment Guide - Simplified Registration Flow

## Overview

This guide provides step-by-step instructions for deploying the simplified registration flow to production.

## Pre-Deployment Checklist

### Code Review
- [ ] All code changes reviewed and approved
- [ ] No commented-out code
- [ ] No debug statements
- [ ] No console.log statements
- [ ] Linting passes
- [ ] No security vulnerabilities

### Testing
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Security tests passing
- [ ] Performance tests passing
- [ ] Manual testing completed in staging
- [ ] Browser/device testing completed
- [ ] Accessibility testing completed

### Configuration
- [ ] Environment variables configured
- [ ] SMTP credentials verified
- [ ] Database connection verified
- [ ] Email service tested
- [ ] Rate limiting configured
- [ ] HTTPS certificates valid

### Documentation
- [ ] API documentation updated
- [ ] User documentation updated
- [ ] Support documentation updated
- [ ] Deployment plan documented
- [ ] Rollback plan documented

### Team Preparation
- [ ] Support team trained
- [ ] Support documentation reviewed
- [ ] Monitoring alerts configured
- [ ] On-call schedule updated
- [ ] Communication plan prepared

### Database
- [ ] Database backups current
- [ ] Migration scripts tested
- [ ] Indexes verified
- [ ] Query performance verified
- [ ] Rollback scripts prepared

---

## Deployment Steps

### Phase 1: Pre-Deployment (1 hour before)

#### 1.1 Final Verification
```bash
# Verify all tests pass
npm test

# Verify build succeeds
npm run build

# Verify no uncommitted changes
git status

# Verify correct branch
git branch
```

#### 1.2 Backup Database
```bash
# Create database backup
pg_dump production_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup
ls -lh backup_*.sql
```

#### 1.3 Notify Team
- [ ] Send deployment notification to team
- [ ] Notify support team
- [ ] Notify stakeholders
- [ ] Update status page

#### 1.4 Prepare Rollback
- [ ] Verify rollback scripts
- [ ] Test rollback in staging
- [ ] Document rollback steps
- [ ] Have rollback team ready

### Phase 2: Backend Deployment (15 minutes)

#### 2.1 Deploy Backend Code
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Run migrations
npm run migrate

# Build backend
npm run build

# Start backend
npm start
```

#### 2.2 Verify Backend
```bash
# Check health endpoint
curl https://api.allhealthtech.com/health

# Check logs for errors
tail -f logs/production.log

# Verify database connection
npm run db:verify

# Verify email service
npm run email:test
```

#### 2.3 Smoke Tests
```bash
# Run smoke tests
npm run test:smoke

# Verify API endpoints
curl https://api.allhealthtech.com/api/registrations

# Verify rate limiting
npm run test:ratelimit
```

### Phase 3: Frontend Deployment (15 minutes)

#### 3.1 Deploy Frontend Code
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build frontend
npm run build

# Deploy to CDN/hosting
npm run deploy
```

#### 3.2 Verify Frontend
```bash
# Check website loads
curl https://www.allhealthtech.com

# Check registration page
curl https://www.allhealthtech.com/register

# Check for 404 errors
npm run test:links

# Check console for errors
npm run test:console
```

#### 3.3 Smoke Tests
```bash
# Test registration form loads
npm run test:form

# Test form submission
npm run test:submit

# Test success page
npm run test:success
```

### Phase 4: Post-Deployment Verification (30 minutes)

#### 4.1 Functional Testing
- [ ] Navigate to registration page
- [ ] Fill out registration form
- [ ] Submit registration
- [ ] Verify success page displays
- [ ] Verify ticket ID displays
- [ ] Check email for confirmation
- [ ] Verify email contains all details

#### 4.2 Error Scenario Testing
- [ ] Test duplicate email error
- [ ] Test validation errors
- [ ] Test network error handling
- [ ] Test server error handling

#### 4.3 Performance Verification
```bash
# Check API response time
npm run test:performance

# Check email delivery time
npm run test:email:performance

# Check database query performance
npm run test:db:performance
```

#### 4.4 Monitoring Verification
- [ ] Email delivery rate monitored
- [ ] Registration completion rate monitored
- [ ] API error rate monitored
- [ ] Support ticket volume monitored
- [ ] Alerts configured and working

#### 4.5 Log Review
```bash
# Check for errors
grep ERROR logs/production.log

# Check for warnings
grep WARN logs/production.log

# Check email logs
grep email logs/production.log

# Check database logs
grep database logs/production.log
```

### Phase 5: Post-Deployment Communication (15 minutes)

#### 5.1 Notify Team
- [ ] Send deployment success notification
- [ ] Share deployment summary
- [ ] Share monitoring dashboard link
- [ ] Share support contact information

#### 5.2 Update Status Page
- [ ] Update deployment status
- [ ] Share deployment notes
- [ ] Share monitoring metrics

#### 5.3 Document Deployment
- [ ] Record deployment time
- [ ] Record deployment duration
- [ ] Record any issues encountered
- [ ] Record resolution steps

---

## Rollback Procedures

### When to Rollback

Rollback should be initiated if:
- Critical errors in logs
- Email delivery rate < 95%
- Registration completion rate < 80%
- API error rate > 5%
- System is down or unresponsive
- Data corruption detected

### Rollback Steps

#### 1. Notify Team
```bash
# Send rollback notification
# Include reason for rollback
# Include estimated rollback time
```

#### 2. Stop Current Deployment
```bash
# Stop backend
npm stop

# Stop frontend
npm run stop:frontend
```

#### 3. Restore Previous Version

**Backend:**
```bash
# Checkout previous version
git checkout previous-tag

# Install dependencies
npm install

# Run migrations (if needed)
npm run migrate:rollback

# Start backend
npm start
```

**Frontend:**
```bash
# Checkout previous version
git checkout previous-tag

# Install dependencies
npm install

# Build frontend
npm run build

# Deploy to CDN
npm run deploy
```

#### 4. Restore Database (if needed)
```bash
# Restore from backup
psql production_db < backup_YYYYMMDD_HHMMSS.sql

# Verify restore
npm run db:verify
```

#### 5. Verify Rollback
```bash
# Check health endpoint
curl https://api.allhealthtech.com/health

# Test registration flow
npm run test:smoke

# Check logs
tail -f logs/production.log
```

#### 6. Notify Team
- [ ] Send rollback completion notification
- [ ] Share rollback summary
- [ ] Share next steps

---

## Monitoring During Deployment

### Real-Time Monitoring

**Dashboard:**
- Email delivery rate
- Registration completion rate
- API response time
- Error rate
- Database performance

**Logs:**
- Application logs
- Email service logs
- Database logs
- Error logs

**Alerts:**
- Email delivery failures
- API errors
- Database errors
- Performance degradation

### Metrics to Watch

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Email Delivery Rate | ≥ 99% | < 95% |
| Registration Completion | ≥ 85% | < 80% |
| API Response Time | < 500ms | > 1000ms |
| Error Rate | < 1% | > 5% |
| Uptime | 99.9% | < 99% |

---

## Post-Deployment Tasks

### Day 1 (Deployment Day)
- [ ] Monitor metrics closely
- [ ] Check for errors in logs
- [ ] Verify email delivery
- [ ] Test registration flow
- [ ] Monitor support tickets
- [ ] Document any issues

### Day 2-3 (First Week)
- [ ] Continue monitoring metrics
- [ ] Review support tickets
- [ ] Verify no data issues
- [ ] Check performance metrics
- [ ] Gather user feedback

### Week 2-4 (First Month)
- [ ] Review deployment metrics
- [ ] Analyze user feedback
- [ ] Identify improvements
- [ ] Plan next iteration
- [ ] Document lessons learned

---

## Deployment Checklist

### Pre-Deployment
- [ ] Code review completed
- [ ] All tests passing
- [ ] Configuration verified
- [ ] Database backed up
- [ ] Team notified
- [ ] Rollback plan ready

### Deployment
- [ ] Backend deployed
- [ ] Backend verified
- [ ] Frontend deployed
- [ ] Frontend verified
- [ ] Smoke tests passed
- [ ] Monitoring active

### Post-Deployment
- [ ] Functional testing completed
- [ ] Error scenarios tested
- [ ] Performance verified
- [ ] Logs reviewed
- [ ] Team notified
- [ ] Deployment documented

---

## Deployment Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Pre-Deployment | 1 hour | Verification, backup, notification |
| Backend Deployment | 15 min | Deploy, verify, smoke tests |
| Frontend Deployment | 15 min | Deploy, verify, smoke tests |
| Post-Deployment Verification | 30 min | Functional, error, performance tests |
| Communication | 15 min | Notify team, update status |
| **Total** | **~2 hours** | |

---

## Deployment Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| Deployment Lead | [Name] | [Phone] | [Email] |
| Backend Lead | [Name] | [Phone] | [Email] |
| Frontend Lead | [Name] | [Phone] | [Email] |
| Database Admin | [Name] | [Phone] | [Email] |
| Support Lead | [Name] | [Phone] | [Email] |
| On-Call | [Name] | [Phone] | [Email] |

---

## Deployment History

| Date | Version | Status | Duration | Notes |
|------|---------|--------|----------|-------|
| 2026-05-11 | 1.0 | Success | 2h 15m | Initial deployment |

---

## Troubleshooting

### Backend Won't Start
```bash
# Check logs
tail -f logs/production.log

# Verify environment variables
env | grep SMTP

# Verify database connection
npm run db:verify

# Check port availability
lsof -i :3000
```

### Frontend Won't Load
```bash
# Check CDN status
curl -I https://cdn.allhealthtech.com

# Check for 404 errors
npm run test:links

# Check browser console
npm run test:console

# Verify DNS
nslookup www.allhealthtech.com
```

### Email Not Sending
```bash
# Check email service logs
tail -f logs/email.log

# Verify SMTP credentials
npm run email:test

# Check email queue
npm run email:queue

# Verify DNS records
nslookup smtp.example.com
```

### Database Issues
```bash
# Check database connection
npm run db:verify

# Check database logs
tail -f logs/database.log

# Verify database size
npm run db:size

# Check for locks
npm run db:locks
```

---

## Emergency Contacts

**On-Call:** [Phone]  
**Manager:** [Phone]  
**CTO:** [Phone]  
**Security:** [Phone]

---

**Last Updated:** 2026-05-11  
**Version:** 1.0  
**Status:** Active
