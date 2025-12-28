import fs from 'fs'
import path from 'path'
import Layout from '../components/Layout'
import ContactForm from '../components/ContactForm'

export default function Contact({content, site}){
  return (
    <Layout meta={{title:'Contact'}} site={site}>
      <ContactForm content={content} />
    </Layout>
  )
}

export async function getStaticProps(){
  const contentPath = path.join(process.cwd(),'content','mock','contact.json')
  const sitePath = path.join(process.cwd(),'content','mock','site.json')
  const content = JSON.parse(fs.readFileSync(contentPath,'utf8'))
  const site = JSON.parse(fs.readFileSync(sitePath,'utf8'))
  return {props:{content, site}}
}
