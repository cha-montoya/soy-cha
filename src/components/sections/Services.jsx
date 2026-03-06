export default function Services() {
    const logos = [
        "../../../src/assets/logos/acoustic.svg",
        "../../../src/assets/logos/eloqua.svg",
        "../../../src/assets/logos/hubspot.svg",
        "../../../src/assets/logos/marketo.svg",
        "../../../src/assets/logos/responsys.svg",
        "../../../src/assets/logos/salesforce.svg",
    ]

    return (
    <section id="services" className="bg-slate-400 text-white py-32 px-6 md:px-16 scroll-mt-20">
        <div className="mb-16 text-center">
            <div className="hero-eyebrow text-white">Servicios</div>
            <h2 className="font-elegant text-8xl md:text-7xl font-black tracking-tight mb-8 text-white">
                Lo que puedo hacer por ti.
            </h2>
            <p className="text-lg leading-relaxed text-neutral-200">
                Si necesitas a alguien que entienda tanto la estrategia como la ejecución creativa sin tener que traducir entre los dos, podemos trabajar juntos.
            </p>
        </div>

        {/* LOGO CAROUSEL */}
        <div className="relative w-full overflow-hidden">
            <div className="flex logo-track">
            {[...logos, ...logos].map((logo, i) => (
                <div
                key={i}
                className="flex items-center justify-center mx-16 shrink-0"
                >
                <img
                    src={logo}
                    className="h-10 w-auto opacity-60 hover:opacity-100 transition duration-300"
                    alt=""
                />
                </div>
            ))}
            </div>
        </div>
    </section>
    )
}