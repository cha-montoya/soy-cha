import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { label } from "framer-motion/client"

const sections = [
  { id: "hero", anchor: "hero", label: "Inicio" },
  { id: "about", anchor: "about", label: "Sobre mí" },
  { id: "mindset-intro", anchor: "mindset-intro", label: "Cómo pienso" },
  { id: "services", anchor: "services", label: "Servicios" },
  { id: "projects", anchor: "projects", label: "Proyectos" },
  { id: "contact", anchor: "contact", label: "Contacto" },
]

export default function Header() {

  const [active, setActive] = useState("hero")
  const [menuOpen, setMenuOpen] = useState(false)

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
        { rootMargin: "-40% 0px -40% 0px" }
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

    setMenuOpen(false)
    history.replaceState(null, "", window.location.pathname)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-neutral-200">

      <nav className="flex justify-between items-center px-6 md:px-16 h-20">

        {/* Logo */}
        <span className="text-2xl md:text-3xl font-black tracking-tight font-display">
          Carlos 'Cha' Montoya
        </span>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-8 text-sm font-medium">
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

        {/* Mobile button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-20 left-0 w-full bg-white border-t border-neutral-200 transition-all duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <ul className="flex flex-col items-center gap-6 py-10 text-lg font-medium">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={`${active === id ? "text-black font-semibold" : "text-neutral-500"}`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </header>
  )
}