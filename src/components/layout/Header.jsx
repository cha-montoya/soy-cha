import { label } from "framer-motion/client"
import { useEffect, useState } from "react"

const sections = [
  { id: "hero", anchor: "hero", label: "Inicio" },
  { id: "about", anchor: "about", label: "Sobre mí" },
  { id: "mindset-intro", anchor: "mindset-intro", label: "Cómo pienso" },
  { id: "projects", anchor: "projects", label: "Proyectos" },
  { id: "contact", anchor: "contact", label: "Contacto" },
]


export default function Header() {
  const [active, setActive] = useState("hero")

  useEffect(() => {
    const observers = []

    sections.forEach(({ id, anchor }) => {
      const el = document.getElementById(anchor)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id)
          }
        },
        {
          rootMargin: "-40% 0px -40% 0px"
        }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })

    history.replaceState(null, "", window.location.pathname)
  }


  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white drop-shadow-md">
      <nav className="flex justify-between items-center px-6 md:px-16 h-20">
        
        <span className="text-2xl font-black leading-tight tracking-tight font-display">Carlos 'Cha' Montoya</span>
        
        <ul className="flex gap-8 text-sm font-medium">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={`nav-link ${active === id ? "nav-link-active" : ""}`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

      </nav>
    </header>
  )
}