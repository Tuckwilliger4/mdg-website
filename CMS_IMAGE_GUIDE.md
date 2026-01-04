# Simple Image Guide for Hygraph CMS

## What You Need to Know

This website uses Hygraph CMS to manage all content. Here's how to upload images properly.

## Image Requirements

### Project Photos
- **Type**: JPG or PNG files
- **Size**: Keep under 2MB each
- **Quality**: High quality photos that look professional
- **Names**: Give name in format "projects-<project-name>-<image-number>.jpg" Alternatively <image-number> could be a description to what the photo is too, just ensure projects-<project-name> is first.

### Team Member Photos  
- **Type**: PNG with transparent background (use remove.bg website to remove background)
- **Size**: Square photos
- **Crop**: Show head and shoulders only
- **Names**: Use "leader-<name>.png"

### Logo and Branding
- **Type**: PNG with transparent background
- **Size**: Any size, but make sure it looks good when small
- **Use**: Company logo for the website header

### Homepage Slideshow
- **Type**: JPG files
- **Size**: 1920x1080 pixels (landscape format)
- **Quality**: Very high quality since these are the first images visitors see

## How to Upload in Hygraph

1. **Login to Hygraph** using the credentials provided
2. **Find the right section**:
   - Projects: Go to Content > "Page - Projects" 
   - Team: Go to "Team Leader Lists"
   - Homepage: Go to "Page Home Plural"
3. **Click "+ Asset" button** to upload new images
4. **Drag and drop** your images or click to browse
5. **Wait for upload** to complete (green checkmark)
6. **Select the image** in your content
7. **Click "Publish"** button to make changes live on website

## Important Tips

- Always click "PUBLISH" after making changes or they won't show on the website
- Upload images first, then add them to your content
- If an image looks blurry, try uploading a higher quality version
- Keep file names simple (no spaces or special characters)

## Getting Help

- Remove background from photos: visit remove.bg
- Resize images: use any photo editing app or canva.com
- Questions: Contact the developer

## What Happens After Publishing

When you click "Publish" in Hygraph, it automatically rebuilds the website with your new content. This takes about 2-3 minutes.

### Leadership Team (leadership.json → CMS)
```
Each Leader:
- Order: [number] (for sorting)
- Name: [text]
- Position: [text]
- Bio: [rich text]
- Image: [upload - follow leadership photo guidelines]
```

### Projects (projects.json → CMS)
```
Each Project:
- Title: [text]
- Slug: [auto-generated from title]
- Category: [dropdown: Educational, Commercial, Residential]
- Hero Image: [upload]
- Location: [text]
- Description: [rich text]
- Details: [key-value pairs]
- Gallery Images: [multi-upload]
```

### Categories (categories.json → CMS)
```
Each Category:
- Name: Educational/Commercial/Residential
- Order: 1, 2, 3 (controls display order on homepage and projects page)
- Image: [upload - for homepage section work]
```

## What Happens After Upload

1. Client uploads image in CMS → Gets URL like `https://cdn.sanity.io/images/abc123.jpg`
2. Client publishes content → Triggers webhook to Vercel
3. Netlify rebuilds site → Next.js fetches all content from CMS API
4. Site goes live with new content → Images served from CMS CDN (fast, cached)

## No Code Required

Client never needs to:
- Edit JSON files
- Touch code
- Use Git/GitHub
- Deploy manually

Everything happens through the CMS web dashboard (like WordPress but better).
