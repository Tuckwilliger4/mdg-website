import fs from 'fs'
import path from 'path'
import Layout from '../components/Layout'
import Services from '../components/Services'

export default function ServicesPage({services, site}){
  return (
    <Layout meta={{title:'Services'}} site={site}>
      <Services data={services} />
    </Layout>
  )
}

export async function getStaticProps(){
  const servicesPath = path.join(process.cwd(),'content','mock','services.json')
  const sitePath = path.join(process.cwd(),'content','mock','site.json')
  const services = JSON.parse(fs.readFileSync(servicesPath,'utf8'))
  const site = JSON.parse(fs.readFileSync(sitePath,'utf8'))
  return {props:{services, site}}
}