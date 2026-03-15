import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import Header from "../components/layout/Header"
import Hero from "../components/sections/Hero"
import About from "../components/sections/About"
import MindsetIntro from "../components/sections/MindsetIntro"
import MindsetHeader from "../components/sections/MindsetHeader"
import MindsetCards from "../components/sections/MindsetCards"
import Services from "../components/sections/Services"
import Projects from "../components/sections/Projects"
import Contact from "../components/sections/Contact"
import Footer from "../components/layout/Footer"

gsap.registerPlugin(ScrollTrigger)

function Home() {

  useEffect(() => {
    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <>
      <Header />
      {/*
        IMPORTANTE: quitamos el div con overflow-y-scroll como scroller.
        El scroll ahora lo maneja window directamente, que es lo que
        ScrollTrigger espera para que el pin funcione correctamente.
        El <main> es solo un contenedor visual, no el scroller.
      */}
      <main id="scroll-container" className="bg-white">
        <Hero />
        <About />
        <MindsetIntro />
        <MindsetHeader />
        <MindsetCards />
        <Services />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default Home