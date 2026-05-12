# Security Guidelines

## HTTPS/TLS Configuration

### Production Deployment

**CRITICAL**: Always use HTTPS in production to encrypt data transmission.

#### Backend Configuration

Set the following environment variables:

```bash
# Production API URL (must use HTTPS)
NODE_ENV=production
PORT=3000

# CORS origin (must use HTTPS)
CORS_ORIGIN=https://yourdomain.com
```

#### Frontend Configuration

Set the API URL in `.env.production`:

```bash
# Production API URL (must use HTTPS)
VITE_API_URL=https://api.yourdomain.com
```

The frontend will warn in the console if HTTP is used in production builds.

#### SSL/TLS Certificate

- Use a valid SSL/TLS certificate from a trusted Certificate Authority (CA)
- Recommended: Let's Encrypt (free, automated)
- Minimum TLS version: TLS 1.2
- Recommended: TLS 1.3

#### Reverse Proxy Configuration

If using a reverse proxy (Nginx, Apache, etc.), configure it to:

1. Terminate SSL/TLS
2. Forward requests to the backend
3. Add security headers
4. Redirect HTTP to HTTPS

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Security Features Implemented

### Input Validation and Sanitization

- ✅ **Zod validation** on all API endpoints
- ✅ **Email validation** with format checking and lowercase conversion
- ✅ **Phone validation** with character whitelist
- ✅ **String length limits** on all text fields
- ✅ **Whitespace trimming** on all inputs
- ✅ **Empty string to undefined** conversion for optional fields
- ✅ **Parameterized queries** via Prisma (SQL injection protection)

### Rate Limiting

- ✅ **General API**: 100 requests per 15 minutes
- ✅ **Registration endpoint**: 10 requests per 15 minutes
- ✅ **Payment endpoint**: 10 requests per 15 minutes (removed in rebuild)

### Security Headers (via Helmet)

- ✅ **Content Security Policy (CSP)**
- ✅ **HTTP Strict Transport Security (HSTS)**
- ✅ **X-Content-Type-Options: nosniff**
- ✅ **X-Frame-Options: DENY**
- ✅ **X-XSS-Protection: 1; mode=block**

### CORS Configuration

- ✅ **Origin whitelist** (configurable via environment variable)
- ✅ **Method whitelist** (GET, POST, PUT, DELETE, OPTIONS)
- ✅ **Header whitelist** (Content-Type, Authorization)
- ✅ **No credentials** (stateless API)

### Error Handling

- ✅ **Structured error responses** with status codes
- ✅ **Error logging** with timestamps and request details
- ✅ **Sensitive field sanitization** in logs
- ✅ **Production vs development** error messages
- ✅ **Database error handling**

### Data Protection

- ✅ **Email lowercase conversion** for consistency
- ✅ **Duplicate email prevention** per event
- ✅ **Request body size limit** (10MB)
- ✅ **No sensitive data in logs** (passwords, tokens redacted)

## Security Checklist for Production

### Before Deployment

- [ ] Set `NODE_ENV=production`
- [ ] Configure HTTPS/TLS certificates
- [ ] Set `CORS_ORIGIN` to production domain (HTTPS)
- [ ] Set `VITE_API_URL` to production API (HTTPS)
- [ ] Configure SMTP with TLS/SSL
- [ ] Review and update rate limits if needed
- [ ] Enable database connection encryption
- [ ] Set up monitoring and alerting
- [ ] Configure firewall rules
- [ ] Review and update CSP directives

### After Deployment

- [ ] Verify HTTPS is working (no mixed content warnings)
- [ ] Test rate limiting
- [ ] Verify security headers are present
- [ ] Test CORS configuration
- [ ] Monitor error logs for security issues
- [ ] Set up automated security scanning
- [ ] Configure backup and disaster recovery

## Reporting Security Issues

If you discover a security vulnerability, please email security@allhealthtech.com with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Do not** create public GitHub issues for security vulnerabilities.

## Security Updates

- Review dependencies monthly: `npm audit`
- Update dependencies regularly: `npm update`
- Monitor security advisories for Node.js, Express, Prisma, and other dependencies
- Subscribe to security mailing lists for critical updates

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
