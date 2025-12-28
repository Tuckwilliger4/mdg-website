import { useRef, useEffect, useState } from 'react'

export default function AboutSlides({ slides }) {
  const refs = useRef([])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    function onScroll() {
      const viewportCenter = window.innerHeight / 2
      let minDist = Infinity
      let closestIdx = 0
      refs.current.forEach((ref, i) => {
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const elCenter = rect.top + rect.height / 2
          const dist = Math.abs(viewportCenter - elCenter)
          if (dist < minDist) {
            minDist = dist
            closestIdx = i
          }
        }
      })
      setActiveIdx(closestIdx)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [slides.length])

  return (
    <section className="section-about-slides">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`about-slides-container${activeIdx === i ? ' active' : ''}`}
          ref={el => refs.current[i] = el}
        >
          <div className="about-slide-word">{s.title}</div>
          <div className={`about-caption${activeIdx === i ? ' show' : ''}`}>{s.caption}</div>
        </div>
      ))}
    </section>
  )
}