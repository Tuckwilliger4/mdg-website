import Layout from '../components/Layout'
import CompanyImage from '../components/CompanyImage'
import OurStory from '../components/OurStory'
import Stats from '../components/Stats'
import LeadershipSlideshow from '../components/LeadershipSlideshow'
import AboutSlides from '../components/AboutSlides'
import { getSiteData, getLeadership, getAboutData } from '../lib/cms'

export default function About({content, site}){
  return (
    <Layout meta={{title:'About'}} site={site}>
      <CompanyImage data={content.companyImage} />
      <OurStory data={content.ourStory} />
      <Stats stats={content.stats} />
      <LeadershipSlideshow leaders={content.leadership} />
      <AboutSlides slides={content.valueSlides} />
    </Layout>
  )
}

export async function getStaticProps(){
  const content = await getAboutData()
  const site = await getSiteData()
  const leadership = await getLeadership()
  
  return {props:{content: {...content, leadership}, site}}
}
