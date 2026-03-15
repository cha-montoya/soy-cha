function Footer() {
  return (
    <footer className="bg-black text-white py-20">

      <div className="container mx-auto px-6">

        <div className="grid md:grid-cols-3 gap-12">

          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-black tracking-tight font-display mb-4">
              Carlos 'Cha' Montoya
            </h3>

            <p className="text-neutral-400 leading-relaxed max-w-xs">
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
              Navegación
            </h4>

            <ul className="space-y-2 text-neutral-400">

              <li><a className="nav-link" href="#hero">Home</a></li>
              <li><a className="nav-link" href="#projects">Proyectos</a></li>
              <li><a className="nav-link" href="#about">Sobre mí</a></li>
              <li><a className="nav-link" href="#contact">Contacto</a></li>

            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-lg font-black mb-4 font-display">
              Contacto
            </h4>

            <ul className="space-y-2 text-neutral-400">

              <li><a className="nav-link" href="mailto:cha@soycha.com">cha@soycha.com</a></li>
              <li><a className="nav-link" href="https://www.linkedin.com/in/carlos-alberto-montoya/">LinkedIn</a></li>
              <li>CDMX, México</li>

            </ul>
          </div>

        </div>

        {/* bottom bar */}

        {/* STACK */}
<div className="border-t border-neutral-800 mt-16 pt-6 text-sm text-neutral-500 flex flex-wrap gap-2">

  <span className="text-neutral-400">Stack:</span>

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

<div className="mt-6 text-xs text-neutral-500 flex flex-col md:flex-row md:justify-between gap-4">

  <p>
    Este sitio utiliza cookies mínimas para mejorar la experiencia de navegación.
  </p>

  <p>
    © {new Date().getFullYear()} Carlos Montoya. All rights reserved.
  </p>

</div>


      </div>

    </footer>
  )
}

export default Footer
