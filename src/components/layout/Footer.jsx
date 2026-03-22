import { useTranslation } from "react-i18next"
import { EnvelopeIcon, LinkedinLogoIcon, GithubLogoIcon, MapPinLineIcon } from "@phosphor-icons/react"

function Footer() {
  const { t } = useTranslation()

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
            <div className="text-neutral-200 leading-relaxed max-w-xs text-sm md:text-base lg:text-lg space-y-6">
              <p>{t("footer.tagline1")}</p>
              <p>{t("footer.tagline2")}</p>
            </div>

            {/* <div className="flex gap-6 mt-6">

              <a href="https://linkedin.com">
                LinkedIn
              </a>

              <a href="/cv-carlos-montoya.pdf">
                Descargar CV
              </a>

            </div> */}
          </div>

          <div>
            <h4 className="text-lg font-black font-display mb-4">
              {t("footer.menu")}
            </h4>

            <ul className="space-y-2 text-neutral-200 text-sm md:text-base lg:text-lg">
              <li>
                <button
                  onClick={() => scrollToSection("hero")}
                  className="hover:text-primary transition nav-link"
                >
                  {t("footer.menu1")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:text-primary transition nav-link"
                >
                  {t("footer.menu2")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("trajectory")}
                  className="hover:text-primary transition nav-link"
                >
                  {t("footer.menu3")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("mindset-intro")}
                  className="hover:text-primary transition nav-link"
                >
                  {t("footer.menu4")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="hover:text-primary transition nav-link"
                >
                  {t("footer.menu5")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("projects")}
                  className="hover:text-primary transition nav-link"
                >
                  {t("footer.menu6")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-primary transition nav-link"
                >
                  {t("footer.menu7")}
                </button>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-lg font-black mb-4 font-display">
              {t("footer.contact")}
            </h4>

            <ul className="space-y-2 text-neutral-200 text-sm md:text-base lg:text-lg">
              <li className="flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5 text-neutral-300" />
                <a className="nav-link" href="mailto:cha@soycha.com">
                  cha@soycha.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <LinkedinLogoIcon className="w-5 h-5 text-neutral-300" />
                <a className="nav-link" href="https://www.linkedin.com/in/carlos-alberto-montoya/" target="_blank">
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center gap-2">
                <GithubLogoIcon className="w-5 h-5 text-neutral-300" />
                <a className="nav-link" href="https://github.com/cha-montoya/" target="_blank">
                  GitHub
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPinLineIcon className="w-5 h-5 text-neutral-300" />
                  {t("footer.country")}
              </li>
            </ul>
          </div>

        </div>

        {/* bottom bar */}

        {/* STACK */}
        <div className="border-t border-neutral-600 mt-16 pt-6 text-sm text-neutral-400 flex flex-wrap gap-2">

          <span className="text-neutral-200">Stack:</span>

          <span>React</span>
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
            {t("footer.disclamer")}
          </p>

          <p>
            © {new Date().getFullYear()} Carlos 'Cha' Montoya. {t("footer.copyright")}
          </p>

        </div>

      </div>

    </footer>
  )
}

export default Footer
