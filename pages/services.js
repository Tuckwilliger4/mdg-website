import Layout from '../components/Layout'
import Services from '../components/Services'
import { getSiteData, getServices } from '../lib/cms'

export default function ServicesPage({services, site}){
  return (
    <Layout meta={{title:'Services'}} site={site}>
      <Services data={services} />
    </Layout>
  )
}

export async function getStaticProps(){
  const services = await getServices()
  const site = await getSiteData()
  return {props:{services, site}}
}