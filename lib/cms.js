import fs from 'fs'
import path from 'path'

// Toggle between local mocks and CMS
const USE_CMS = process.env.USE_CMS === 'true'

// CMS client (configure when ready)
// import { createClient } from '@sanity/client'
// const sanityClient = createClient({
//   projectId: process.env.SANITY_PROJECT_ID,
//   dataset: 'production',
//   apiVersion: '2024-01-01',
//   useCdn: false,
// })

/**
 * Fetch data from local JSON or CMS based on USE_CMS env variable
 */
async function fetchData(fileName, cmsQuery) {
  if (USE_CMS) {
    // TODO: Replace with actual CMS fetch when ready
    // return await sanityClient.fetch(cmsQuery)
    throw new Error('CMS not configured yet. Set USE_CMS=false to use local mocks.')
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
  return fetchData('site.json', `*[_type == "siteSettings"][0]`)
}

/**
 * Get leadership team data
 */
export async function getLeadership() {
  return fetchData('leadership.json', `*[_type == "leader"] | order(id asc)`)
}

/**
 * Get categories with order
 */
export async function getCategories() {
  return fetchData('categories.json', `*[_type == "category"] | order(order asc)`)
}

/**
 * Get all projects
 */
export async function getProjects() {
  return fetchData('projects.json', `*[_type == "project"]`)
}

/**
 * Get single project by slug
 */
export async function getProjectBySlug(slug) {
  if (USE_CMS) {
    // return await sanityClient.fetch(`*[_type == "project" && slug.current == $slug][0]`, { slug })
    throw new Error('CMS not configured yet')
  }
  
  const projects = await getProjects()
  return projects.find(p => p.slug === slug)
}

/**
 * Get about page content
 */
export async function getAboutData() {
  return fetchData('about.json', `*[_type == "about"][0]`)
}

/**
 * Get homepage content
 */
export async function getHomeData() {
  return fetchData('index.json', `*[_type == "homepage"][0]`)
}

/**
 * Get services content
 */
export async function getServices() {
  return fetchData('services.json', `*[_type == "services"][0]`)
}

/**
 * Get contact page content
 */
export async function getContactData() {
  return fetchData('contact.json', `*[_type == "contact"][0]`)
}
