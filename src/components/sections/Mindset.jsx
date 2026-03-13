import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Mindset() {
  
useEffect(() => {
  const ctx = gsap.context(() => {
    const cards = gsap.utils.toArray(".mindset-card")

    gsap.set(cards, {
      opacity: 0,
      scale: 0.9,
      filter: "blur(8px)"
    })

    gsap.set(cards[0], {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)"
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#mindset",
        scroller: "#scroll-container",
        start: "top top",
        end: "+=420%",
        scrub: 1.2,
        pin: ".mindset-pin",
        anticipatePin: 2
      }
    })

    cards.forEach((card, i) => {
      if (i === 0) return

      tl.to(cards[i - 1], {
        opacity: 0,
        scale: 1.12,
        filter: "blur(10px)",
        duration: 1.2,
        ease: "power2.out"
      })

      tl.fromTo(
        card,
        {
          opacity: 0,
          scale: 0.92,
          filter: "blur(6px)"
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out"
        },
        "<"
      )
    })
  })

  return () => ctx.revert()
}, [])

  return (
    <section id="mindset" className="relative w-full min-h-[600vh] bg-slate-600 text-white">

      <div className="relative z-10 h-full container mx-auto px-6 text-center">
        <div className="hero-eyebrow text-slate-200">Mindset</div>
        <h2 className="font-elegant text-8xl md:text-7xl font-black tracking-tight mb-8"><span className="italic text-primary">Cómo pienso</span> dentro de una campaña.</h2>
        <p className="text-lg leading-relaxed">No soy solo quien ejecuta ni solo quien analiza. Participo en las tres capas y eso cambia la calidad de lo que se construye.</p>
      </div>

      <div className="mindset-pin sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-5xl px-6 md:px-16 isolate">

          {/* Card 1 */}
          <div className="mindset-card absolute inset-0 flex items-center justify-center will-change-transform will-change-opacity">
            <div className="bg-neutral-950 p-12 w-full rounded-xl max-w-5xl">

              {/* Header */}
              <div className="mb-12">

                <div className="hero-eyebrow text-neutral-500">
                  <span className="text-primary">01.</span> Mentalidad
                </div>

                <h3 className="text-6xl font-black font-elegant mb-4">
                  Estratégica
                </h3>

                <p className="italic mb-8">
                  Antes de ejecutar, entender.
                </p>

                <div className="line-divider"></div>

                <p className="text-neutral-300 mt-8 text-lg max-w-2xl">
                  Todo parte de un modelo mental claro: quién es el usuario,
                  cómo se comporta y qué necesita en cada etapa. Sin esto,
                  la ejecución es ruido.
                </p>

              </div>


              {/* GRID 3x2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-estrategica">

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Modelado de datos
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Diseño de estructuras que soportan segmentación,
                    personalización y reporting.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Segmentación
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Definición de audiencias dinámicas basadas en
                    comportamiento y lifecycle.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Customer Journey
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Mapeo de interacciones para diseñar
                    comunicaciones relevantes.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Hyperpersonalización
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Uso de atributos implícitos y explícitos para
                    adaptar cada mensaje.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Arquitectura CRM
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Organización de datos y estructuras
                    para escalabilidad.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Reporting
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Definición de métricas relevantes
                    para evaluar performance.
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* Card 2 */}
          <div className="mindset-card absolute inset-0 flex items-center justify-center will-change-transform will-change-opacity">
            <div className="bg-neutral-950 p-12 w-full rounded-xl max-w-5xl">

              {/* Header */}
              <div className="mb-12">

                <div className="hero-eyebrow text-neutral-500">
                  <span className="text-primary">02.</span> Mentalidad
                </div>

                <h3 className="text-6xl font-black font-elegant mb-4">
                  Operativa
                </h3>

                <p className="italic mb-8">
                  La estrategia vale lo que se puede ejecutar.
                </p>

                <div className="line-divider"></div>

                <p className="text-neutral-300 mt-8 text-lg max-w-2xl">
                  Implemento lo que diseño. Conozco las plataformas por dentro:
                  sus límites, sus workarounds y cómo hacer que hablen entre ellas.
                </p>

              </div>


              {/* GRID 3x2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-operativa">

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Marketing Automation
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Flujos en Eloqua, Marketo, SFMC, HubSpot, Responsys
                    y Acoustic. Desde welcome series hasta recuperación
                    de carrito.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Implementación de campañas
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Setup completo: listas, segmentos, plantillas,
                    programación, A/B y QA. Cero lanzamientos sin
                    checklist.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Integraciones MarTech
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Conexión entre plataformas de automation, CRM,
                    ecommerce y analytics. APIs, webhooks y
                    conectores nativos.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Desarrollo de insumos
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Uso de atributos y contenido dinámico
                    para adaptar cada mensaje.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> IP Warm-up & Ramp-up
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Planes de calentamiento de IPs para nueva
                    infraestructura. Protejo la reputación del
                    dominio desde el día uno.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Integraciónes con IA
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Modelos de IA para personalización de
                    contenido, predicción de comportamiento
                    y optimización de tiempos de envío.
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* Card 3 */}
          <div className="mindset-card absolute inset-0 flex items-center justify-center will-change-transform will-change-opacity">
            <div className="bg-neutral-950 p-12 w-full rounded-xl max-w-5xl">

              {/* Header */}
              <div className="mb-12">

                <div className="hero-eyebrow text-neutral-500">
                  <span className="text-primary">03.</span> Mentalidad
                </div>

                <h3 className="text-6xl font-black font-elegant mb-4">
                  Analítica
                </h3>

                <p className="italic mb-8">
                  Los datos no mienten. Pero sí se malinterpretan.
                </p>

                <div className="line-divider"></div>

                <p className="text-neutral-300 mt-8 text-lg max-w-2xl">
                  Leo métricas en contexto, no en el vacío. Un buen open rate
                  puede esconder un problema de segmentación. Un CTR bajo puede
                  ser un problema de diseño.
                </p>

              </div>


              {/* GRID 3x2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-analitica">

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Creación de dashboards
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Reportes en Looker Studio, Tableau, Power BI
                    integrados con GA4 y plataformas de automation.
                    Reportes hechos para tomar decisiones.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Lectura de insights
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Open rate, CTR, CTOR, bounce, unsubscribe,
                    sessions, conversions, funnel drop-off,
                    LTV, CAC y churn.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Email Deliverability
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Reputación de dominio e IP, bounce logs,
                    listas de supresión y autenticación:
                    SPF, DKIM, DMARC.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Optimización de campañas
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Ciclos de mejora continua: ajuste de segmentos,
                    copy, timing, frecuencia y canales. Cada campaña
                    deja aprendizajes.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Identificación de errores
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Diagnóstico de problemas de deliverability,
                    caídas de engagement, anomalías en tracking y
                    errores de integración.
                  </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl">
                  <p className="text-white mb-3">
                    <span className="skill-dot"></span> Atribución de resultados
                  </p>
                  <div className="line-divider" />
                  <p className="text-sm mt-4 text-neutral-300">
                    Modelos de atribución para entender qué canal
                    contribuyó realmente a la conversión más allá
                    del last-click.
                  </p>
                </div>

              </div>

            </div>
          </div>
        
        </div>
      </div>
    </section>
  )
}
