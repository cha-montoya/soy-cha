import { useState, useEffect } from 'react'

/**
 * useScrollDepth
 * Detecta cuando el usuario alcanza un porcentaje de scroll de la página.
 * También empuja un evento al dataLayer de GTM/GA4 una sola vez.
 *
 * @param {number} threshold - Porcentaje de scroll (0-100). Default: 75
 * @returns {boolean} - true cuando se alcanza el threshold
 */
export function useScrollDepth(threshold = 75) {
  const [reached, setReached] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Ya se activó, no seguir calculando
      if (reached) return

      const scrollTop    = window.scrollY
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

      if (scrollPercent >= threshold) {
        setReached(true)

        // Evento a dataLayer para GA4 (si GTM está instalado)
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event:          'scroll_depth_reached',
          scrollThreshold: threshold,
          pagePath:        window.location.pathname,
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reached, threshold])

  return reached
}