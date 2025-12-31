import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useScrollContext } from './ScrollContext'

export default function ProjectGrid({ projects, site }) {
  const router = useRouter()
  const { activeIndex, registerElement, unregisterElement } = useScrollContext()
  const mobileProjectRefs = useRef([])
  const categoryButtonRefs = useRef({})
  const buttonContainerRef = useRef(null)
  
  // Get unique categories from projects and sort by categoryOrder if provided
  const allCategories = [...new Set(projects.map(project => project.category))]
  const categoryOrder = site?.projects?.categoryOrder || []
  
  const categories = categoryOrder.length > 0
    ? categoryOrder.filter(cat => allCategories.includes(cat))
    : allCategories
  
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || 'Commercial')
  const [filteredProjects, setFilteredProjects] = useState([])
  const [hasOverflow, setHasOverflow] = useState(false)
  
  // Set initial category from URL parameters
  useEffect(() => {
    if (router.query.category) {
      const urlCategory = router.query.category.charAt(0).toUpperCase() + router.query.category.slice(1)
      if (categories.includes(urlCategory)) {
        setSelectedCategory(urlCategory)
      }
    }
  }, [router.query.category, categories])
  
  useEffect(() => {
    const filtered = projects.filter(project => project.category === selectedCategory)
    setFilteredProjects(filtered)
  }, [projects, selectedCategory])
  
  // Check for overflow (mobile only)
  useEffect(() => {
    const checkOverflow = () => {
      if (buttonContainerRef.current && window.innerWidth <= 767) {
        // Calculate if buttons would overflow without arrow space
        const container = buttonContainerRef.current
        const containerWidth = container.offsetWidth
        let totalButtonWidth = 0
        
        Object.values(categoryButtonRefs.current).forEach(button => {
          if (button) {
            totalButtonWidth += button.offsetWidth
          }
        })
        
        const hasScroll = totalButtonWidth > containerWidth
        setHasOverflow(hasScroll)
        
        // Initially center selected category if overflow
        if (hasScroll && !hasOverflow) {
          const activeButton = categoryButtonRefs.current[selectedCategory]
          if (activeButton) {
            setTimeout(() => {
              activeButton.scrollIntoView({
                behavior: 'auto',
                block: 'nearest',
                inline: 'center'
              })
            }, 50)
          }
        }
      } else {
        setHasOverflow(false)
      }
    }
    
    checkOverflow()
    const timeout = setTimeout(checkOverflow, 100)
    window.addEventListener('resize', checkOverflow)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', checkOverflow)
    }
  }, [categories, hasOverflow])
  
  // Center active category button
  useEffect(() => {
    const activeButton = categoryButtonRefs.current[selectedCategory]
    if (activeButton && buttonContainerRef.current && hasOverflow) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [selectedCategory, hasOverflow])
  
  // Register mobile project items for scroll detection
  useEffect(() => {
    mobileProjectRefs.current.forEach((element, i) => {
      if (element) {
        const index = i + 1 // Projects get indexes 1, 2, 3, etc.
        registerElement(index, element)
      }
    })

    return () => {
      mobileProjectRefs.current.forEach((_, i) => {
        const index = i + 1
        unregisterElement(index)
      })
    }
  }, [registerElement, unregisterElement, filteredProjects.length])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    // Update URL without page reload
    router.push({
      pathname: router.pathname,
      query: { category: category.toLowerCase() }
    }, undefined, { shallow: true })
  }
  
  const scrollLeft = () => {
    if (buttonContainerRef.current) {
      buttonContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' })
    }
  }
  
  const scrollRight = () => {
    if (buttonContainerRef.current) {
      buttonContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' })
    }
  }

  return (
    <>
      <section className="project-btns" data-has-overflow={hasOverflow}>
        {hasOverflow && (
          <>
            <button className="category-scroll-arrow arrow-left" onClick={scrollLeft} aria-label="Scroll left">
              ‹
            </button>
            <button className="category-scroll-arrow arrow-right" onClick={scrollRight} aria-label="Scroll right">
              ›
            </button>
          </>
        )}
        <div className="projects-head-btns" ref={buttonContainerRef}>
          {categories.map(category => (
            <div
              key={category}
              ref={(el) => { categoryButtonRefs.current[category] = el }}
              className={`projects-head-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </div>
          ))}
        </div>
      </section>

      {/* Desktop version - full hover experience */}
      <section className="section-projects-grid section-projects-grid-desktop">
        {filteredProjects.map((project, i) => (
          <div key={i} className="project-grid-item">
            <div className="project-grid-caption">
              <span className="project-grid-title">{project.title}</span>
              <Link href={`/projects/${project.slug}`} className="project-grid-btn">Discover</Link>
            </div>
            <img src={project.hero} alt={project.title} className="preHover" />
          </div>
        ))}
      </section>

      {/* Tablet/Mobile version - always visible titles, scroll effects */}
      <section className="section-projects-grid section-projects-grid-mobile">
        {filteredProjects.map((project, i) => (
          <Link 
            key={i} 
            href={`/projects/${project.slug}`}
            className={`project-grid-item mobile-project-item ${activeIndex === i + 1 ? 'in-view' : ''}`}
            data-index={i + 1}
            ref={(el) => { mobileProjectRefs.current[i] = el }}
          >
            <div className="project-grid-caption project-grid-caption-visible">
              <span className="project-grid-title">{project.title}</span>
            </div>
            <img src={project.hero} alt={project.title} className="preHover" />
          </Link>
        ))}
      </section>
    </>
  )
}