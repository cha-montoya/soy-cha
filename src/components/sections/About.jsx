import { useTranslation } from "react-i18next"
import AboutTicker from "../ui/AboutTicker"

export default function About() {

  const { t } = useTranslation()

  return (
    <section
      id="about"
      className="relative min-h-screen bg-slate-900 text-white overflow-hidden flex flex-col justify-center z-20 scroll-mt-20"
    >
      <div className="relative z-10 w-full flex flex-col container mx-auto px-6">

        {/* ===== TEXT — two columns ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 md:px-16 py-24 lg:py-20">
          <div>
            <div className="hero-eyebrow text-neutral-400">
              {t("about.eyebrow")}
            </div>
            <h2
              className="font-elegant text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-8"
              dangerouslySetInnerHTML={{ __html: t("about.headline") }}
            />
          </div>
          <div className="flex flex-col justify-end text-sm md:text-base lg:text-lg leading-relaxed space-y-6 text-neutral-300">
            <p>{t("about.p1")}</p>
            <p>{t("about.p2")}</p>
            <p>{t("about.p3")}</p>
            <p>{t("about.p4")}</p>
            <p>{t("about.p5")}</p>
          </div>
        </div>

      </div>

      {/* ===== TICKER — full width, bottom of section ===== */}
      <div className="relative z-10 w-full mt-12 pb-12">
        <AboutTicker />
      </div>

    </section>
  )
}