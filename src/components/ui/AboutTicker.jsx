import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function AboutTicker() {

  const rowRef = useRef(null)
  const animRef = useRef(null)

  const tickerText = [
    "Email Marketing",
    "Automation",
    "Data Driven",
    "Customer Journey",
    "Segmentation",
    "CRM",
    "Deliverability",
    "Lifecycle",
    "Analytics",
    "Hyper-Personalization",
    "Growth",
    "Omnichannel"
  ]

  useEffect(() => {
    if (!rowRef.current) return

    animRef.current = gsap.to(rowRef.current, {
      x: "-50%",
      duration: 80,
      ease: "linear",
      repeat: -1
    })

    return () => animRef.current?.kill()
  }, [])

  const hoverSpeed = (speed) => {
    animRef.current?.timeScale(speed)
  }

  const renderItems = () =>
    tickerText.map((text, i) => (
      <span
        key={i}
        className="text-white px-6"
      >
        {text} —
      </span>
    ))

  return (
    <div
      className="w-full overflow-hidden text-5xl md:text-9xl font-display font-black uppercase tracking-tight"
      onMouseEnter={() => hoverSpeed(0.3)}
      onMouseLeave={() => hoverSpeed(1)}
    >
      <div className="py-3">
        <div ref={rowRef} className="flex w-max">
          {/* Duplicate for seamless loop */}
          {renderItems()}
          {renderItems()}
          {renderItems()}
          {renderItems()}
        </div>
      </div>
    </div>
  )
}