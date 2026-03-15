import { useRef, useEffect, useState } from "react"
import { useUTMPersonalization } from "../../hooks/useUTMPersonalization"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import bassIn from "../../assets/videos/bass_in.mp4"
import bassOut from "../../assets/videos/bass_out.mp4"
import basketIn from "../../assets/videos/basket_in.mp4"
import basketOut from "../../assets/videos/basket_out.mp4"
import watchIn from "../../assets/videos/watch_in.mp4"
import watchOut from "../../assets/videos/watch_out.mp4"

gsap.registerPlugin(ScrollTrigger)

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

  const heroRef = useRef(null)
  const textWrapperRef = useRef(null)
  const textRef = useRef(null)
  const videoWrapperRef = useRef(null)

  // =========================
  // 🎥 VIDEO SEQUENCE
  // =========================

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

  // =========================
  // ✨ ENTRADA + 🎬 PARALLAX
  // =========================

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        !heroRef.current ||
        !textRef.current ||
        !textWrapperRef.current ||
        !videoWrapperRef.current
      ) return

      const ctx = gsap.context(() => {

        // Entrada inicial del texto
        gsap.fromTo(
          textRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.15 }
        )

        // Parallax: texto sube
        gsap.fromTo(
          textWrapperRef.current,
          { y: 0 },
          {
            y: -100,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        )

        // Fade out texto al scrollear
        gsap.fromTo(
          textRef.current,
          { opacity: 1 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "10% top",
              end: "50% top",
              scrub: 1.2,
            },
          }
        )

        // Parallax: video baja (dirección opuesta = profundidad)
        gsap.fromTo(
          videoWrapperRef.current,
          { y: 0 },
          {
            y: 150,
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        )

      }, heroRef)

      return () => ctx.revert()
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full bg-white scroll-mt-20
                 h-auto min-h-screen
                 flex flex-col
                 lg:h-screen lg:block"
    >
      <div className="relative z-10 h-full container mx-auto px-6 md:px-12
                      flex flex-col
                      lg:flex lg:flex-row lg:items-center lg:py-24">

        {/* ================= TEXT ================= */}
        {/* On mobile: full width, sits on top. On lg+: left half column */}
        <div
          ref={textWrapperRef}
          className="w-full lg:w-1/2 pt-24 pb-6 lg:py-32"
          style={{ willChange: "transform" }}
        >
          <div
            ref={textRef}
            className="px-6 md:px-16"
            style={{ willChange: "opacity, transform" }}
          >
            <div className="hero-eyebrow text-neutral-500">
              Growth Strategy · Design · MarTech
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight font-elegant"
              dangerouslySetInnerHTML={{ __html: headline }}
            />

            <p className="mt-8 text-sm md:text-base lg:text-lg leading-relaxed text-neutral-500 font-sans">
              {sub}
            </p>

            <div className="mt-8">
              <button className="btn-glitch-fill">
                <span className="text">// {cta}</span>
                <span className="text-decoration"> _</span>
                <span className="decoration">⇒</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= VIDEO ================= */}
        {/*
          Mobile  → normal flow, centered below text, relative positioning
          lg+     → absolute right, vertically centered (original behavior)
        */}
        <div className="w-full flex justify-center pb-12
                        lg:w-auto lg:pb-0 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2
                        pointer-events-none">
          <div
            ref={videoWrapperRef}
            style={{ willChange: "transform" }}
          >
            <video
              key={currentVideo}
              src={videoSequence[currentVideo].src}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleEnded}
              className="h-[45vh] lg:h-[80vh] max-w-none object-contain"
            />
          </div>
        </div>

      </div>
    </section>
  )
}