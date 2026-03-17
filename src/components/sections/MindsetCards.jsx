import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function MindsetCards() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  const cards = t("mindsetCards.cards", { returnObjects: true })

  useEffect(() => {
    // Only run the horizontal scroll effect on desktop
    if (window.innerWidth < 1024) return

    const timer = setTimeout(() => {
      const totalCards = cards.length

      const ctx = gsap.context(() => {
        gsap.to(trackRef.current, {
          x: () => -(trackRef.current.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${trackRef.current.scrollWidth - window.innerWidth}`,
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (totalCards - 1),
              duration: 0.5,
              delay: 0,
              ease: "power2.inOut"
            }
          }
        })
      }, sectionRef)

      ScrollTrigger.refresh()

      return () => ctx.revert()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const CardContent = ({ card }) => (
    <div className="bg-neutral-950 p-6 md:p-12 rounded-xl w-full max-w-5xl">
      <div className="mb-8 lg:mb-10">
        <div className="hero-eyebrow text-neutral-400">
          <span className="text-primary">{card.num}.</span> {t("mindsetCards.eyebrow")}
        </div>
        <h3 className="text-4xl lg:text-6xl font-black font-elegant mb-4">{card.title}</h3>
        <p className="italic mb-6 lg:mb-8">{card.subtitle}</p>
        <div className="line-divider" />
        <p className="text-neutral-300 mt-6 lg:mt-8 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl">
          {card.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 grid-estrategica">
        {card.skills.map(([title, desc]) => (
          <div key={title} className="bg-neutral-900 p-4 lg:p-6 rounded-xl skill">
            <p className="text-white mb-3 font-black font-display">
              <span className="skill-dot"></span> {title}
            </p>
            <div className="line-divider" />
            <p className="text-sm mt-4 text-neutral-300">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* ===== MOBILE / TABLET: vertical stack ===== */}
      <section
        id="mindset-cards"
        className="lg:hidden bg-slate-600 text-white py-16 px-6"
      >
        <div className="flex flex-col gap-10 items-center">
          {cards.map((card) => (
            <CardContent key={card.num} card={card} />
          ))}
        </div>
      </section>

      {/* ===== DESKTOP: horizontal GSAP scroll ===== */}
      <section
        ref={sectionRef}
        id="mindset-cards"
        className="hidden lg:block relative bg-slate-600 text-white overflow-hidden"
        style={{ height: "100vh" }}
      >
        <div
          ref={trackRef}
          className="flex h-full"
          style={{ width: `${cards.length * 100}vw` }}
        >
          {cards.map((card) => (
            <div
              key={card.num}
              className="mindset-card flex items-center justify-center px-6"
              style={{ width: "100vw", height: "100vh", flexShrink: 0 }}
            >
              <CardContent card={card} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}