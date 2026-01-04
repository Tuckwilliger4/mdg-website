# Simple Deployment Guide

## What This Website Uses

- **CMS**: Hygraph (manages all content like text and images)
- **Hosting**: Netlify (serves the website to visitors)
- **Code**: GitHub (stores the website code)

## How It All Works Together

1. **Content changes**: Client updates content in Hygraph CMS
2. **Automatic rebuild**: Hygraph sends a signal to Netlify 
3. **New website**: Netlify rebuilds and publishes the updated site
4. **Fast delivery**: Visitors get the new content from Netlify's fast servers

## Setting Up Deployment

### Step 1: Connect GitHub to Netlify

1. **Login to Netlify** (netlify.com)
2. **Click "New site from Git"**
3. **Choose GitHub** and select this repository
4. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

### Step 2: Add Environment Variables

In Netlify dashboard, go to Site settings → Environment variables:

```
USE_CMS=true
HYGRAPH_ENDPOINT=https://api-us-west-2.hygraph.com/v2/cmjvpwtkj01ox07uoqv7dv8ko/master
HYGRAPH_TOKEN=your-long-token-here
```

Also add email settings (get from client):
```
SMTP_HOST=mail.theirdomain.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=website@theirdomain.com
SMTP_PASS=their-password
CONTACT_EMAIL=client@theirdomain.com
```

### Step 3: Set Up Automatic Updates

1. **In Hygraph**: Go to Settings → Webhooks
2. **Add new webhook**:
   - Name: "Netlify Deploy"  
   - URL: Your Netlify build hook URL (get from Netlify)
   - Trigger: Only on "PUBLISHED" (not drafts)

3. **In Netlify**: Go to Site settings → Build & deploy → Build hooks
   - Create new build hook
   - Copy the URL and paste in Hygraph webhook

## Testing Everything Works

1. **Make a small change** in Hygraph (like edit some text)
2. **Click "Publish"** 
3. **Wait 2-3 minutes** for rebuild
4. **Check website** - your changes should appear

## Common Problems and Solutions

### Website Not Updating After Hygraph Changes
- Check if you clicked "Publish" in Hygraph (not just "Save")
- Look at Netlify deploy log for errors
- Make sure webhook is set to trigger on "PUBLISHED" only

### Contact Form Not Working
- Check email settings in Netlify environment variables
- Test with client's actual email credentials
- Make sure SMTP settings match their email provider

### Images Not Loading
- Images must be "Published" in Hygraph, not just uploaded
- Check that image URLs are accessible
- Large images may take time to process

### Build Failing
- Check Netlify build logs for specific error
- Make sure all environment variables are set
- Try rebuilding manually from Netlify dashboard

## For Future Updates

### Adding New Content Types
1. **Create in Hygraph**: Add new content model
2. **Update code**: Modify `lib/cms.js` to fetch new content
3. **Test locally**: Run `npm run dev` to test changes
4. **Deploy**: Push code changes to GitHub

### Changing Design
1. **Edit CSS**: Modify files in `styles/` folder  
2. **Test locally**: Run `npm run dev` to see changes
3. **Deploy**: Push to GitHub, Netlify auto-deploys

## Important Notes

- **Never commit passwords** - use environment variables only
- **Always test locally first** - run `npm run dev` before pushing
- **Content vs Code**: Content changes happen in Hygraph, design changes happen in code
- **Backups**: Hygraph keeps version history of all content changes

## Emergency Contacts

- **Hygraph Login**: [credentials stored securely]
- **Netlify Access**: [team access configured] 
- **GitHub Repository**: [repository URL]
- **Client Email Settings**: [stored in password manager]
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
