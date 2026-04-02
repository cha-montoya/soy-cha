import { useTranslation } from "react-i18next"
import ContactForm from "../forms/ContactForm"

function Contact() {
    const { t, i18n } = useTranslation()

    const cvFile = i18n.language === "es"
    ? "/cv/cv_carlos_montoya_es.pdf"
    : "/cv/cv_carlos_montoya_en.pdf"

    return (
        <section id="contact" className="min-h-screen bg-slate-100 relative scroll-mt-20 px-6 py-16 md:py-32">
        <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-start">

            {/* LEFT SIDE */}
            <div>
                <div className="hero-eyebrow">{t("contact.eyebrow")}</div>

                <h2
                className="font-elegant text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-8 text-black"
                dangerouslySetInnerHTML={{ __html: t("contact.headline") }}
                />

                <p className="mt-4 text-sm md:text-base lg:text-lg text-neutral-500 font-sans leading-relaxed max-w-md">
                {t("contact.paragraph")}
                </p>

                <div className="md:flex gap-6 mt-8">
                    <a href="https://www.linkedin.com/in/carlos-alberto-montoya/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button className="btn-glitch-fill mb-8">
                        <span className="text">// {t("contact.linkedin")}</span>
                        <span className="text-decoration"> _</span>
                        <span className="decoration">⇒</span>
                        </button>
                    </a>

                    <a href={cvFile} target="_blank">
                        <button className="btn-glitch-fill">
                        <span className="text">// {t("contact.cv")}</span>
                        <span className="text-decoration"> _</span>
                        <span className="decoration">⇒</span>
                        </button>
                    </a>
                </div>
            </div>

            {/* FORM SIDE */}
            <ContactForm />

            </div>
        </div>
        </section>
    )
}

export default Contact
