import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function AboutTicker() {

  const rows = useRef([])
  const animations = useRef([])

  const tickerText = [
    "Email Marketing",
    "Automation",
    "Data Strategy",
    "Customer Journey",
    "Segmentation",
    "CRM",
    "Deliverability",
    "Lifecycle",
    "Analytics",
    "Personalization",
    "Growth",
    "Campaigns"
  ]

  useEffect(() => {

    const durations = [40, 46, 38, 44, 42, 48]

    rows.current.forEach((row, i) => {

      const dir = i % 2 === 0 ? "-50%" : "50%"

      const anim = gsap.to(row, {
        x: dir,
        duration: durations[i],
        ease: "linear",
        repeat: -1
      })

      animations.current.push(anim)
    })

  }, [])

  const hoverSpeed = (speed) => {
    animations.current.forEach(a => a.timeScale(speed))
  }

  const renderTicker = () => (
    <div className="flex whitespace-nowrap">
      {[...tickerText].map((text, i) => (
        <span
          key={i}
          className="text-transparent [-webkit-text-stroke:1px_rgba(71,85,105,1)]"
        >
          {text} —
        </span>
      ))}
    </div>
  )

  return (
    <div
      className="w-full overflow-hidden text-4xl md:text-8xl font-display font-black uppercase tracking-tight [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      onMouseEnter={() => hoverSpeed(2)}
      onMouseLeave={() => hoverSpeed(1)}
    >

      {[...Array(6)].map((_, i) => (
        <div key={i} className="overflow-hidden">

          <div
            ref={el => rows.current[i] = el}
            className="flex w-max"
          >
            {renderTicker()}
            {renderTicker()}
          </div>

        </div>
      ))}

    </div>
  )
}