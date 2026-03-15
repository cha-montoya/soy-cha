function Footer() {

  const scrollToSection = (id) => {
  const el = document.getElementById(id)

    if (el) {
      window.scrollTo({
        top: el.offsetTop,
        behavior: "smooth"
      })
    }
  }

  return (
    <footer className="bg-slate-900 text-white py-20">

      <div className="container mx-auto px-6">

        <div className="grid md:grid-cols-3 gap-12">

          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-black tracking-tight font-display mb-4">
              Carlos 'Cha' Montoya
            </h3>

            <p className="text-neutral-200 leading-relaxed max-w-xs text-sm md:text-base lg:text-lg">
              Estrategia, diseño y desarrollo.
              Construyendo experiencias digitales que conectan negocio y tecnología.
            </p>

            {/* <div className="flex gap-6 mt-6">

              <a href="https://linkedin.com">
                LinkedIn
              </a>

              <a href="/cv-carlos-montoya.pdf">
                Descargar CV
              </a>

            </div> */}
          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className="text-lg font-black font-display mb-4">
              Menú
            </h4>

            <ul className="space-y-2 text-neutral-200 text-sm md:text-base lg:text-lg">
              <li>
                <button
                  onClick={() => scrollToSection("hero")}
                  className="hover:text-primary transition"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:text-primary transition"
                >
                  Sobre Mí
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("mindset-intro")}
                  className="hover:text-primary transition"
                >
                  Cómo pienso
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="hover:text-primary transition"
                >
                  Servicios
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("projects")}
                  className="hover:text-primary transition"
                >
                  Proyectos
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-primary transition"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-lg font-black mb-4 font-display">
              Contacto
            </h4>

            <ul className="space-y-2 text-neutral-200 text-sm md:text-base lg:text-lg">
              <li><a className="nav-link" href="mailto:cha@soycha.com">cha@soycha.com</a></li>
              <li><a className="nav-link" href="https://www.linkedin.com/in/carlos-alberto-montoya/" target="_blank">LinkedIn</a></li>
              <li>CDMX, México</li>
            </ul>
          </div>

        </div>

        {/* bottom bar */}

        {/* STACK */}
        <div className="border-t border-neutral-600 mt-16 pt-6 text-sm text-neutral-400 flex flex-wrap gap-2">

          <span className="text-neutral-200">Stack:</span>

          <span>React</span>
          <span>·</span>
          <span>Vite</span>
          <span>·</span>
          <span>TailwindCSS</span>
          <span>·</span>
          <span>Framer Motion</span>
          <span>·</span>
          <span>Vercel</span>

        </div>

        {/* BOTTOM BAR */}

        <div className="mt-6 text-xs text-neutral-400 flex flex-col md:flex-row md:justify-between gap-4">

          <p>
            Este sitio utiliza cookies mínimas para mejorar la experiencia de navegación.
          </p>

          <p>
            © {new Date().getFullYear()} Carlos 'Cha' Montoya. Derechos Reservados.
          </p>

        </div>

      </div>

    </footer>
  )
}

export default Footer
