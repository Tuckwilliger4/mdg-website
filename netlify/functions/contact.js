const nodemailer = require('nodemailer');

// Rate limiting: Track IPs and their attempts
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 3;

// Temporary email domains to block
const TEMP_EMAIL_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
  'trashmail.com', 'throwaway.email', 'getnada.com', 'temp-mail.org'
];

// Spam keywords
const SPAM_KEYWORDS = [
  'viagra', 'cialis', 'casino', 'lottery', 'forex', 'crypto',
  'bitcoin', 'investment opportunity', 'click here', 'buy now'
];

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);

    // Get client IP for rate limiting
    const clientIP = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
    
    // Rate limiting check
    const now = Date.now();
    const userAttempts = rateLimitMap.get(clientIP) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    
    if (now > userAttempts.resetTime) {
      userAttempts.count = 0;
      userAttempts.resetTime = now + RATE_LIMIT_WINDOW;
    }
    
    if (userAttempts.count >= MAX_ATTEMPTS) {
      return {
        statusCode: 429,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ message: 'Too many requests. Please try again later.' }),
      };
    }

    // Input validation
    if (!name || !email || !message) {
      userAttempts.count++;
      rateLimitMap.set(clientIP, userAttempts);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      userAttempts.count++;
      rateLimitMap.set(clientIP, userAttempts);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ message: 'Invalid email address' }),
      };
    }

    // Block temporary email domains
    const emailDomain = email.toLowerCase().split('@')[1];
    if (TEMP_EMAIL_DOMAINS.includes(emailDomain)) {
      userAttempts.count++;
      rateLimitMap.set(clientIP, userAttempts);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ message: 'Temporary email addresses are not allowed' }),
      };
    }

    // Check for spam keywords
    const messageText = message.toLowerCase();
    const hasSpamKeywords = SPAM_KEYWORDS.some(keyword => messageText.includes(keyword.toLowerCase()));
    if (hasSpamKeywords) {
      userAttempts.count++;
      rateLimitMap.set(clientIP, userAttempts);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ message: 'Message contains prohibited content' }),
      };
    }

    // Length validation
    if (name.length > 100 || email.length > 254 || message.length > 5000) {
      userAttempts.count++;
      rateLimitMap.set(clientIP, userAttempts);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ message: 'Input too long' }),
      };
    }

    // Create transporter with Hurricane Electric SMTP
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'mail.hurricaneelectric.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || false,
      auth: {
        user: process.env.SMTP_USER || 'your-email@yourdomain.com',
        pass: process.env.SMTP_PASS || 'your-smtp-password',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER || 'your-email@yourdomain.com',
      to: 'kmckim@mckimdesign.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
      html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    // Update rate limiting on success
    userAttempts.count++;
    rateLimitMap.set(clientIP, userAttempts);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Error sending email' }),
    };
  }
};