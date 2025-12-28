import Link from 'next/link'
import Layout from '../../components/Layout'
import ProjectGrid from '../../components/ProjectGrid'
import { ScrollProvider } from '../../components/ScrollContext'
import { getSiteData, getProjects } from '../../lib/cms'

export default function Projects({list, site}){
  return (
    <Layout meta={{title:'Projects'}} site={site}>
      <ScrollProvider>
        <ProjectGrid projects={list} />
      </ScrollProvider>
    </Layout>
  )
}

export async function getStaticProps(){
  const list = await getProjects()
  const site = await getSiteData()
  return {props:{list, site}}
}
