import Head from 'next/head'
import Nav from './Nav'
import Logo from './Logo'

export default function Layout({ children, meta = {}, site }) {
  return (
    <div>
      <Head>
        <title>{meta.title || 'McKim Design Group'}</title>
        <meta name="description" content={meta.description || 'Architecture firm'} />
        <link rel="stylesheet" type="text/css" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" />
        <link href='https://fonts.googleapis.com/css?family=Lato:100,300,400,300italic' rel='stylesheet' type='text/css' />
      </Head>
      <Nav />
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo-section">
              <Logo size="footer" className="footer-company-name" />
            </div>
            
            <div className="footer-contact-row">
              <div className="footer-contact-item">
                <span className="contact-value">{site?.contact?.address || site?.address}</span>
              </div>
              <span className="footer-divider-vertical">|</span>
              <div className="footer-contact-item">
                <span className="contact-value">{site?.contact?.phone || site?.phone}</span>
              </div>
              <span className="footer-divider-vertical">|</span>
              <div className="footer-contact-item">
                <span className="contact-value">{site?.contact?.email || site?.email}</span>
              </div>
              <span className="footer-divider-vertical desktop-only">|</span>
              <div className="footer-contact-item desktop-only">
                <a href="/contact" className="contact-value contact-link">Project Inquiries</a>
              </div>
            </div>
          </div>
          
          <div className="footer-copyright">
            Copyright © {new Date().getFullYear()} McKim Design Group. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
