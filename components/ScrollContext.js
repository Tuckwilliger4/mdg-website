import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

const ScrollContext = createContext()

export const useScrollContext = () => {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error('useScrollContext must be used within a ScrollProvider')
  }
  return context
}

export const ScrollProvider = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(null)
  const elements = useRef(new Map()) // Map of index -> DOM element
  const observer = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      // Only run on mobile/tablet
      if (window.innerWidth > 1024) return

      // Trigger point is upper third of viewport (accounts for nav)
      const triggerPoint = window.innerHeight * 0.30
      let closestIndex = null
      let minDistance = Infinity
      const threshold = 150 // Distance from trigger point where element becomes active

      // Find which element is closest to trigger point
      elements.current.forEach((element, index) => {
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top
        const distance = Math.abs(elementTop - triggerPoint)
        
        // Element must be visible and reasonably close to trigger point
        if (rect.bottom > 0 && rect.top < window.innerHeight && distance < threshold) {
          if (distance < minDistance) {
            minDistance = distance
            closestIndex = index
          }
        }
      })

      // Update active index (can be null if no element is close enough)
      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex)
      }
    }

    // Use scroll listener for smooth, real-time updates
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [activeIndex])

  const registerElement = (index, element) => {
    if (element) {
      elements.current.set(index, element)
    }
  }

  const unregisterElement = (index) => {
    elements.current.delete(index)
  }

  return (
    <ScrollContext.Provider value={{
      activeIndex,
      registerElement,
      unregisterElement
    }}>
      {children}
    </ScrollContext.Provider>
  )
}
