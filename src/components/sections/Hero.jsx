import { useState, useRef, useEffect } from "react"
import { useUTMPersonalization } from '../../hooks/useUTMPersonalization'

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
  const { headline, sub, cta } = useUTMPersonalization()

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
          <div className="hero-eyebrow text-neutral-500">Growth Strategy · Design · MarTech</div>
          <h1 className="text-8xl md:text-7xl font-black leading-tight tracking-tight font-elegant" dangerouslySetInnerHTML={{ __html: headline }} />
          <p className="mt-4 text-lg text-neutral-500 font-sans leading-relaxed transition-all duration-700 delay-150 ease-out">
            {sub}
          </p>
          <p className={`mt-4 text-lg text-neutral-500 font-sans leading-relaxed transition-all duration-700 delay-150 ease-out
            ${showText
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"}
          `}>
            <ul className="space-y-2 mt-6">
              <li className="group relative pl-6 text-lg tracking-wide leading-relaxed font-sans">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-neutral-400 dark:bg-neutral-600 origin-bottom scale-y-50 transition-all duration-300 group-hover:scale-y-100 group-hover:bg-black dark:group-hover:bg-white" />
                Desarrollador <span className="marker">Creativo</span> de Integraciones MarTech
              </li>

              <li className="group relative pl-6 text-lg tracking-wide leading-relaxed font-sans">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-neutral-400 dark:bg-neutral-600 origin-bottom scale-y-50 transition-all duration-300 group-hover:scale-y-100 group-hover:bg-black dark:group-hover:bg-white" />
                Growth & <span className="marker">Estratega</span> de Email Marketing
              </li>

              <li className="group relative pl-6 text-lg tracking-wide leading-relaxed font-sans">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-neutral-400 dark:bg-neutral-600 origin-bottom scale-y-50 transition-all duration-300 group-hover:scale-y-100 group-hover:bg-black dark:group-hover:bg-white" />
                <span className="marker">Experto</span> en Email Deliverability
              </li>

              <li className="group relative pl-6 text-lg tracking-wide leading-relaxed font-sans">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-neutral-400 dark:bg-neutral-600 origin-bottom scale-y-50 transition-all duration-300 group-hover:scale-y-100 group-hover:bg-black dark:group-hover:bg-white" />
                Automatización & Data & para <span className="marker">Crecimientos Escalables</span>
              </li>
            </ul>
          </p>
          <div className="mt-12">
            <button className="btn-glitch-fill">
              <span className="text">// {cta}</span><span className="text-decoration"> _</span>
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
