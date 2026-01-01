import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Logo from './Logo'

export default function Nav({ site }){
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  const headerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(()=>{
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.clientHeight)
      }
    }

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    return ()=> {
      window.removeEventListener('resize', updateHeaderHeight);
    }
  },[isHomePage])

  const navClasses = isHomePage 
    ? 'head-nav' 
    : 'head-nav absolute';

  const headerClasses = `${navClasses}${menuOpen ? ' menu-open' : ''}`;

  return (
    <>
      {!isHomePage && <div className="ghost-nav" style={{ height: headerHeight, background: 'black' }} />}
      <header ref={headerRef} className={headerClasses}>
        <div style={{display:'flex',alignItems:'center'}}>
          {site?.branding?.mobileLogo ? (
            <Link href="/"><img src={site.branding.mobileLogo} alt={site.branding.companyFullName} className="nav-logo mobile-only" style={{height:50}} /></Link>
          ) : (
            <Link href="/" className="mobile-only"><Logo size="nav" className="title" /></Link>
          )}
          {site?.branding?.desktopLogo ? (
            <Link href="/"><img src={site.branding.desktopLogo} alt={site.branding.companyFullName} className="nav-logo desktop-logo" style={{height:50}} /></Link>
          ) : (
            <Link href="/"><Logo size="nav" className="title desktop-logo" /></Link>
          )}
        </div>
        <nav>
          <ul className="main-nav">
            <li><Link href="/about" className="nav-ele">Profile</Link></li>
            <li><Link href="/services" className="nav-ele">Services</Link></li>
            <li><Link href="/projects" className="nav-ele">Portfolio</Link></li>
            <li><Link href="/contact" className="nav-ele">Contact</Link></li>
          </ul>
        </nav>
        <div className={`nav-container-flex ${menuOpen ? 'active' : ''}`} onClick={()=>setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span><span></span>
        </div>
      </header>
      <nav className={`outer-menu ${menuOpen ? 'js--anim-2' : ''}`} style={{display: menuOpen ? 'flex' : 'none'}}>
        <ul>
          <li><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link href="/about" onClick={() => setMenuOpen(false)}>Profile</Link></li>
          <li><Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
          <li><Link href="/projects" onClick={() => setMenuOpen(false)}>Portfolio</Link></li>
          <li><Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        </ul>
      </nav>
    </>
  )
}
