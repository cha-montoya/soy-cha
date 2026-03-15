import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const cards = [
  {
    num: "01",
    title: "Estratégica",
    subtitle: "Antes de ejecutar, entender.",
    desc: "Todo parte de un modelo mental claro: quién es el usuario, cómo se comporta y qué necesita en cada etapa. Sin esto, la ejecución es ruido.",
    skills: [
      ["Modelado de datos", "Diseño de estructuras que soportan segmentación, personalización y reporting."],
      ["Segmentación", "Definición de audiencias dinámicas basadas en comportamiento y lifecycle."],
      ["Customer Journey", "Mapeo de interacciones para diseñar comunicaciones relevantes."],
      ["Hyperpersonalización", "Uso de atributos implícitos y explícitos para adaptar cada mensaje."],
      ["Arquitectura CRM", "Organización de datos y estructuras para escalabilidad."],
      ["Reporting", "Definición de métricas relevantes para evaluar performance."],
    ]
  },
  {
    num: "02",
    title: "Operativa",
    subtitle: "La estrategia vale lo que se puede ejecutar.",
    desc: "Implemento lo que diseño. Conozco las plataformas por dentro: sus límites, sus workarounds y cómo hacer que hablen entre ellas.",
    skills: [
      ["Marketing Automation", "Flujos en Eloqua, Marketo, SFMC, HubSpot, Responsys y Acoustic. Desde welcome series hasta recuperación de carrito."],
      ["Implementación de campañas", "Setup completo: listas, segmentos, plantillas, programación, A/B y QA. Cero lanzamientos sin checklist."],
      ["Integraciones MarTech", "Conexión entre plataformas de automation, CRM, ecommerce y analytics. APIs, webhooks y conectores nativos."],
      ["Desarrollo de insumos", "Uso de atributos y contenido dinámico para adaptar cada mensaje."],
      ["IP Warm-up & Ramp-up", "Planes de calentamiento de IPs para nueva infraestructura. Protejo la reputación del dominio desde el día uno."],
      ["Integraciones con IA", "Modelos de IA para personalización de contenido, predicción de comportamiento y optimización de tiempos de envío."],
    ]
  },
  {
    num: "03",
    title: "Analítica",
    subtitle: "Los datos no mienten. Pero sí se malinterpretan.",
    desc: "Leo métricas en contexto, no en el vacío. Un buen open rate puede esconder un problema de segmentación. Un CTR bajo puede ser un problema de diseño.",
    skills: [
      ["Creación de dashboards", "Reportes en Looker Studio, Tableau, Power BI integrados con GA4 y plataformas de automation."],
      ["Lectura de insights", "Open rate, CTR, CTOR, bounce, unsubscribe, sessions, conversions, funnel drop-off, LTV, CAC y churn."],
      ["Email Deliverability", "Reputación de dominio e IP, bounce logs, listas de supresión y autenticación: SPF, DKIM, DMARC."],
      ["Optimización de campañas", "Ciclos de mejora continua: ajuste de segmentos, copy, timing, frecuencia y canales."],
      ["Identificación de errores", "Diagnóstico de problemas de deliverability, caídas de engagement, anomalías en tracking y errores de integración."],
      ["Atribución de resultados", "Modelos de atribución para entender qué canal contribuyó realmente a la conversión más allá del last-click."],
    ]
  }
]

export default function MindsetCards() {

  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {

    const timer = setTimeout(() => {

      const totalCards = cards.length

      const ctx = gsap.context(() => {

        gsap.to(trackRef.current, {
          x: () => -(trackRef.current.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${trackRef.current.scrollWidth - window.innerWidth}`,
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (totalCards - 1),
              duration: 0.5,
              delay: 0,
              ease: "power2.inOut"
            }
          }
        })

      }, sectionRef)

      ScrollTrigger.refresh()

      return () => ctx.revert()

    }, 100)

    return () => clearTimeout(timer)

  }, [])

  return (
    <section
      ref={sectionRef}
      id="mindset-cards"
      className="relative bg-slate-600 text-white overflow-hidden"
      style={{ height: "100vh" }}
    >

      <div
        ref={trackRef}
        className="flex h-full"
        style={{ width: `${cards.length * 100}vw` }}
      >

        {cards.map((card) => (
          <div
            key={card.num}
            className="mindset-card flex items-center justify-center px-6"
            style={{ width: "100vw", height: "100vh", flexShrink: 0 }}
          >

            <div className="bg-neutral-950 p-12 rounded-xl w-full max-w-5xl">

              <div className="mb-10">
                <div className="hero-eyebrow text-neutral-500">
                  <span className="text-primary">{card.num}.</span> Mentalidad
                </div>
                <h3 className="text-6xl font-black font-elegant mb-4">{card.title}</h3>
                <p className="italic mb-8">{card.subtitle}</p>
                <div className="line-divider"></div>
                <p className="text-neutral-300 mt-8 text-lg max-w-2xl">{card.desc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {card.skills.map(([title, desc]) => (
                  <div key={title} className="bg-neutral-900 p-6 rounded-xl">
                    <p className="text-white mb-3">
                      <span className="skill-dot"></span> {title}
                    </p>
                    <div className="line-divider" />
                    <p className="text-sm mt-4 text-neutral-300">{desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        ))}

      </div>

    </section>
  )
}