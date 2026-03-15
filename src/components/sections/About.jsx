import { motion } from "framer-motion"
import AboutTicker from "../ui/AboutTicker"

export default function About() {
  return (
    <section
      id="about"
      className="relative min-h-screen bg-slate-900 text-white overflow-hidden flex items-center justify-center z-20 scroll-mt-20"
    >
      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center container mx-auto px-6">

        {/* ===== TEXT ===== */}
        <div className="w-full lg:w-1/2 px-6 md:px-16 py-24 lg:py-16">
          <div className="hero-eyebrow text-neutral-400">
            Sobre Mí
          </div>
          <h2 className="font-elegant text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-8">
            Dos disciplinas.<br />Una sola <span className="italic text-primary">visión.</span>
          </h2>
          <p className="mt-8 text-sm md:text-base lg:text-lg leading-relaxed">
            Empecé como diseñador gráfico en 2002 construyendo identidades visuales, materiales de campaña y sistemas de marca. Pero siempre me intrigó la misma pregunta: ¿por qué algunas piezas funcionan y otras no?<br /><br />
            Esa curiosidad me llevó al marketing digital y, eventualmente, al mundo del marketing automation. Desde 2014 me especialicé en estrategia de crecimiento: segmentación de audiencias, modelos de datos, customer lifecycle, journey mapping y la implementación técnica de plataformas como Eloqua, Marketo, Salesforce Marketing Cloud, HubSpot, Responsys y Acoustic.<br /><br />
            Hoy trabajo en la intersección de ambos mundos: traigo pensamiento estratégico a los problemas de diseño, y criterio creativo a las decisiones de datos. He liderado equipos de tecnología y creatividad para marcas como <span className="font-bold">3M LATAM, Abbott, Christus Muguerza y KidZania,</span> siempre con un ojo en los resultados y otro en la experiencia del usuario.<br /><br />
            Soy experto en email marketing y deliverability uno de los campos más técnicos y subestimados del marketing digital.<br /><br />
            Estoy en búsqueda de un rol donde pueda liderar equipos y proyectos, sin perder el contacto con la ejecución.
          </p>
        </div>

        {/* ===== TICKER ===== */}
        <div className="w-full lg:w-1/2 h-64 lg:h-screen flex items-center justify-center pb-16 lg:pb-0">
          <AboutTicker />
        </div>

      </div>
    </section>
  )
}