import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import Header from "../components/layout/Header"
import Hero from "../components/sections/Hero"
import About from "../components/sections/About"
import MindsetIntro from "../components/sections/MindsetIntro"
import Mindset from "../components/sections/Mindset"
import Services from "../components/sections/Services"
import Projects from "../components/sections/Projects"
import Contact from "../components/sections/Contact"
import Footer from "../components/layout/Footer"

gsap.registerPlugin(ScrollTrigger)

function Home() {
    const scrollerRef = useRef(null)

    useEffect(() => {
    if (!scrollerRef.current) return

    ScrollTrigger.defaults({
        scroller: scrollerRef.current,
    })

    ScrollTrigger.scrollerProxy(scrollerRef.current, {
        scrollTop(value) {
        if (arguments.length) {
            scrollerRef.current.scrollTop = value
        }
        return scrollerRef.current.scrollTop
        },
        getBoundingClientRect() {
        return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
        }
        },
    })

    // ✅ Solo un refresh inicial, sin listener recursivo
    ScrollTrigger.refresh()

    return () => {
        ScrollTrigger.defaults({ scroller: window })
        ScrollTrigger.getAll().forEach((t) => t.kill())
    }
    }, [])

  return (
    <>
      <Header />
      <main
        ref={scrollerRef}
        id="scroll-container"
        className="h-screen overflow-y-scroll scroll-smooth bg-white"
      >
        <Hero />
        <About />
        <MindsetIntro />
        <Mindset />
        <Services />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default Home