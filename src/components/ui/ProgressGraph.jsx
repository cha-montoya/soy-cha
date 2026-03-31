import { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"
import { ArrowClockwiseIcon } from "@phosphor-icons/react"

// ─── THEME ────────────────────────────────────────────────────────────────────
const LIME      = "#9fc131"
const LIME_GLOW = "rgba(159,193,49,0.22)"
const LINE_CLR  = "#444"

// Card width is fixed; height is computed per-card from item count
const CW         = 148  // card width (px)
const ROW_H      = 18   // height per item row (px)
const CARD_PAD_V = 20   // total vertical padding inside card (px)
const MIN_CH     = 72   // minimum card height (px)

/** Compute card height for a given step based on its item count */
function cardHeight(step) {
  return Math.max(MIN_CH, step.items.length * ROW_H + CARD_PAD_V)
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: "estrategia", title: "Estrategia",  items: ["Entendimiento de Negocio", "Customer Journey", "Propuesta de Valor"],                                        accent: true  },
  { id: "datos",      title: "Datos",        items: ["Modelo de Datos", "Segmentación", "Arquitectura CRM"],                                                       accent: false },
  { id: "ejecucion",  title: "Ejecución",    items: ["Campañas", "Flujos de Automatización", "Lifecycle", "Eventos Trigger", "Personalización", "Omnicanalidad"], accent: true  },
  { id: "optim",      title: "Optimización", items: ["A/B Testing", "Deliverability", "Rendimiento"],                                                              accent: false },
  { id: "resultados", title: "Resultados",   items: ["Conversión", "Retención", "Growth"],                                                                        accent: true  },
]

const DEFAULT_POS = {
  estrategia: { x: 50, y: 11 },
  datos:      { x: 10, y: 50 },
  ejecucion:  { x: 50, y: 40 },
  optim:      { x: 50, y: 70 },
  resultados: { x: 90, y: 50 },
}

const EDGES = [
  ["estrategia", "ejecucion"],
  ["ejecucion",  "datos"     ],
  ["ejecucion",  "optim"     ],
  ["ejecucion",  "resultados"],
  ["optim",      "resultados"],
]

// ─── PATH HELPERS ─────────────────────────────────────────────────────────────

/**
 * Clamp line endpoint to the card edge using that card's actual dynamic height.
 */
function clampToEdge(cx, cy, tx, ty, step) {
  const hw = CW / 2 + 6
  const hh = cardHeight(step) / 2 + 6

  const dx = tx - cx
  const dy = ty - cy
  if (dx === 0 && dy === 0) return { x: cx, y: cy }

  const tX = Math.abs(dx) > 0 ? hw / Math.abs(dx) : Infinity
  const tY = Math.abs(dy) > 0 ? hh / Math.abs(dy) : Infinity
  const t  = Math.min(tX, tY)

  return { x: cx + dx * t, y: cy + dy * t }
}

/** Smooth cubic bezier between two edge points */
function cubicPath(x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1)
  const dy = Math.abs(y2 - y1)
  const cx = dx > dy ? dx * 0.5 : 0
  const cy = dy > dx ? dy * 0.5 : 0
  return `M ${x1} ${y1} C ${x1 + Math.sign(x2 - x1) * cx} ${y1 + Math.sign(y2 - y1) * cy}, ${x2 - Math.sign(x2 - x1) * cx} ${y2 - Math.sign(y2 - y1) * cy}, ${x2} ${y2}`
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function ProgressGraph() {
  const containerRef = useRef(null)
  const svgRef       = useRef(null)
  const dragRef      = useRef(null)
  const sizeRef      = useRef({ w: 520, h: 560 })

  const [pos,      setPos]      = useState({ ...DEFAULT_POS })
  const [activeId, setActiveId] = useState(null)
  const [svgKey,   setSvgKey]   = useState(0)

  const stepById = Object.fromEntries(STEPS.map(s => [s.id, s]))

  // ── keep sizeRef live ────────────────────────────────────────────────────────
  useEffect(() => {
    const ct = containerRef.current
    if (!ct) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      sizeRef.current = { w: width, h: height }
      setSvgKey(k => k + 1)
    })
    ro.observe(ct)
    sizeRef.current = { w: ct.offsetWidth, h: ct.offsetHeight }
    return () => ro.disconnect()
  }, [])

  // ── entrance animation ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const paths = svgRef.current?.querySelectorAll(".cp") ?? []
        paths.forEach(p => {
          const l = p.getTotalLength?.() ?? 200
          gsap.fromTo(p,
            { strokeDasharray: l, strokeDashoffset: l },
            { strokeDashoffset: 0, duration: 1.4, ease: "power2.out" }
          )
        })
        gsap.from(".cd", {
          scale: 0, opacity: 0, duration: 0.35,
          ease: "back.out(3)", stagger: 0.04, delay: 0.5,
          transformOrigin: "center center",
        })
        gsap.from(".cc", {
          y: 20, opacity: 0, duration: 0.5,
          ease: "power3.out", stagger: 0.08, delay: 0.7,
        })
      }, containerRef)
      return () => ctx.revert()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // ── drag ─────────────────────────────────────────────────────────────────────
  const onDown = useCallback((e, id) => {
    e.preventDefault()
    const ct = containerRef.current
    if (!ct) return
    ct.setPointerCapture(e.pointerId)
    dragRef.current = { id, sx: e.clientX, sy: e.clientY, op: { ...pos[id] } }
    setActiveId(id)
  }, [pos])

  const onMove = useCallback((e) => {
    if (!dragRef.current) return
    const { id, sx, sy, op } = dragRef.current
    const { w, h } = sizeRef.current
    const nx = Math.min(93, Math.max(7, op.x + ((e.clientX - sx) / w) * 100))
    const ny = Math.min(94, Math.max(6, op.y + ((e.clientY - sy) / h) * 100))
    setPos(prev => ({ ...prev, [id]: { x: nx, y: ny } }))
    setSvgKey(k => k + 1)
  }, [])

  const onUp = useCallback(() => {
    dragRef.current = null
    setActiveId(null)
  }, [])

  // ── px helper ────────────────────────────────────────────────────────────────
  const toPx = useCallback((id) => {
    const { w, h } = sizeRef.current
    return { x: (pos[id].x / 100) * w, y: (pos[id].y / 100) * h }
  }, [pos])

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: 600, touchAction: "none", userSelect: "none" }}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >

      {/* ── SVG layer ─────────────────────────────────────────────────────────── */}
      <svg
        key={svgKey}
        ref={svgRef}
        className="absolute inset-0 pointer-events-none"
        width="100%" height="100%"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="lime-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {EDGES.map(([a, b]) => {
          const A  = toPx(a)
          const B  = toPx(b)
          const eA = clampToEdge(A.x, A.y, B.x, B.y, stepById[a])
          const eB = clampToEdge(B.x, B.y, A.x, A.y, stepById[b])
          const isAccent = stepById[a]?.accent || stepById[b]?.accent

          return (
            <g key={`edge-${a}-${b}`}>
              <path
                className="cp"
                d={cubicPath(eA.x, eA.y, eB.x, eB.y)}
                stroke={isAccent ? LIME : LINE_CLR}
                strokeWidth={isAccent ? 1.5 : 1.2}
                fill="none"
                strokeLinecap="round"
                opacity={isAccent ? 0.7 : 0.5}
              />
              <circle className="cd" cx={eA.x} cy={eA.y} r={3.5}
                fill={isAccent ? LIME : "#2a2a2a"}
                stroke={isAccent ? LIME : "#666"} strokeWidth="1.2" />
              <circle className="cd" cx={eB.x} cy={eB.y} r={3.5}
                fill={isAccent ? LIME : "#2a2a2a"}
                stroke={isAccent ? LIME : "#666"} strokeWidth="1.2" />
            </g>
          )
        })}

        {/* Dashed ring around accent nodes */}
        {STEPS.filter(s => s.accent).map(({ id }) => {
          const p = toPx(id)
          return (
            <circle key={`ring-${id}`}
              cx={p.x} cy={p.y} r={56}
              fill="none" stroke={LIME} strokeWidth="0.6"
              opacity="0.12" strokeDasharray="4 6"
            />
          )
        })}
      </svg>

      {/* ── Draggable cards ───────────────────────────────────────────────────── */}
      {STEPS.map(step => {
        const p  = pos[step.id]
        const on = activeId === step.id
        const ch = cardHeight(step)

        return (
          <div
            key={step.id}
            className="cc absolute"
            style={{
              left:       `${p.x}%`,
              top:        `${p.y}%`,
              transform:  "translate(-50%, -50%)",
              width:      `${CW}px`,
              cursor:     on ? "grabbing" : "grab",
              zIndex:     on ? 50 : 10,
              willChange: "left, top",
              transition: on ? "none" : "left 0.3s cubic-bezier(.22,.68,0,1.2), top 0.3s cubic-bezier(.22,.68,0,1.2)",
            }}
            onPointerDown={e => onDown(e, step.id)}
          >
            {/* Title */}
            <p style={{
              fontSize:      14,
              fontWeight:    900,
              fontFamily:    "Red Hat Display, sans-serif",
              textTransform: "uppercase",
              marginBottom:  8,
              textAlign:     "center",
              color:         step.accent ? LIME : "#777",
              lineHeight:    1,
            }}>
              {step.title}
            </p>

            {/* Card body — height grows with content */}
            <div style={{
              height:       `${ch}px`,
              borderRadius: 10,
              padding:      "15px",
              display:      "flex",
              alignItems:   "center",
              background:   step.accent ? LIME     : "#101010",
              border:       step.accent
                ? `1.5px solid ${LIME}`
                : `1.5px solid ${on ? "#3a3a3a" : "#222"}`,
              color:        step.accent ? "#FFFFFF" : "#FFFFFF",
              boxShadow: on
                ? step.accent
                  ? `0 16px 40px rgba(159,193,49,0.5), 0 0 0 2px ${LIME}`
                  : "0 16px 40px rgba(0,0,0,0.7)"
                : step.accent
                  ? `0 4px 24px ${LIME_GLOW}`
                  : "0 2px 12px rgba(0,0,0,0.45)",
              transform:  on
                ? step.accent ? "scale(1.06) rotate(-0.5deg)" : "scale(1.06) rotate(0.5deg)"
                : "scale(1)",
              transition: "transform 0.14s ease, box-shadow 0.14s ease",
            }}>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, width: "100%" }}>
                {step.items.map(item => (
                  <li key={item} style={{
                    fontSize:   12,
                    lineHeight: `${ROW_H}px`,
                    fontFamily: "Figtree, sans-serif",
                    fontWeight: step.accent ? 700 : 400,
                  }}>
                    ‣ {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}

      {/* ── Re-arrange button ─────────────────────────────────────────────────── */}
      <button
        onClick={() => { setPos({ ...DEFAULT_POS }); setSvgKey(k => k + 1) }}
        style={{
          position:  "absolute", bottom: 10, right: 10, zIndex: 100,
          background: LIME, color: "#FFFFFF", border: "none",
          padding: "10px 13px",
          fontSize: 14, letterSpacing: "0.2rem", fontFamily: "Monospace, sans-serif",
          textTransform: "uppercase", cursor: "pointer",
          boxShadow: `0 0 20px ${LIME_GLOW}`,
          display: "flex", alignItems: "center", gap: 5,
          transition: "transform 0.14s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06)" }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"    }}
      >
        // Organizar <ArrowClockwiseIcon />
      </button>

    </div>
  )
}