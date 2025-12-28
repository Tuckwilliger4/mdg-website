import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useScrollContext } from './ScrollContext'

export default function ProjectGrid({ projects }) {
  const router = useRouter()
  const { activeIndex, registerElement, unregisterElement } = useScrollContext()
  const mobileProjectRefs = useRef([])
  
  // Get unique categories from projects
  const categories = [...new Set(projects.map(project => project.category))]
  
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || 'Commercial')
  const [filteredProjects, setFilteredProjects] = useState([])
  
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

  return (
    <>
      <section className="project-btns">
        <div className="projects-head-btns">
          {categories.map(category => (
            <div
              key={category}
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