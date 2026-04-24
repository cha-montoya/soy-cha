import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

const sections = [
  { id: "case-hero", label: "Inicio" },
  { id: "diagnostic", label: "Diagnóstico" },
  { id: "context", label: "Contexto" },
  { id: "segmentation", label: "Segmentación" },
  { id: "lifecycle", label: "Lifecycle" },
  { id: "data", label: "Data Engine" },
  { id: "metrics", label: "Métricas" },
  { id: "optimization", label: "Optimización" },
]

export default function Header() {
  const [active, setActive] = useState("hero")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observers = []

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
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
      block: "start",
    })
    setMenuOpen(false)
    history.replaceState(null, "", window.location.pathname)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-neutral-200">

      <nav className="flex justify-between items-center px-6 md:px-16 h-20">

        {/* Logo */}
        <span className="text-xl md:text-3xl font-black tracking-tight font-display">
          <a href="/">Carlos 'Cha' Montoya</a>
        </span>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8 text-sm font-medium font-sans">
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
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      </nav>

      {/* Mobile menu */}
      <div className={`md:hidden absolute top-20 left-0 w-full bg-white border-t border-neutral-200 transition-all duration-300 ${
        menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}>
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