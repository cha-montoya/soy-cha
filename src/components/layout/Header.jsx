import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Menu, X } from "lucide-react"

const sections = [
  { id: "hero", anchor: "hero", tKey: "nav.hero" },
  { id: "about", anchor: "about", tKey: "nav.about" },
  { id: "mindset-intro", anchor: "mindset-intro", tKey: "nav.mindset" },
  { id: "services", anchor: "services", tKey: "nav.services" },
  { id: "projects", anchor: "projects", tKey: "nav.projects" },
  { id: "contact", anchor: "contact", tKey: "nav.contact" },
]

export default function Header() {
  const { t, i18n } = useTranslation()
  const [active, setActive] = useState("hero")
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleLanguage = () => {
    const next = i18n.language === "es" ? "en" : "es"
    i18n.changeLanguage(next)
    localStorage.setItem("language", next)
  }

  const LanguageToggle = () => (
    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500">
      <button
        onClick={toggleLanguage}
        className={`transition-colors hover:text-black ${i18n.language === "es" ? "text-black underline underline-offset-4" : ""}`}
      >
        ES
      </button>
      <span>|</span>
      <button
        onClick={toggleLanguage}
        className={`transition-colors hover:text-black ${i18n.language === "en" ? "text-black underline underline-offset-4" : ""}`}
      >
        EN
      </button>
    </div>
  )

  useEffect(() => {
    const observers = []

    sections.forEach(({ anchor, id }) => {
      const el = document.getElementById(anchor)
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    setMenuOpen(false)
    history.replaceState(null, "", window.location.pathname)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-neutral-200">

      <nav className="flex justify-between items-center px-6 md:px-16 h-20">

        {/* Logo */}
        <span className="text-xl md:text-3xl font-black tracking-tight font-display">
          Carlos 'Cha' Montoya
        </span>

        {/* Desktop menu + Language toggle */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8 text-sm font-medium">
            {sections.map(({ id, tKey }) => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className={`nav-link ${active === id ? "nav-link-active" : ""}`}
                >
                  {t(tKey)}
                </button>
              </li>
            ))}
          </ul>
          <LanguageToggle />
        </div>

        {/* Mobile: language toggle + hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <LanguageToggle />
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
          {sections.map(({ id, tKey }) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={`${active === id ? "text-black font-semibold" : "text-neutral-500"}`}
              >
                {t(tKey)}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </header>
  )
}
