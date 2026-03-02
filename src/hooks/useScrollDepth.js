import { useState, useEffect, useRef } from 'react'

/**
 * useScrollDepth — versión robusta para SPAs con contenido lazy
 *
 * Problemas que resuelve vs la versión anterior:
 * 1. Recalcula el threshold cuando la página crece (imágenes, lazy components)
 * 2. Usa ResizeObserver en lugar de asumir altura fija al montar
 * 3. Empuja evento a dataLayer una sola vez aunque el resize dispare varias veces
 *
 * @param {number} threshold - Porcentaje de scroll (0-100). Default: 75
 * @returns {boolean} - true cuando se alcanza el threshold
 */
export function useScrollDepth(threshold = 75) {
  const [reached, setReached]   = useState(false)
  const reachedRef               = useRef(false)  // ref para leer en listeners sin stale closure

  useEffect(() => {
    // ── Función de cálculo ─────────────────────────────────────────
    const check = () => {
      if (reachedRef.current) return  // ya se activó, no seguir

      const scrollTop     = window.scrollY
      const docHeight     = document.documentElement.scrollHeight - window.innerHeight

      // Evitar división por cero en páginas muy cortas
      if (docHeight <= 0) return

      const scrollPercent = (scrollTop / docHeight) * 100

      if (scrollPercent >= threshold) {
        reachedRef.current = true
        setReached(true)

        // Evento GA4 — se empuja una sola vez
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event:           'scroll_depth_reached',
          scrollThreshold: threshold,
          pagePath:        window.location.pathname,
        })
      }
    }

    // ── Scroll listener ────────────────────────────────────────────
    window.addEventListener('scroll', check, { passive: true })

    // ── ResizeObserver — recalcula cuando el DOM crece ─────────────
    // Esto cubre: imágenes que cargan, componentes lazy, animaciones
    // que expanden contenido, fonts que cambian el layout, etc.
    const observer = new ResizeObserver(() => {
      check()  // re-evaluar con la nueva altura
    })
    observer.observe(document.documentElement)

    // Check inicial por si el usuario ya llegó al threshold antes
    // de que el hook se montara (ej: reload con scroll guardado)
    check()

    return () => {
      window.removeEventListener('scroll', check)
      observer.disconnect()
    }
  }, [threshold])

  return reached
}