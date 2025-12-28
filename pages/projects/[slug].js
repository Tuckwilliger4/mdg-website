import fs from 'fs'
import path from 'path'
import Layout from '../../components/Layout'
import ProjectSlideshow from '../../components/ProjectSlideshow'
import ProjectDetails from '../../components/ProjectDetails'

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
  const dir = path.join(process.cwd(),'content','mock','projects')
  const files = fs.readdirSync(dir).filter(f=>f.endsWith('.json'))
  const paths = files.map(f=>({params:{slug:f.replace('.json','')}}))
  return {paths, fallback:false}
}

export async function getStaticProps({params}){
  try {
    const projectPath = path.join(process.cwd(),'content','mock','projects', `${params.slug}.json`)
    const sitePath = path.join(process.cwd(),'content','mock','site.json')
    
    // Check if project file exists
    if (!fs.existsSync(projectPath)) {
      return { notFound: true }
    }
    
    const project = JSON.parse(fs.readFileSync(projectPath,'utf8'))
    const site = JSON.parse(fs.readFileSync(sitePath,'utf8'))
    return {props:{project, site}}
  } catch (error) {
    return { notFound: true }
  }
}
