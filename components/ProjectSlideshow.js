import { useState, useEffect, useRef, useCallback } from 'react'

export default function ProjectSlideshow({ images = [] }) {
  const [translationX, setTranslationX] = useState(0)
  const [canGoLeft, setCanGoLeft] = useState(false)
  const [canGoRight, setCanGoRight] = useState(false)

  const trackRef = useRef(null)
  const containerRef = useRef(null)

  // Memoize the calculation logic so it can be reused
  const calculateMetrics = useCallback(() => {
    if (!trackRef.current || !containerRef.current || images.length === 0) {
      return
    }

    const containerWidth = containerRef.current.offsetWidth
    const trackWidth = trackRef.current.scrollWidth
    const maxScroll = Math.max(0, trackWidth - containerWidth)

    // If resizing makes the current position invalid, clamp it
    const newTranslationX = Math.min(translationX, maxScroll)
    setTranslationX(newTranslationX)

    // Update arrow states
    setCanGoLeft(newTranslationX > 0)
    setCanGoRight(newTranslationX < maxScroll)

  }, [images, translationX])

  // Run calculations on mount, resize, and when images change
  useEffect(() => {
    // Need a slight delay for images to render and give us the correct scrollWidth
    const timer = setTimeout(() => {
      calculateMetrics()
    }, 100)

    window.addEventListener('resize', calculateMetrics)
    return () => {
      window.removeEventListener('resize', calculateMetrics)
      clearTimeout(timer)
    }
  }, [images, calculateMetrics])

  const go = (direction) => {
    if (!trackRef.current || !containerRef.current) return

    const containerWidth = containerRef.current.offsetWidth
    const trackWidth = trackRef.current.scrollWidth
    const maxScroll = Math.max(0, trackWidth - containerWidth)
    
    // Use a single slide width as the step, assuming all are equal
    const slideWidth = trackWidth / images.length

    setTranslationX(currentTranslation => {
      const newTranslation = currentTranslation + (direction * slideWidth)
      // Clamp the new value between 0 and the maximum scrollable distance
      const clampedTranslation = Math.max(0, Math.min(newTranslation, maxScroll))
      return clampedTranslation
    })
  }

  return (
    <section className="section-projects-slideshow">
      <div className="slideshow-wrapper">
        <div className="arrow-btns">
          <i 
            className={`ion-android-arrow-dropleft arrow-btn ${!canGoLeft ? 'disabled' : ''}`} 
            onClick={() => canGoLeft && go(-1)}
          ></i>
          <i 
            className={`ion-android-arrow-dropright arrow-btn ${!canGoRight ? 'disabled' : ''}`} 
            onClick={() => canGoRight && go(1)}
          ></i>
        </div>
        <div className="slideshow-container" ref={containerRef}>
          <div 
            className="slideshow-track" 
            ref={trackRef}
            style={{ 
              transform: `translateX(-${translationX}px)`,
              transition: 'transform 0.5s ease'
            }}
          >
            {images.map((src, index) => (
              <div key={index} className="slideshow-slide">
                <img src={src} alt={`Project slide ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}