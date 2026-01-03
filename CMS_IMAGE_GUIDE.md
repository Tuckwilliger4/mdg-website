# CMS Image Upload Requirements

## For Client Reference

When uploading content to the CMS, follow these image guidelines:

### Leadership Photos
- **Format:** PNG with transparent background
- **Dimensions:** 500×500px minimum (square)
- **How to prepare:** Use [remove.bg](https://www.remove.bg) to remove background
- **Crop:** Should show head and shoulders (upper 25% of body)
- **File naming:** firstname-lastname.jpg (e.g., kirk-mckim.jpg)

### Project Hero Images
- **Format:** JPG or PNG
- **Dimensions:** 1920×1080px recommended (any aspect ratio works)
- **File size:** Under 2MB
- **Quality:** High resolution for professional appearance

### Logo
- **Format:** PNG with transparent background OR SVG
- **Dimensions:** Variable, but ensure readable at small sizes
- **Versions needed:** 
  - Regular (for light backgrounds)
  - Dark version optional (for dark backgrounds)

### Site Banner/Hero Images  
- **Format:** JPG
- **Dimensions:** 1920×1080px minimum  
- **File size:** Under 3MB
- **Aspect ratio:** 16:9 recommended

## CMS Fields Reference

### Site Settings (site.json → CMS)
```
Branding:
- Company Name: "MDG"
- Company Full Name: "McKim Design Group"
- Logo Image: [upload]
- Logo Image Dark: [upload]
- Primary Color: #7819B1 (color picker)
- Font Heading: Montserrat (dropdown)
- Font Body: Lato (dropdown)

Contact:
- Address: [text]
- Phone: [text]
- Fax: [text]
- Email: [email]
```

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
3. Vercel rebuilds site → Next.js fetches all content from CMS API
4. Site goes live with new content → Images served from CMS CDN (fast, cached)

## No Code Required

Client never needs to:
- Edit JSON files
- Touch code
- Use Git/GitHub
- Deploy manually

Everything happens through the CMS web dashboard (like WordPress but better).
