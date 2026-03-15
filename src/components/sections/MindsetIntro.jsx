import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function MindsetIntro() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = section.querySelectorAll(".fill-line")
    if (!lines.length) return

    gsap.set(lines, {
      opacity: 0,
      clipPath: "inset(0 100% 0 0)"
    })

    // Usamos gsap.context para un cleanup seguro y aislado
    // que NO afecta los ScrollTriggers de otros componentes
    const ctx = gsap.context(() => {
      gsap.to(lines, {
        opacity: 1,
        clipPath: "inset(0 0% 0 0)",
        stagger: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 40%",
          scrub: true,
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="mindset-intro"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-600 px-6 md:px-16"
    >
      <div className="max-w-6xl text-6xl md:text-8xl container mx-auto px-6 font-black leading-tight tracking-tight text-white">
        <span className="block fill-line font-display">
          No diseño piezas individuales.
        </span>
        <span className="block fill-line font-display">
          Diseño sistemas.
        </span>
        <span className="block fill-line font-display">
          Estrategia, ejecución y optimización
        </span>
        <span className="block fill-line font-display">
          como un solo flujo.
        </span>
      </div>
    </section>
  )
}