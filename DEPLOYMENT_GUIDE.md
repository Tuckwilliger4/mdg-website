# Project Structure & Deployment Guide

## 1. Footer Data Issue - FIXED ✅

**Problem:** After restructuring `site.json` to have nested `contact` object, footer was looking for `site.address` instead of `site.contact.address`.

**Solution:** Updated `Layout.js` footer to use optional chaining with fallback:
```javascript
site?.contact?.address || site?.address
```

This supports both old and new data structures.

---

## 2. node_modules Folder

**What is it?**
- Contains all npm package dependencies (React, Next.js, etc.)
- Created when you run `npm install`
- Can be **HUGE** (100-500MB+)

**Do you need it?**
- ✅ **YES locally** - Required to run the dev server and build
- ❌ **NO in Git** - Already in `.gitignore`, never commit it
- ❌ **NO on host** - Vercel/Netlify install it automatically during build

**Best Practice:**
```bash
# If it gets corrupted or you switch branches:
rm -rf node_modules
npm install

# Fresh clone on new machine:
git clone repo
npm install
npm run dev
```

---

## 3. .next Folder

**What is it?**
- Next.js build cache and compiled output
- Created when you run `npm run dev` or `npm run build`
- Contains optimized JavaScript bundles

**Contents:**
- `/cache` - Build cache for faster rebuilds
- `/static` - Optimized JS/CSS bundles
- `/server` - Server-side rendered pages

**Do you need it?**
- ✅ **YES locally** - Speeds up development (caches between builds)
- ❌ **NO in Git** - Already in `.gitignore`, auto-generated
- ❌ **NO on host** - Built fresh on deployment

**When to delete:**
```bash
# If you get weird build errors or stale content:
rm -rf .next
npm run dev  # Rebuilds fresh
```

---

## 4. Email/Contact Form & Security

### Nodemailer Setup

**Current Architecture:**
- API route: `/pages/api/contact.js`
- Uses Nodemailer to send emails via SMTP
- Runs on **server-side only** (API route)

**Hosting Requirements:**

**Option A: Vercel/Netlify (Recommended)**
```javascript
// pages/api/contact.js already set up
// Just add environment variables in hosting dashboard:
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=recipient@mckimdesign.com
```

- ✅ Nodemailer works out of the box
- ✅ Serverless functions included free
- ✅ No server maintenance needed

**Option B: Traditional VPS (Not Recommended)**
- Need Node.js installed on server
- Need to keep server running 24/7
- More complex setup

### Spam & DDoS Protection

**1. Rate Limiting (Essential)**

Add to `/pages/api/contact.js`:

```javascript
// Simple in-memory rate limiter
const rateLimit = new Map()

function checkRateLimit(ip) {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const max = 3 // Max 3 submissions per window
  
  const record = rateLimit.get(ip) || { count: 0, resetTime: now + windowMs }
  
  if (now > record.resetTime) {
    record.count = 0
    record.resetTime = now + windowMs
  }
  
  record.count++
  rateLimit.set(ip, record)
  
  return record.count <= max
}

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }
  
  // ... rest of your email logic
}
```

**2. CAPTCHA (Recommended for Production)**

Add Google reCAPTCHA v3:

```bash
npm install react-google-recaptcha-v3
```

```javascript
// In contact form component:
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const { executeRecaptcha } = useGoogleReCaptcha()
const token = await executeRecaptcha('contact_form')

// Send token with form submission
// Verify on server side before sending email
```

**3. Email Validation**

```javascript
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email) && email.length < 254
}

// Block temporary email domains
const blockedDomains = ['tempmail.com', 'guerrillamail.com', '10minutemail.com']
const domain = email.split('@')[1]
if (blockedDomains.includes(domain)) {
  return res.status(400).json({ error: 'Invalid email domain' })
}
```

**4. Content Filtering**

```javascript
// Block common spam keywords
const spamKeywords = ['viagra', 'casino', 'crypto', 'bitcoin', 'lottery']
const message = req.body.message.toLowerCase()

if (spamKeywords.some(keyword => message.includes(keyword))) {
  return res.status(400).json({ error: 'Message contains prohibited content' })
}

// Limit message length
if (req.body.message.length > 5000) {
  return res.status(400).json({ error: 'Message too long' })
}
```

**5. Honeypot Field**

```javascript
// Add hidden field in form (don't tell humans about it):
<input type="text" name="website" style={{display: 'none'}} tabIndex="-1" autoComplete="off" />

// On server:
if (req.body.website) {
  // Bots fill out all fields, humans don't see this one
  return res.status(400).json({ error: 'Invalid submission' })
}
```

### Complete Protection Strategy

**For Small Site (Low Traffic):**
1. Rate limiting (3 submissions per 15 minutes)
2. Email validation
3. Honeypot field
4. Content length limits

**For Public Site (High Traffic):**
1. All of the above
2. Google reCAPTCHA v3
3. Consider using a service like Formspree or SendGrid (built-in spam protection)

### Alternative: Use Third-Party Form Service

**Easiest Option:**
- **Formspree** (free tier: 50 submissions/month)
- **SendGrid** (free tier: 100 emails/day)
- **Netlify Forms** (if using Netlify hosting)

Benefits:
- Built-in spam protection
- No server-side code needed
- Automatic rate limiting
- Better deliverability

---

## .gitignore Reminder

Your `.gitignore` should include:
```
node_modules/
.next/
.env.local
.DS_Store
*.log
```

## Summary

| Item | Keep Locally | Commit to Git | Need on Host |
|------|-------------|---------------|--------------|
| `node_modules/` | ✅ Yes | ❌ No | ✅ Auto-installed |
| `.next/` | ✅ Yes | ❌ No | ✅ Auto-built |
| `.env.local` | ✅ Yes | ❌ No | ⚠️ Add via dashboard |
| `content/mock/` | ✅ Yes | ✅ Yes | ✅ Yes |
| Source code | ✅ Yes | ✅ Yes | ✅ Yes |

**For email to work on host:**
- Add environment variables in Vercel/Netlify dashboard
- No additional setup needed (Nodemailer runs in serverless function)
- Add rate limiting and spam protection before going live
