function Contact(){
    return (
        <section id="contact" className="h-screen bg-slate-100 overflow-hidden items-center justify-center relative scroll-mt-20">
            <div className="relative z-10 container mx-auto px-6 py-32">
                <div className="hero-eyebrow">Contacto</div>
                <h2 className="font-elegant text-8xl md:text-7xl font-black tracking-tight mb-8 text-black">
                    ¿Construyendo algo <span className="italic text-primary">interesante?</span>
                </h2>
                <p className="mt-4 text-lg text-neutral-500 font-sans leading-relaxed transition-all duration-700 delay-150 ease-out">
                    Estoy explorando nuevos roles y proyectos selectos. Si buscas a alguien que entienda el negocio, diseñe la solución y mida si funcionó — hablemos.
                </p>
            </div>
        </section>
    )
}

export default Contact