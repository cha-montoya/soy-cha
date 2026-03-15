import ServicesLogoMarquee from "../ui/ServicesLogoMarquee"

import eloqua from "../../assets/logos/eloqua.svg"
import hubspot from "../../assets/logos/hubspot.svg"
import marketo from "../../assets/logos/marketo.svg"
import responsys from "../../assets/logos/responsys.svg"
import salesforce from "../../assets/logos/salesforce.svg"
import acoustic from "../../assets/logos/acoustic.svg"

export default function Services() {

    const logos = [
        eloqua,
        hubspot,
        marketo,
        responsys,
        salesforce,
        acoustic
    ]

    return (
    <section id="services" className="bg-slate-400 text-white py-32 px-6 md:px-16 scroll-mt-20">

        <div className="mb-12 text-center">
            <div className="hero-eyebrow text-white">
                Servicios
            </div>
            <h2 className="font-elegant text-4xl md:text-5xl lg:text-6xl xl:text-7xl  font-black tracking-tight mb-8 text-white">
                Lo que puedo hacer por ti.
            </h2>
            <p className="text-sm md:text-base lg:text-lg leading-relaxed text-neutral-200 max-w-3xl mx-auto">
                Si necesitas a alguien que entienda tanto la estrategia como la ejecución creativa sin tener que traducir entre los dos, podemos trabajar juntos.
            </p>
        </div>

        <div className="mb-12 container mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 items-start">
                <div>
                    <h3 className="font-elegant text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white">Liderazgo de Equipos & <span className="italic text-primary">Project Management</span></h3>
                </div>
                <div>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed text-neutral-200 mx-auto">He liderado equipos donde conviven perfiles de diseño, tecnología y estrategia y sé que la brecha entre esos mundos se cierra con comunicación clara, no con jerarquía. Gestiono proyectos con foco en resultados medibles, plazos reales y equipos que crecen en el proceso.</p>
                </div>
                
            </div>
        </div>

        <div className="mb-12 container mx-auto">
            <div className="grid lg:grid-cols-3 gap-6 items-start grid-estrategica">
                <div className="bg-slate-500 p-12 rounded-xl w-full max-w-5xl">
                    <p className="text-white mb-3 font-black font-display">
                    <span className="skill-dot"></span> Gestión de equipos creativos y de tecnología
                    </p>
                    <div className="line-divider" />
                    <p className="text-sm mt-4 text-neutral-300">Coordinación de perfiles mixtos: diseñadores, developers, especialistas en automation y analistas. Traduzco entre disciplinas para que el equipo avance en la misma dirección.</p>
                </div>
                <div className="bg-slate-500 p-12 rounded-xl w-full max-w-5xl">
                    <p className="text-white mb-3 font-black font-display">
                    <span className="skill-dot"></span> Briefing y definición de alcance
                    </p>
                    <div className="line-divider" />
                    <p className="text-sm mt-4 text-neutral-300">Levantamiento de requerimientos, documentación de alcance y definición de entregables. Un buen brief evita el 80% de los problemas de un proyecto.</p>
                </div>
                <div className="bg-slate-500 p-12 rounded-xl w-full max-w-5xl">
                    <p className="text-white mb-3 font-black font-display">
                    <span className="skill-dot"></span> Gestión de stakeholders y clientes
                    </p>
                    <div className="line-divider" />
                    <p className="text-sm mt-4 text-neutral-300">Manejo de expectativas, comunicación de avances y escalación de decisiones. Sé cuándo proteger al equipo de cambios de último minuto y cuándo adaptarse.</p>
                </div>
                <div className="bg-slate-500 p-12 rounded-xl w-full max-w-5xl">
                    <p className="text-white mb-3 font-black font-display">
                    <span className="skill-dot"></span> Mentoring y desarrollo de talento
                    </p>
                    <div className="line-divider" />
                    <p className="text-sm mt-4 text-neutral-300">Acompañamiento a perfiles junior y mid en su desarrollo técnico y estratégico. Me interesa construir equipos que no me necesiten para cada decisión.</p>
                </div>
                <div className="bg-slate-500 p-12 rounded-xl w-full max-w-5xl">
                    <p className="text-white mb-3 font-black font-display">
                    <span className="skill-dot"></span> Comunicación entre áreas
                    </p>
                    <div className="line-divider" />
                    <p className="text-sm mt-4 text-neutral-300">Puente entre diseño, tecnología y negocio. Hablo los tres idiomas — y eso reduce fricción, acelera decisiones y mejora la calidad del output final.</p>
                </div>
                <div className="bg-slate-500 p-12 rounded-xl w-full max-w-5xl">
                    <p className="text-white mb-3 font-black font-display">
                    <span className="skill-dot"></span> Seguimiento y entrega de proyectos
                    </p>
                    <div className="line-divider" />
                    <p className="text-sm mt-4 text-neutral-300">Control de timelines, identificación de bloqueos y gestión de dependencias entre equipos. Prefiero resolver un problema el martes que explicarlo el viernes.</p>
                </div>
            </div>
        </div>    

        {/* LOGO MARQUEE */}
        <div className="relative w-full overflow-hidden">
            
            {/* Fade izquierdo */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-slate-400 to-transparent z-10" />

            {/* Fade derecho */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-slate-400 to-transparent z-10" />

            <div className="flex logo-track items-center">
                {[...logos, ...logos].map((logo, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-center w-[240px] h-[120px] mx-10 shrink-0"
                    >
                        <img
                            src={logo}
                            alt="ESP logo"
                            className="h-[120px] w-auto object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition"
                        />
                    </div>
                ))}
            </div>
        </div>

    </section>
    )
}