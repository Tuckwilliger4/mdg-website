import { useState, useEffect, useRef, useCallback } from 'react'

export default function ProjectSlideshow({ images = [] }) {
  const [translationX, setTranslationX] = useState(0)
  const [canGoLeft, setCanGoLeft] = useState(false)
  const [canGoRight, setCanGoRight] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [slideshowKey, setSlideshowKey] = useState(0)

  const trackRef = useRef(null)
  const containerRef = useRef(null)
  const loadedCountRef = useRef(0)
  const lastHeightRef = useRef(0)

  // Memoize the calculation logic so it can be reused
  const calculateMetrics = useCallback(() => {
    if (!trackRef.current || !containerRef.current || images.length === 0 || !imagesLoaded) {
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

  }, [images, translationX, imagesLoaded])

  // Handle image loading
  const handleImageLoad = () => {
    loadedCountRef.current += 1
    if (loadedCountRef.current >= images.length) {
      setImagesLoaded(true)
    }
  }

  // Reset loaded count when images change and check if already cached
  useEffect(() => {
    loadedCountRef.current = 0
    setImagesLoaded(false)
    
    // If no images, mark as loaded immediately
    if (images.length === 0) {
      setImagesLoaded(true)
      return
    }

    // Check if images are already cached/loaded
    const timer = setTimeout(() => {
      // If after 3 seconds we haven't loaded all images, force show anyway
      if (!imagesLoaded && loadedCountRef.current < images.length) {
        console.warn(`Only ${loadedCountRef.current}/${images.length} images loaded, forcing display`)
        setImagesLoaded(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [images])

  // Monitor container height changes and force remount when height changes
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return
      const currentHeight = containerRef.current.offsetHeight
      
      // If height changed significantly (>5px), remount the entire slideshow
      if (lastHeightRef.current > 0 && Math.abs(currentHeight - lastHeightRef.current) > 5) {
        setSlideshowKey(prev => prev + 1)
      }
      lastHeightRef.current = currentHeight
    })

    resizeObserver.observe(containerRef.current)
    lastHeightRef.current = containerRef.current.offsetHeight

    return () => resizeObserver.disconnect()
  }, [])

  // Run calculations on mount, resize, and when images change
  useEffect(() => {
    if (!imagesLoaded) return

    // Need a slight delay for images to render and give us the correct scrollWidth
    const timer = setTimeout(() => {
      calculateMetrics()
    }, 100)

    window.addEventListener('resize', calculateMetrics)
    return () => {
      window.removeEventListener('resize', calculateMetrics)
      clearTimeout(timer)
    }
  }, [images, calculateMetrics, imagesLoaded])

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
      {!imagesLoaded && (
        <div className="slideshow-loading">
          Loading images...
        </div>
      )}
      <div className="slideshow-wrapper" style={{ opacity: imagesLoaded ? 1 : 0 }}>
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
            key={slideshowKey}
            className="slideshow-track" 
            ref={trackRef}
            style={{ 
              transform: `translateX(-${translationX}px)`,
              transition: 'transform 0.5s ease'
            }}
          >
            {images.map((src, index) => (
              <div key={index} className="slideshow-slide">
                <img 
                  src={src} 
                  alt={`Project slide ${index + 1}`}
                  onLoad={handleImageLoad}
                  onError={handleImageLoad}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}