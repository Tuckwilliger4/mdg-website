import fs from 'fs'
import path from 'path'

// Toggle between local mocks and CMS
const USE_CMS = process.env.USE_CMS === 'true'

// Hygraph GraphQL client
async function hygraphRequest(query, variables = {}) {
  const response = await fetch(process.env.HYGRAPH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.HYGRAPH_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const { data, errors } = await response.json()

  if (errors) {
    console.error('GraphQL errors:', errors)
    throw new Error('Failed to fetch data from Hygraph')
  }

  return data
}

/**
 * Fetch data from local JSON or CMS based on USE_CMS env variable
 */
async function fetchData(fileName, cmsQuery) {
  if (USE_CMS) {
    return await hygraphRequest(cmsQuery)
  }
  
  // Local mock data
  const filePath = path.join(process.cwd(), 'content', 'mock', fileName)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  return data
}

/**
 * Get site settings and branding
 */
export async function getSiteData() {
  const query = `
    query GetSiteSettings {
      siteSettingsPlural(first: 1) {
        metaTitle
        metaDescription
        metaKeywords
        companyName
        desktopLogo {
          url
        }
        mobileLogo {
          url
        }
        favicon {
          url
        }
        primaryColor
        fontBody
        address
        phone
        fax
        email
        categoryOrder
      }
    }
  `
  
  const data = await fetchData('site.json', query)
  
  if (USE_CMS) {
    // Transform Hygraph data to match expected structure
    const hygraphData = data.siteSettingsPlural[0]
    return {
      meta: {
        title: hygraphData.metaTitle,
        description: hygraphData.metaDescription,
        keywords: hygraphData.metaKeywords
      },
      branding: {
        companyName: hygraphData.companyName,
        companyFullName: hygraphData.companyName, // Use same as companyName
        desktopLogo: hygraphData.desktopLogo?.url || null,
        mobileLogo: hygraphData.mobileLogo?.url || null,
        favicon: hygraphData.favicon?.url || null,
        primaryColor: hygraphData.primaryColor,
        fontHeading: "Montserrat", // Default since not in schema
        fontBody: hygraphData.fontBody
      },
      contact: {
        address: hygraphData.address,
        phone: hygraphData.phone,
        fax: hygraphData.fax,
        email: hygraphData.email
      },
      projects: {
        categoryOrder: hygraphData.categoryOrder?.split(',') || []
      }
    }
  }
  
  return data
}

/**
 * Get leadership team data
 */
export async function getLeadership() {
  const query = `
    query GetLeadership {
      teamLeaderLists {
        leaders {
          name
          position
          bio {
            text
          }
          image {
            url
          }
        }
      }
    }
  `
  
  const data = await fetchData('leadership.json', query)
  
  if (USE_CMS) {
    // Return the leaders array from the first (and likely only) TeamLeaderList
    const leaders = data.teamLeaderLists[0]?.leaders || []
    // Transform team members to handle RichText bio field
    return leaders.map(member => ({
      name: member.name,
      position: member.position,
      bio: member.bio.text,
      image: member.image.url
    }))
  }
  
  return data
}

/**
 * Get all projects
 */
export async function getProjects() {
  const query = `
    query GetProjects {
      pageProjectsPlural {
        id
        category
        projectList {
          id
          title
          slug
          location
          year
          size
          projectStatus
          designLead
          type
          description {
            text
          }
          heroImage {
            url
          }
          galleryImages {
            url
          }
        }
      }
    }
  `
  
  const data = await fetchData('projects-consolidated.json', query)
  
  if (USE_CMS) {
    // Combine all projects from different Page-Projects (categories) maintaining order
    const allProjects = []
    
    data.pageProjectsPlural.forEach(pageProjects => {
      const category = pageProjects.category
      pageProjects.projectList.forEach(project => {
        if (!project.heroImage?.url) {
          throw new Error(`Project "${project.title}" hero image not found. Make sure the image is uploaded and published in Hygraph.`)
        }
        
        allProjects.push({
          slug: project.slug,
          title: project.title,
          category: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize category
          hero: project.heroImage.url,
          location: project.location,
          year: project.year,
          size: project.size,
          status: project.projectStatus, // Map projectStatus to status for component compatibility
          designLead: project.designLead,
          type: project.type,
          description: project.description.text,
          images: project.galleryImages?.map(img => img.url) || []
        })
      })
    })
    
    return allProjects
  }
  
  // Handle mock data - transform consolidated structure to match CMS output
  const allProjects = []
  data.forEach(pageProjects => {
    const category = pageProjects.category
    pageProjects.projectList.forEach(project => {
      allProjects.push({
        slug: project.slug,
        title: project.title,
        category: category,
        hero: project.hero,
        location: project.location,
        year: project.year,
        size: project.size,
        status: project.projectStatus, // Map projectStatus to status for component compatibility
        designLead: project.designLead,
        type: project.type,
        description: project.description,
        images: project.images || []
      })
    })
  })
  
  return allProjects
}

/**
 * Get single project by slug
 */
export async function getProjectBySlug(slug) {
  if (USE_CMS) {
    const query = `
      query GetProjectBySlug {
        pageProjectsPlural {
          id
          category
          projectList(where: { slug: "${slug}" }) {
            id
            title
            slug
            location
            year
            size
            projectStatus
            designLead
            type
            description {
              text
            }
            heroImage {
              url
            }
            galleryImages {
              url
            }
          }
        }
      }
    `
    
    const data = await hygraphRequest(query)
    
    // Find the project across all Page-Projects
    let project = null
    let category = null
    
    for (const pageProjects of data.pageProjectsPlural) {
      if (pageProjects.projectList.length > 0) {
        project = pageProjects.projectList[0]
        category = pageProjects.category
        break
      }
    }
    
    if (!project) return null
    
    if (!project.galleryImages || project.galleryImages.length === 0) {
      throw new Error(`Project "${project.title}" has no gallery images. Make sure images are uploaded and published in Hygraph.`)
    }
    
    // Transform to match existing project detail structure
    return {
      title: project.title,
      category: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize category
      location: project.location,
      year: project.year,
      size: project.size,
      status: project.projectStatus, // Map projectStatus to status for component compatibility
      designLead: project.designLead,
      type: project.type,
      description: project.description.text,
      images: project.galleryImages.map(img => img.url)
    }
  }
  
  const projects = await getProjects()
  return projects.find(p => p.slug === slug)
}

/**
 * Get about page content
 */
export async function getAboutData() {
  const query = `
    query GetAboutPage {
      pageAboutPlural(first: 1) {
        heroTitle
        heroBgImage {
          url
        }
        heroButton1
        heroButton2
        ourStoryTitle
        ourStoryBody {
          text
        }
        stats {
          value
          description
        }
        valueSlides {
          word
          caption
        }
      }
    }
  `
  
  const data = await fetchData('about.json', query)
  
  if (USE_CMS) {
    const hygraphData = data.pageAboutPlural[0]
    
    if (!hygraphData.heroBgImage?.url) {
      throw new Error('About page hero background image not found. Make sure the image is uploaded and published in Hygraph.')
    }
    
    // Transform to match existing about.json structure
    return {
      companyImage: {
        title: hygraphData.heroTitle,
        buttons: [hygraphData.heroButton1, hygraphData.heroButton2],
        bgImage: hygraphData.heroBgImage.url
      },
      ourStory: {
        title: hygraphData.ourStoryTitle,
        body: hygraphData.ourStoryBody.text
      },
      stats: hygraphData.stats.map(stat => ({
        stat: stat.value,
        desc: stat.description
      })),
      valueSlides: hygraphData.valueSlides.map(slide => ({
        word: slide.word,
        caption: slide.caption
      }))
    }
  }
  
  return data
}

/**
 * Get homepage content
 */
export async function getHomeData() {
  const query = `
    query GetHomepage {
      pageHomePlural(first: 1) {
        heroSlides {
          image {
            url
          }
          captionText
          captionColor
        }
        sectionUsTitle {
          text
        }
        sectionUsTabs {
          title
          buttonLabel
          content {
            text
          }
          motto
          link
          linktext
        }
        sectionWorkItems {
          title
          image {
            url
          }
          link
        }
        contactBoxes {
          header
          title
          caption
          link
        }
      }
    }
  `
  
  const data = await fetchData('index.json', query)
  
  if (USE_CMS) {
    const hygraphData = data.pageHomePlural[0]
    
    if (!hygraphData.heroSlides || hygraphData.heroSlides.length === 0) {
      throw new Error('Homepage hero slides not found. Make sure hero slides are created and published in Hygraph.')
    }
    
    // Check that all hero images are published
    hygraphData.heroSlides.forEach((slide, index) => {
      if (!slide.image?.url) {
        throw new Error(`Homepage hero slide ${index + 1} image not found. Make sure the image is uploaded and published in Hygraph.`)
      }
    })
    
    // Transform to match existing index.json structure
    return {
      heroImages: hygraphData.heroSlides.map(slide => slide.image.url),
      heroCaptions: hygraphData.heroSlides.map(slide => ({
        text: slide.captionText,
        color: slide.captionColor.toLowerCase()
      })),
      sectionUs: {
        title: hygraphData.sectionUsTitle.text,
        tabs: hygraphData.sectionUsTabs.map(tab => ({
          title: tab.title,
          buttonLabel: tab.buttonLabel,
          content: tab.content.text,
          motto: tab.motto,
          link: tab.link,
          linkText: tab.linktext
        }))
      },
      sectionWork: hygraphData.sectionWorkItems.map((item, index) => {
        if (!item.image?.url) {
          throw new Error(`Homepage work section item ${index + 1} ("${item.title}") image not found. Make sure the image is uploaded and published in Hygraph.`)
        }
        return {
          title: item.title,
          image: item.image.url,
          link: item.link
        }
      }),
      contactBoxes: hygraphData.contactBoxes
    }
  }
  
  return data
}

/**
 * Get services content
 */
export async function getServices() {
  const query = `
    query GetServicesPage {
      pageServicesPlural(first: 1) {
        title
        description
        heroImage {
          url
        }
        serviceCategories {
          title
          offerings
        }
      }
    }
  `
  
  const data = await fetchData('services.json', query)
  
  if (USE_CMS) {
    const hygraphData = data.pageServicesPlural[0]
    
    if (!hygraphData.heroImage?.url) {
      throw new Error('Services page hero image not found. Make sure the image is uploaded and published in Hygraph.')
    }
    
    // Transform to match existing services.json structure
    return {
      title: hygraphData.title,
      subtitle: hygraphData.description,
      heroImage: hygraphData.heroImage.url,
      services: hygraphData.serviceCategories.map(category => ({
        name: category.title,
        items: category.offerings
      }))
    }
  }
  
  return data
}
