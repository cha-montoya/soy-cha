import { useState, useRef, useEffect } from "react"

import bassIn from "../../assets/videos/bass_in.mp4"
import bassOut from "../../assets/videos/bass_out.mp4"
import basketIn from "../../assets/videos/basket_in.mp4"
import basketOut from "../../assets/videos/basket_out.mp4"
import watchIn from "../../assets/videos/watch_in.mp4"
import watchOut from "../../assets/videos/watch_out.mp4"

const videoSequence = [
  { src: bassIn, type: "action" },
  { src: bassOut, type: "idle" },
  { src: basketIn, type: "action" },
  { src: basketOut, type: "idle" },
  { src: watchIn, type: "action" },
  { src: watchOut, type: "idle" },
]

const IDLE_PAUSE = 1200

export default function Hero() {
  const [currentVideo, setCurrentVideo] = useState(0)
  const timeoutRef = useRef(null)

  const handleEnded = () => {
    const isIdle = videoSequence[currentVideo].type === "idle"

    timeoutRef.current = setTimeout(() => {
      setCurrentVideo((prev) => (prev + 1) % videoSequence.length)
    }, isIdle ? IDLE_PAUSE : 0)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  //Texto
  const [showText, setShowText] = useState(false)
  const textRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowText(true)
          observer.disconnect()
        }
      },
      { threshold: 0.6 }
    )

    if (textRef.current) observer.observe(textRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-white scroll-mt-20">

      <div className="relative z-10 h-full flex items-center container mx-auto px-6 py-32">

        {/* Texto */}
        <div ref={textRef} className={`w-1/2 px-6 md:px-16 transition-all duration-700 ease-out ${showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight font-display">
            Carlos 'Cha' Montoya
          </h1>
          <p className={`mt-4 text-lg text-neutral-500 font-sans leading-relaxed transition-all duration-700 delay-150 ease-out
            ${showText
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"}
          `}>
            <span className="marker">Creative</span> Developer & Motion Designer<br />
            Growth & Email Marketing <span className="marker">Strategist</span><br />
            CRM & Deliverability <span className="marker">Expert</span><br />
            Automation, Data & Martech Integrations for <span className="marker">Scalable Growth</span>
          </p>
          <div className="mt-12">
            <button className="btn-glitch-fill">
              <span className="text">// Conóceme</span><span className="text-decoration"> _</span>
              <span className="decoration">⇒</span>
            </button>
          </div>
        </div>

        {/* Animacion */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
          <video
            key={currentVideo}
            src={videoSequence[currentVideo].src}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleEnded}
            className="
              h-[80vh] max-w-none object-contain
            "
          />
        </div>
      </div>

    </section>
  )
}
