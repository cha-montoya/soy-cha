import { useTranslation } from "react-i18next"

import eloqua from "../../assets/logos/eloqua.svg"
import hubspot from "../../assets/logos/hubspot.svg"
import marketo from "../../assets/logos/marketo.svg"
import responsys from "../../assets/logos/responsys.svg"
import salesforce from "../../assets/logos/salesforce.svg"
import acoustic from "../../assets/logos/acoustic.svg"

export default function Services() {
    const { t } = useTranslation()
    const cards = t("services.cards", { returnObjects: true })

    const logos = [eloqua, hubspot, marketo, responsys, salesforce, acoustic]

    return (
    <section id="services" className="bg-slate-400 text-white py-16 md:py-32 px-6 md:px-16 scroll-mt-20">

        <div className="mb-12 text-center">
            <div className="hero-eyebrow text-white">
                {t("services.eyebrow")}
            </div>
            <h2
                className="font-elegant text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-8 text-white"
                dangerouslySetInnerHTML={{ __html: t("services.headline") }}
            />
            <p className="text-sm md:text-base lg:text-lg leading-relaxed text-neutral-200 max-w-3xl mx-auto">
                {t("services.paragraph")}
            </p>
        </div>

        <div className="mb-12 container mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 items-start">
                <div>
                    <h3
                        className="font-elegant text-3xl lg:text-5xl font-black tracking-tight text-white"
                        dangerouslySetInnerHTML={{ __html: t("services.sub") }}
                    />
                </div>
                <div>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed text-neutral-200">
                        {t("services.line1")}
                    </p>
                </div>
            </div>
        </div>

        <div className="mb-12 container mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {cards.map(({ title, desc }) => (
                    <div key={title} className="bg-slate-500 p-6 md:p-8 lg:p-12 rounded-xl w-full flex flex-col h-full">
                        <p className="text-white mb-3 font-black font-display">
                            <span className="skill-dot"></span> {title}
                        </p>
                        <div className="line-divider" />
                        <p className="text-sm mt-4 text-neutral-300 flex-1">{desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* LOGO MARQUEE */}
        <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-slate-400 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-slate-400 to-transparent z-10" />

            <div className="flex logo-track items-center">
                {[...logos, ...logos].map((logo, i) => (
                    <div key={i} className="flex items-center justify-center w-[240px] h-[120px] mx-10 shrink-0">
                        <img
                            src={logo}
                            alt="platform logo"
                            className="h-[120px] w-auto object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition"
                        />
                    </div>
                ))}
            </div>
        </div>

    </section>
    )
}