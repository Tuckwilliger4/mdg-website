# McKim Design Group Website

A modern architecture firm website built with Next.js and Hygraph CMS.

## What This Website Does

- Shows company information, projects, services, and team members
- Lets clients easily update content through Hygraph CMS  
- Sends contact form emails directly to client's inbox
- Loads super fast using static generation and CDN
- Automatically rebuilds when content is updated

## How It Works

1. **Content Management**: Client updates content in Hygraph CMS (like WordPress but headless)
2. **Static Generation**: Website pre-builds all pages for speed
3. **Auto Deploy**: When content changes, website rebuilds automatically
4. **Fast Delivery**: Visitors get pages instantly from CDN

## For Developers

### Getting Started

```bash
# Clone and install
git clone [repo-url]
cd mdg_website  
npm install

# Run locally
npm run dev
```

Site runs at http://localhost:3000

### Environment Setup

Create `.env.local` file:

```bash
# Use CMS or local files
USE_CMS=true

# Hygraph CMS connection
HYGRAPH_ENDPOINT=your-hygraph-endpoint
HYGRAPH_TOKEN=your-hygraph-token

# Email settings (get from client)
SMTP_HOST=mail.theirdomain.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=website@theirdomain.com
SMTP_PASS=their-password
CONTACT_EMAIL=client@theirdomain.com
```

### Local Development vs Production

- **Local**: Set `USE_CMS=false` to use JSON files in `content/mock/`
- **Production**: Set `USE_CMS=true` to use live CMS data

### File Structure

```
pages/           - Website pages (home, about, projects, etc.)
components/      - Reusable UI pieces  
lib/cms.js      - Handles CMS vs local data
content/mock/   - Local JSON files for development
styles/         - All CSS styles
public/img/     - Images and assets
```

### Making Changes

#### Content Changes (Client Does This)
- Login to Hygraph CMS
- Edit content and click "Publish"  
- Website automatically rebuilds in 2-3 minutes

#### Design Changes (Developer Does This)
- Edit CSS in `styles/` folder
- Test with `npm run dev`  
- Push to GitHub to deploy

### Deployment

**Netlify Settings:**
- Build command: `npm run build`
- Publish directory: `.next`
- Environment variables: Copy from `.env.local`

**Auto-deploy:** Connected to GitHub - pushes automatically deploy

### Important Files

- `lib/cms.js` - Main CMS integration and data fetching
- `content/mock/` - Local development data (kept in sync with CMS structure)  
- `components/ContactForm.js` - Email contact form
- `pages/api/contact.js` - Server-side email sending
- `next.config.js` - Next.js configuration

### CMS Integration

This site uses **Hygraph** (GraphQL CMS). All content types:

- **Site Settings**: Logo, colors, contact info
- **Page Home**: Homepage slideshow and content
- **Page Projects**: Project categories and listings  
- **Page About**: About page content and team
- **Page Services**: Services categories and descriptions
- **Team Leader Lists**: Team member info and photos

### Performance Features

- **Static Generation**: Pages pre-built for speed
- **Image Optimization**: Automatic image resizing and formats
- **CDN Delivery**: Fast global content delivery
- **API Caching**: Reduces CMS API calls during build
- **Mobile Responsive**: Works perfectly on all devices

## For Clients

### Updating Content

1. **Login to Hygraph**: Use provided credentials
2. **Make changes**: Edit text, upload images, etc.
3. **Click "Publish"**: This makes changes live
4. **Wait 2-3 minutes**: Website rebuilds automatically

### Image Guidelines

- **Quality**: Use high-resolution images
- **Format**: JPG for photos, PNG for logos
- **Size**: Keep under 2MB each
- **Team photos**: Square format with transparent background

See `CMS_IMAGE_GUIDE.md` for detailed image requirements.

### Getting Help

- **CMS questions**: Contact developer
- **Content issues**: Check if you clicked "Publish"  
- **Website problems**: Check deployment status in Netlify
- **Email issues**: Verify SMTP settings with email provider

## Technical Notes

### Email System
- Uses server-side email sending (not Netlify Forms)  
- Requires client's SMTP credentials
- Forms submit to `/api/contact` endpoint
- Emails sent directly to client's inbox

### Security
- All passwords stored as environment variables
- CMS tokens have limited permissions  
- No sensitive data in code repository
- HTTPS everywhere

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement for older browsers
