import Layout from '../../components/Layout'
import ProjectSlideshow from '../../components/ProjectSlideshow'
import ProjectDetails from '../../components/ProjectDetails'
import { getProjects, getProjectBySlug, getSiteData } from '../../lib/cms'

export default function Project({project, site}){
  if(!project) return <Layout site={site}><div style={{padding:40}}>Project not found</div></Layout>
  
  return (
    <Layout meta={{title:project.title}} site={site}>
      <ProjectSlideshow images={project.images || [project.hero]} />
      <ProjectDetails project={project} />
    </Layout>
  )
}

export async function getStaticPaths(){
  const projects = await getProjects()
  const paths = projects.map(project => ({
    params: { slug: project.slug }
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({params}){
  try {
    const project = await getProjectBySlug(params.slug)
    const site = await getSiteData()
    
    if (!project) {
      return { notFound: true }
    }
    
    return { props: { project, site } }
  } catch (error) {
    console.error('Error loading project:', error)
    return { notFound: true }
  }
}
