import ContactForm from "../forms/ContactForm"

function Contact(){

    return (
        <section id="contact" className="min-h-screen bg-slate-100 relative scroll-mt-20 px-6 py-32">

            <div className="container mx-auto">

                <div className="grid lg:grid-cols-2 gap-20 items-start">

                    {/* LEFT SIDE */}
                    <div>

                        <div className="hero-eyebrow">Contacto</div>

                        <h2 className="font-elegant text-6xl md:text-7xl font-black tracking-tight mb-8 text-black">
                            ¿Construyendo algo <span className="italic text-primary">interesante?</span>
                        </h2>

                        <p className="mt-4 text-lg text-neutral-500 font-sans leading-relaxed max-w-md">
                            Estoy explorando nuevos roles y proyectos selectos. 
                            Si buscas a alguien que entienda el negocio, diseñe la solución 
                            y mida si funcionó. Hablemos.
                        </p>

                        {/* CTA BUTTONS */}
                        <div className="flex gap-6 mt-10">

                            <a 
                                href="https://www.linkedin.com/in/carlos-alberto-montoya/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button className="btn-glitch-fill">
                                    <span className="text">// LinkedIn</span>
                                    <span className="text-decoration"> _</span>
                                    <span className="decoration">⇒</span>
                                </button>
                            </a>

                            <a 
                                href="/cv-carlos-montoya.pdf"
                                download
                            >
                                <button className="btn-glitch-fill">
                                    <span className="text">// Descargar CV</span>
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
