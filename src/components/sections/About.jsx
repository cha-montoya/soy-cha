import { motion } from "framer-motion"
import About3D from "../ui/About3D"

export default function About() {
  return (
    <section id="about" className="min-h-screen bg-slate-900 text-white marker:overflow-hidden flex items-center justify-center relative z-20 scroll-mt-20">
      <div className="relative z-10 h-full flex items-center container mx-auto px-6">
        {/* Contenido */}
        <div className="w-1/2 px-6 md:p-16 relative items-center">
          <h2 className="font-display text-6xl md:text-5xl font-black tracking-tight mb-8">
            Sobre Mí
          </h2>
          <p className="text-lg leading-relaxed">
            Soy diseñador web con enfoque editorial y experimental.
            Me interesa construir experiencias visuales que conecten
            narrativa, ritmo y tecnología, explorando transiciones,
            movimiento y profundidad en la web.
          </p>
        </div>
        <div className="w-1/2 h-screen">
          <About3D />
        </div>
      </div>
    </section>
  )
}
