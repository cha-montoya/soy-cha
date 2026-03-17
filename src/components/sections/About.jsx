import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import AboutTicker from "../ui/AboutTicker"

export default function About() {

  const { t } = useTranslation()

  return (
    <section
      id="about"
      className="relative min-h-screen bg-slate-900 text-white overflow-hidden flex items-center justify-center z-20 scroll-mt-20"
    >
      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center container mx-auto px-6">

        {/* ===== TEXT ===== */}
        <div className="w-full lg:w-1/2 px-6 md:px-16 py-24 lg:py-16">
          <div className="hero-eyebrow text-neutral-400">
            {t("about.eyebrow")}
          </div>
          <h2
            className="font-elegant text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-8"
            dangerouslySetInnerHTML={{ __html: t("about.headline") }}
          />
          <div className="mt-8 text-sm md:text-base lg:text-lg leading-relaxed space-y-6">
            <p>{t("about.p1")}</p>
            <p>{t("about.p2")}</p>
            <p>{t("about.p3")}</p>
            <p>{t("about.p4")}</p>
            <p>{t("about.p5")}</p>
          </div>
        </div>

        {/* ===== TICKER ===== */}
        <div className="w-full lg:w-1/2 h-[480px] lg:h-screen flex items-center justify-center pb-16 lg:pb-0">
          <AboutTicker />
        </div>

      </div>
    </section>
  )
}