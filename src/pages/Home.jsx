import Header from "../components/layout/Header"
import Hero from "../components/sections/Hero"
import About from "../components/sections/About"
import MindsetIntro from "../components/sections/MindsetIntro"
import Mindset from "../components/sections/Mindset"
import Projects from "../components/sections/Projects"
import Contact from "../components/sections/Contact"
import Footer from "../components/layout/Footer"

function Home() {
    return (
        <>
        <Header />
        <main id="scroll-container" className="h-screen overflow-y-scroll scroll-smooth bg-white">
            <Hero />
            <About />
            <MindsetIntro />
            <Mindset />
            <Projects />
            <Contact />
        </main>
        <Footer />
        </>
    )
}

export default Home