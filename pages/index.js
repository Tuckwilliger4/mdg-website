import Layout from '../components/Layout'
import Slideshow from '../components/Slideshow'
import SectionUs from '../components/SectionUs'
import SectionWork from '../components/SectionWork'
import ContactBoxes from '../components/ContactBoxes'
import { ScrollProvider } from '../components/ScrollContext'
import { getSiteData, getLeadership, getHomeData } from '../lib/cms'

export default function Home({ content, site, leadershipImages }) {
  const workItemCount = content.sectionWork ? content.sectionWork.length : 3

  return (
    <Layout meta={{title: content.siteTitle}} site={site}>
      <Slideshow images={content.heroImages} captions={content.heroCaptions} />
      <SectionUs data={content.sectionUs} leadershipImages={leadershipImages} />
      <ScrollProvider>
        <SectionWork items={content.sectionWork} />
        <ContactBoxes boxes={content.contactBoxes} workItemCount={workItemCount} />
      </ScrollProvider>
    </Layout>
  )
}

export async function getStaticProps() {
  const content = await getHomeData()
  const site = await getSiteData()
  const leadership = await getLeadership()
  const leadershipImages = leadership.map(leader => leader.image)
  
  return { props: { content, site, leadershipImages } }
}
