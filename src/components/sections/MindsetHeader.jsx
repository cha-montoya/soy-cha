import { useTranslation } from "react-i18next"

export default function MindsetHeader() {

  const { t } = useTranslation()

  return (
    <section
      id="mindset"
      className="relative w-full bg-slate-600 text-white"
    >
      <div className="container mx-auto px-6 text-center">

        <div className="hero-eyebrow text-slate-200">{t("mindsetHeader.eyebrow")}</div>

        <h2 className="font-elegant text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-8" dangerouslySetInnerHTML={{ __html: t("mindsetHeader.headline") }} />

        <p className="mt-8 text-sm md:text-base lg:text-lg leading-relaxed">
          {t("mindsetHeader.paragraph")}
        </p>

      </div>
    </section>
  )
}