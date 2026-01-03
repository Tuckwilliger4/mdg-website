import Layout from '../components/Layout'
import ContactForm from '../components/ContactForm'
import { getSiteData } from '../lib/cms'

export default function Contact({ site }) {
  return (
    <Layout meta={{title:'Contact'}} site={site}>
      <ContactForm site={site} />
    </Layout>
  )
}

export async function getStaticProps() {
  const site = await getSiteData()
  return { props: { site } }
}
