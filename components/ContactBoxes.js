import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useScrollContext } from './ScrollContext'

export default function ContactBoxes({ boxes, workItemCount = 3 }) {
  const { activeIndex, registerElement, unregisterElement } = useScrollContext()
  const contactBoxRefs = useRef([])

  useEffect(() => {
    // Register each contact box with indexes continuing from work items
    // If we have 3 work items (1,2,3), contact boxes get (4,5,6)
    contactBoxRefs.current.forEach((element, i) => {
      if (element) {
        const index = workItemCount + i + 1 // Contact boxes get indexes 4, 5, 6, etc.
        registerElement(index, element)
      }
    })

    return () => {
      // Cleanup on unmount
      contactBoxRefs.current.forEach((_, i) => {
        const index = workItemCount + i + 1
        unregisterElement(index)
      })
    }
  }, [registerElement, unregisterElement, workItemCount, boxes.length])

  return (
    <section className="contact-boxes">
      <div className="contact-box-flex">
        {boxes.map((box,i)=>(
          <Link 
            key={i} 
            href={box.link} 
            className={`contact-box ${activeIndex === workItemCount + i + 1 ? 'contact-box-hover' : ''}`}
            data-index={workItemCount + i + 1}
            ref={(el) => { contactBoxRefs.current[i] = el }}
          >
            <p className="contact-box-header">{box.header}</p>
            <p className="contact-box-title">{box.title}</p>
            <p className="contact-box-caption">{box.caption}</p>
            <i className="small-arrow-btn ion-android-arrow-forward"></i>
          </Link>
        ))}
      </div>
    </section>
  )
}