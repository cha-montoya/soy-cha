import { motion } from "framer-motion"
import About3D from "../ui/About3D"

export default function About() {
  return (
    <section id="about" className="min-h-screen bg-slate-900 text-white marker:overflow-hidden flex items-center justify-center relative z-20 scroll-mt-20">
      <div className="relative z-10 h-full flex items-center container mx-auto px-6">
        {/* Contenido */}
        <div className="w-1/2 px-6 md:p-16 relative items-center">
          <div className="hero-eyebrow text-neutral-500">Sobre Mí</div>
          <h2 className="font-elegant text-6xl md:text-5xl font-black tracking-tight mb-8">
            Dos disciplinas.<br />Una sola visión.
          </h2>
          <p className="text-lg leading-relaxed">
            Empecé como diseñador gráfico en 2002 — construyendo identidades visuales, materiales de campaña y sistemas de marca. Pero siempre me intrigó la misma pregunta: ¿por qué algunas piezas funcionan y otras no?<br /><br />
            Esa curiosidad me llevó al marketing digital y, eventualmente, al mundo del marketing automation. Desde 2014 me especialicé en estrategia de crecimiento: segmentación de audiencias, modelos de datos, customer lifecycle, journey mapping y la implementación técnica de plataformas como Eloqua, Marketo, Salesforce Marketing Cloud, HubSpot, Responsys y Acoustic.<br /><br />
            Hoy trabajo en la intersección de ambos mundos: traigo pensamiento estratégico a los problemas de diseño, y criterio creativo a las decisiones de datos. He liderado equipos de tecnología y creatividad para marcas como 3M LATAM, Abbott, Christus Muguerza y KidZania, siempre con un ojo en los resultados y otro en la experiencia del usuario.<br /><br />
            Soy experto en email marketing y deliverability — uno de los campos más técnicos y subestimados del marketing digital.<br /><br />
            Estoy en búsqueda de un rol donde pueda liderar equipos y proyectos, sin perder el contacto con la ejecución.
          </p>
        </div>
        <div className="w-1/2 h-screen">
          <About3D />
        </div>
      </div>
    </section>
  )
}
