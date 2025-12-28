MDG Website - Next.js + Headless CMS Ready

Modern architecture website built with Next.js Static Site Generation, designed for easy content management through a headless CMS.

## Architecture

- **Framework:** Next.js 14 with SSG (Static Site Generation)
- **Styling:** CSS with responsive design (mobile-first)
- **Content:** Abstracted data layer that supports both local mocks and CMS
- **Deployment Ready:** Vercel/Netlify with automatic rebuilds

## Data Source Configuration

The site uses an abstraction layer (`lib/cms.js`) that can switch between:
- **Local Development:** JSON files in `content/mock/` (committed to Git)
- **Production:** Headless CMS (Sanity, Contentful, etc.)

### Using Local Mocks (Default)

```bash
# .env.local
USE_CMS=false
```

Mock data is stored in `content/mock/`:
- `site.json` - Branding, colors, fonts, contact info
- `leadership.json` - Team members with photos
- `categories.json` - Project categories with order
- `projects.json` - All project data
- `about.json` - About page content
- `index.json` - Homepage content
- `services.json` - Services content

### Switching to CMS

```bash
# .env.local
USE_CMS=true
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-token
```

Update `lib/cms.js` to uncomment and configure your CMS client.

## Local Development

```bash
npm install
npm run dev
```

Site runs at [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
npm run build
npm run start
```

## Content Structure

See `CMS_IMAGE_GUIDE.md` for complete documentation on:
- Image requirements and formats
- CMS field structure
- Client upload guidelines

## Migration to CMS

When ready to move to production CMS:

1. **Choose CMS:** Sanity, Contentful, or Strapi
2. **Configure:** Update `lib/cms.js` with CMS client
3. **Schema:** Create CMS schema matching JSON structure
4. **Import:** Upload mock data to CMS
5. **Environment:** Set `USE_CMS=true` in production
6. **Webhook:** Configure CMS to trigger rebuilds on publish

Mock data stays in Git for development/testing!
