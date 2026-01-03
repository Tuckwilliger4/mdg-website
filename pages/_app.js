import '../styles/globals.css'
import { useEffect } from 'react'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Inject CSS custom properties from site data (passed via pageProps)
    const siteData = pageProps.site || Component.site;
    
    if (siteData && siteData.branding) {
      const root = document.documentElement;
      const { branding } = siteData;
      
      // Set font families
      root.style.setProperty('--font-body', `'${branding.fontBody}', sans-serif`);
      
      // Set primary color
      root.style.setProperty('--primary-color', branding.primaryColor);
    }
  }, [pageProps.site, Component.site]);
  
  return <Component {...pageProps} />
}
