// pages/api/contact.js
import nodemailer from 'nodemailer'

// Rate limiting: Track IPs and their attempts
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 3

// Temporary email domains to block
const TEMP_EMAIL_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
  'trashmail.com', 'throwaway.email', 'getnada.com', 'temp-mail.org'
]

// Spam keywords
const SPAM_KEYWORDS = [
  'viagra', 'cialis', 'casino', 'lottery', 'forex', 'crypto',
  'bitcoin', 'investment opportunity', 'click here', 'buy now'
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, message, website } = req.body

  // HONEYPOT: If the hidden "website" field is filled, it's a bot
  if (website && website.trim() !== '') {
    // Return success to fool the bot, but don't send email
    return res.status(200).json({ message: 'Email sent successfully' })
  }

  // Get client IP for rate limiting
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress

  // RATE LIMITING: Check if IP has exceeded attempts
  const now = Date.now()
  const ipData = rateLimitMap.get(clientIP)
  
  if (ipData) {
    // Clean up old entries
    if (now - ipData.firstAttempt > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(clientIP)
    } else if (ipData.attempts >= MAX_ATTEMPTS) {
      const timeLeft = Math.ceil((RATE_LIMIT_WINDOW - (now - ipData.firstAttempt)) / 60000)
      return res.status(429).json({ 
        message: `Too many attempts. Please try again in ${timeLeft} minutes.` 
      })
    }
  }

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // ENHANCED EMAIL VALIDATION
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' })
  }

  // Block temporary email domains
  const emailDomain = email.split('@')[1]?.toLowerCase()
  if (TEMP_EMAIL_DOMAINS.includes(emailDomain)) {
    return res.status(400).json({ message: 'Please use a valid email address' })
  }

  // CONTENT VALIDATION
  // Check message length
  if (message.length < 10) {
    return res.status(400).json({ message: 'Message is too short' })
  }
  if (message.length > 5000) {
    return res.status(400).json({ message: 'Message is too long' })
  }

  // Check for spam keywords
  const messageLower = message.toLowerCase()
  const hasSpam = SPAM_KEYWORDS.some(keyword => messageLower.includes(keyword))
  if (hasSpam) {
    return res.status(400).json({ message: 'Message contains prohibited content' })
  }

  // Check for excessive URLs (common in spam)
  const urlCount = (message.match(/https?:\/\//g) || []).length
  if (urlCount > 3) {
    return res.status(400).json({ message: 'Too many links in message' })
  }

  // Update rate limit counter
  if (ipData) {
    ipData.attempts += 1
  } else {
    rateLimitMap.set(clientIP, { firstAttempt: now, attempts: 1 })
  }

  // Clean up old rate limit entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now - data.firstAttempt > RATE_LIMIT_WINDOW) {
        rateLimitMap.delete(ip)
      }
    }
  }

  try {
    // Configure nodemailer (you'll need to add your SMTP settings)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || 'kmckim@mckimdesign.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Sent from McKim Design Group website contact form</small></p>
      `,
      replyTo: email
    }

    await transporter.sendMail(mailOptions)
    
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Email sending error:', error)
    res.status(500).json({ message: 'Error sending email' })
  }
}