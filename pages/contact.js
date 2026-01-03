import fs from 'fs'
import path from 'path'
import Layout from '../components/Layout'
import ContactForm from '../components/ContactForm'

export default function Contact({ site }) {
  return (
    <Layout meta={{title:'Contact'}} site={site}>
      <ContactForm site={site} />
    </Layout>
  )
}

export async function getStaticProps() {
  const sitePath = path.join(process.cwd(),'content','mock','site.json')
  const site = JSON.parse(fs.readFileSync(sitePath,'utf8'))
  return { props: { site } }
}
