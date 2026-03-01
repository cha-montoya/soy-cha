import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Mindset() {
  
useEffect(() => {
  const ctx = gsap.context(() => {
    const cards = gsap.utils.toArray(".mindset-card")

    gsap.set(cards, {
      opacity: 0,
      scale: 0.9,
      filter: "blur(8px)"
    })

    gsap.set(cards[0], {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)"
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#mindset",
        scroller: "#scroll-container",
        start: "top top",
        end: "+=300%",
        scrub: true,
        pin: ".mindset-pin",
        anticipatePin: 1
      }
    })

    cards.forEach((card, i) => {
      if (i === 0) return

      tl.to(cards[i - 1], {
        opacity: 0,
        scale: 1.15,
        filter: "blur(12px)",
        duration: 1
      })

      tl.fromTo(card,
        {
          opacity: 0,
          scale: 0.9,
          filter: "blur(8px)"
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1
        },
        "<"
      )
    })
  })

  return () => ctx.revert()
}, [])

  return (
    <section id="mindset" className="relative w-full min-h-[400vh] bg-slate-600 text-white">
      <div className="mindset-pin sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-5xl px-6 md:px-16 isolate">

          {/* Card 1 */}
          <div className="mindset-card absolute inset-0 flex items-center justify-center will-change-transform will-change-opacity">
            <div className="bg-neutral-900 p-12 max-w-xl">
              <h2 className="text-4xl font-black mb-8 font-display">
                Estrategia
              </h2>
              <div className="line-divider"></div>
              <p className="text-neutral-300 mt-8">
                Diseño y planeación de estrategias digitales enfocadas en crecimiento.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="mindset-card absolute inset-0 flex items-center justify-center will-change-transform will-change-opacity">
            <div className="bg-neutral-900 p-12 max-w-xl">
              <h2 className="text-4xl font-black mb-8 font-display">
                Implementación
              </h2>
              <div className="line-divider"></div>
              <p className="text-neutral-300 mt-8">
                Ejecución técnica, creativa y automatizada.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="mindset-card absolute inset-0 flex items-center justify-center will-change-transform will-change-opacity">
            <div className="bg-neutral-900 p-12 max-w-xl">
              <h2 className="text-4xl font-black mb-8 font-display">
                Optimización
              </h2>
              <div className="line-divider"></div>
              <p className="text-neutral-300 mt-8">
                Iteración constante basada en datos y performance real.
              </p>
            </div>
          </div>
        
        </div>
      </div>
    </section>
  )
}
