import { useState, useEffect } from 'react'

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    windowWidth: 0,
    windowHeight: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowSize({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      })
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

export const isTouchDevice = () =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0