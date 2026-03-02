import { useState } from 'react'
import { useScrollDepth } from './useScrollDepth'

/**
 * ScrollCTA
 * Barra flotante centrada en la parte inferior que aparece cuando
 * el usuario llega al 75% de scroll de la página.
 *
 * Uso:
 *   import { ScrollCTA } from './ScrollCTA'
 *   <ScrollCTA />
 *
 * Colócalo una sola vez, cerca del root de tu app (App.jsx o Layout.jsx).
 */
export function ScrollCTA() {
  const reached   = useScrollDepth(75)
  const [dismissed, setDismissed] = useState(false)

  // No mostrar si no se alcanzó el threshold o el usuario cerró
  if (!reached || dismissed) return null

  return (
    <div
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2
        z-50
        flex items-center gap-4
        bg-[#1A1A18] text-[#F0EDE8]
        border border-[#2E2E2B]
        rounded-full
        px-5 py-3
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        animate-slide-up
      "
      role="complementary"
      aria-label="Llamada a acción"
    >
      {/* Indicador verde de disponibilidad */}
      <span className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
        ¿Te quedaste leyendo?
      </span>

      {/* CTA */}
      <a
        href="#contact"
        onClick={() => setDismissed(true)}
        className="
          text-sm font-semibold
          bg-[#C8501A] text-white
          px-4 py-1.5 rounded-full
          hover:bg-[#E05E20]
          transition-colors duration-200
          whitespace-nowrap
        "
      >
        Hablemos →
      </a>

      {/* Botón cerrar */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Cerrar"
        className="
          text-[#8A8A82] hover:text-[#F0EDE8]
          transition-colors duration-200
          text-lg leading-none ml-1
          shrink-0
        "
      >
        ✕
      </button>
    </div>
  )
}