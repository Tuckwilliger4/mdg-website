import '../styles/globals.css'
import { useEffect } from 'react'
import siteData from '../content/mock/site.json'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Inject CSS custom properties from site.json
    const root = document.documentElement;
    const { branding } = siteData;
    
    // Set font families
    root.style.setProperty('--font-heading', `'${branding.fontHeading}', sans-serif`);
    root.style.setProperty('--font-body', `'${branding.fontBody}', sans-serif`);
    
    // Set primary color
    root.style.setProperty('--primary-color', branding.primaryColor);
  }, []);
  
  return <Component {...pageProps} />
}
