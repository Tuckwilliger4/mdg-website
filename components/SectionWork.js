import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useScrollContext } from './ScrollContext'

export default function SectionWork({ items }) {
  const { activeIndex, registerElement, unregisterElement } = useScrollContext()
  const mobileWorkRefs = useRef([])

  useEffect(() => {
    // Register each mobile work item with sequential indexes starting from 1
    mobileWorkRefs.current.forEach((element, i) => {
      if (element) {
        const index = i + 1 // Work items get indexes 1, 2, 3, etc.
        registerElement(index, element)
      }
    })

    return () => {
      // Cleanup on unmount
      mobileWorkRefs.current.forEach((_, i) => {
        const index = i + 1
        unregisterElement(index)
      })
    }
  }, [registerElement, unregisterElement, items.length])

  return (
    <>
      {/* Desktop version */}
      <section className="section-work section-work-desktop">
        {items.map((item,i)=>(
          <div key={i} className="work-container-item" data-index={i}>
            <div className="work-container-caption">
              <span className="work-container-title">{item.title}</span>
              <Link href={`/projects?category=${item.title.toLowerCase()}`} className="work-container-btn">Discover</Link>
            </div>
            <img src={item.image} className="preHover" alt={item.title} />
          </div>
        ))}
      </section>
      
      {/* Mobile/Tablet version with scroll coordination */}
      <section className="section-work section-work-mobile">
        {items.map((item,i)=>(
          <Link 
            key={i} 
            href={`/projects?category=${item.title.toLowerCase()}`} 
            className={`work-container-item mobile-work-item ${activeIndex === i + 1 ? 'in-view' : ''}`}
            data-index={i + 1}
            ref={(el) => { mobileWorkRefs.current[i] = el }}
          >
            <div className="work-container-caption">
              <span className="work-container-title">{item.title}</span>
            </div>
            <img src={item.image} className="preHover" alt={item.title} />
          </Link>
        ))}
      </section>
    </>
  )
}