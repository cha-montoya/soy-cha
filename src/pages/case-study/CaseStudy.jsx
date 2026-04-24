import { useEffect, useRef, useState, useCallback } from 'react'

import HeaderCase from "../../components/layout/HeaderCase"
import FooterLanding from "../../components/layout/FooterLanding"

// ICONS
import {
    ChartLineIcon,
    ChartBarIcon,
    WarningDiamondIcon,
    DatabaseIcon,
    EnvelopeIcon,
    NotificationIcon,
    WhatsappLogoIcon,
    TargetIcon,
    LightningIcon,
    ChartLineUpIcon,
    ClockIcon,
    LineSegmentIcon,
    XCircleIcon,
    StrategyIcon,
    SparkleIcon,
    ArrowClockwiseIcon
} from "@phosphor-icons/react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
    bg:       '#09090e',
    surface:  '#0f0f17',
    surface2: '#14141e',
    border:   'rgba(255,255,255,0.07)',
    border2:  'rgba(255,255,255,0.04)',
    accent:   '#7B5EA7',
    accent2:  '#C084FC',
    accent3:  '#38BDF8',
    green:    '#34D399',
    red:      '#F87171',
    gold:     '#F59E0B',
    pink:     '#F472B6',
    muted:    '#6a6a8a',
    muted2:   '#9090b0',
}

// ─── GLOBAL STYLES (injected once) ────────────────────────────────────────────
const GLOBAL_CSS = `
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
    .e-dot { animation: pulse 2s infinite; }
    .reveal { opacity:0; transform:translateY(22px); transition: opacity .65s ease, transform .65s ease; }
    .reveal.vis { opacity:1; transform:none; }
    .rd1{transition-delay:.08s} .rd2{transition-delay:.16s} .rd3{transition-delay:.24s}
    .seg-card:hover { transform:translateY(-5px); border-color:rgba(192,132,252,.35) !important; }
    .graph-node { touch-action:none; }
    .graph-node:hover { border-color:rgba(192,132,252,.45) !important; box-shadow:0 0 20px rgba(123,94,167,.18); }
    .graph-node.dragging { cursor:grabbing !important; z-index:50 !important; transform:scale(1.04); box-shadow:0 8px 32px rgba(0,0,0,.5); transition: border-color .18s, box-shadow .18s !important; }
    .reset-btn:hover { background:rgba(192,132,252,.22) !important; transform:scale(1.04); }
    .ai-tooltip { position:relative; display:inline; cursor:help; }
    .ai-tooltip .tip { display:none; position:absolute; z-index:500; bottom:calc(100% + 10px); left:50%; transform:translateX(-50%); width:290px; background:#1c1c2c; border-radius:10px; padding:13px 15px; font-size:12.5px; line-height:1.6; font-style:normal; font-weight:300; pointer-events:none; box-shadow:0 18px 36px rgba(0,0,0,.65); }
    .ai-tooltip .tip::after { content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:5px solid transparent; }
    .ai-tooltip:hover .tip { display:block; }
    .ai-tooltip.tw .tip { border:1px solid rgba(245,158,11,.4); color:#9090b0; }
    .ai-tooltip.tw .tip::after { border-top-color:rgba(245,158,11,.4); }
    .ai-tooltip.tw .tip strong { color:#F59E0B; }
    .ai-tooltip.tg .tip { border:1px solid rgba(52,211,153,.4); color:#9090b0; }
    .ai-tooltip.tg .tip::after { border-top-color:rgba(52,211,153,.4); }
    .ai-tooltip.tg .tip strong { color:#34D399; }
    .ai-tooltip.tb .tip { border:1px solid rgba(56,189,248,.4); color:#9090b0; }
    .ai-tooltip.tb .tip::after { border-top-color:rgba(56,189,248,.4); }
    .ai-tooltip.tb .tip strong { color:#38BDF8; }
    code { font-family:monospace; font-size:11px; color:#C084FC; background:rgba(192,132,252,.1); padding:1px 5px; border-radius:3px; }
    .hero-content-anim { animation: fadeUp .9s ease both; }
    @media (max-width: 640px) {
        .ai-tooltip .tip { width: 220px; font-size: 11.5px; }
        .seg-card:hover { transform: none; }
    }
    @media print {
        @page { margin: 0; size: A4; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        nav, header, .reset-btn, .no-print { display: none !important; }
        section { break-inside: avoid; page-break-inside: avoid; }
        .animate-bounce { animation: none !important; }
        .reveal { opacity: 1 !important; transform: none !important; }
    }
    `

// ─── GRAPH DATA ────────────────────────────────────────────────────────────────
const NODE_W = 170

const NODE_DEFS = [
    {
        id:'seg1',
        icon: <DatabaseIcon size={14} />,
        label:'Segmento 1',
        title:'Alta intención',
        sub:'Email clicked 14d · visitó pricing · sin add-on',
        px:3,
        py:8,
        variant:'seg'
    },
    {
        id:'seg2',
        icon: <DatabaseIcon size={14} />,
        label:'Segmento 2',
        title:'Subutilización',
        sub:'Activo 30d · bajo depth · excluye Segmento 1',
        px:3,
        py:38,
        variant:'seg'
    },
    {
        id:'seg3',
        icon: <DatabaseIcon size={14} />,
        label:'Segmento 3',
        title:'Riesgo desinterés',
        sub:'15–45d sin actividad · excluye Segmento 1/2',
        px:3,
        py:67,
        variant:'seg'
    },
    {
        id:'tp1',
        icon: <EnvelopeIcon size={14} />,
        label:'TP 1 — Email',
        title:'Activación',
        sub:'Contenido dinámico por segmento · "Sácale más provecho"',
        px:22,
        py:8,
        variant:'email'
    },
    {
        id:'tp2',
        icon: <NotificationIcon size={14} />,
        label:'TP 2 — In-app',
        title:'Descubrimiento',
        sub:'Tooltip no intrusivo · "¿Ya probaste esta función?"',
        px:41,
        py:8,
        variant:'inapp'
    },
    {
        id:'tp3',
        icon: <EnvelopeIcon size={14} />,
        label:'TP 3 — Enriquecimiento',
        title:'Email preferencias',
        sub:'CTA multi-opción · cada click = propiedad HubSpot',
        px:60,
        py:8,
        variant:'email'
    },
    {
        id:'props',
        icon: <LightningIcon size={14} />,
        label:'HubSpot Props',
        title:'Propiedades custom',
        sub:'interes_reportes · interes_automatizacion · interes_formacion',
        px:62,
        py:55,
        variant:'props'
    },
    {
        id:'val',
        icon: <CheckIcon size={14} />,
        label:'Validación',
        title:'¿Alto engagement + opt-in?',
        sub:'≥3 clicks 30d · WhatsApp · opt-in LGPD/GDPR',
        px:77,
        py:8,
        variant:'check'
    },
    {
        id:'wa',
        icon: <WhatsappLogoIcon size={14} />,
        label:'TP 4a — WhatsApp',
        title:'Push selectivo',
        sub:'Solo si validación = sí · API partner · contextual',
        px:88,
        py:3,
        variant:'wa'
    },
    {
        id:'offer',
        icon: <EnvelopeIcon size={14} />,
        label:'TP 4b — Email',
        title:'Oferta',
        sub:'Trial · Demo · basado en propiedad TP 3',
        px:88,
        py:47,
        variant:'email'
    },
    {
        id:'conv',
        icon: <NotificationIcon size={14} />,
        label:'TP 5/6',
        title:'Conversión',
        sub:'In-app CTA directo · trigger por comportamiento',
        px:88,
        py:25,
        variant:'inapp'
    },
]

    const EDGE_DEFS = [
    { a:'seg1',  b:'tp1',   color:'rgba(56,189,248,.55)',  w:1.5, dash:'5 3' },
    { a:'seg2',  b:'tp1',   color:'rgba(52,211,153,.4)',   w:1.5, dash:'5 3' },
    { a:'seg3',  b:'tp1',   color:'rgba(248,113,113,.3)',  w:1.5, dash:'5 3' },
    { a:'tp1',   b:'tp2',   color:'rgba(255,255,255,.22)', w:1.5, dash:''    },
    { a:'tp2',   b:'tp3',   color:'rgba(255,255,255,.22)', w:1.5, dash:''    },
    { a:'tp3',   b:'val',   color:'rgba(255,255,255,.22)', w:1.5, dash:''    },
    { a:'tp3',   b:'props', color:'rgba(245,158,11,.38)',  w:1.5, dash:'4 3' },
    { a:'val',   b:'wa',    color:'rgba(134,239,172,.5)',  w:1.5, dash:'4 3', label:'✓ opt-in'     },
    { a:'val',   b:'offer', color:'rgba(244,114,182,.45)', w:1.5, dash:'4 3', label:'x sin opt-in' },
    { a:'wa',    b:'conv',  color:'rgba(192,132,252,.6)',  w:2,   dash:''    },
    { a:'offer', b:'conv',  color:'rgba(244,114,182,.4)',  w:1.5, dash:'4 3' },
    { a:'conv',  b:'seg1',  color:'rgba(192,132,252,.14)', w:1.5, dash:'6 4', label:'feedback loop' },
    ]

    const NODE_STYLES = {
    seg:   { border:'rgba(167,139,250,.22)', labelColor:'#A78BFA', bg: T.surface2 },
    email: { border:'rgba(56,189,248,.22)',  labelColor: T.accent3, bg: T.surface2 },
    inapp: { border:'rgba(52,211,153,.22)',  labelColor: T.green,   bg: T.surface2 },
    data:  { border:'rgba(252,211,77,.22)',  labelColor: T.gold,    bg: T.surface2 },
    props: { border:'rgba(252,211,77,.22)',  labelColor: T.gold,    bg: T.surface2, dashed: true },
    wa:    { border:'rgba(134,239,172,.22)', labelColor:'#86EFAC',  bg: T.surface2 },
    offer: { border:'rgba(244,114,182,.22)', labelColor: T.pink,    bg: T.surface2 },
    conv:  { border:'rgba(192,132,252,.45)', labelColor: T.accent2, bg:'rgba(123,94,167,.1)' },
    check: { border:'rgba(248,113,113,.28)', labelColor: T.red,     bg:'rgba(248,113,113,.04)' },
    }

    // ─── HELPERS ─────────────────────────────────────────────────────────────────
    function cubicPath(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1)
    const bx = dx > dy ? dx * 0.48 : 0
    const by = dy > dx ? dy * 0.48 : 0
    const sx = Math.sign(x2 - x1), sy = Math.sign(y2 - y1)
    return `M ${x1} ${y1} C ${x1+sx*bx} ${y1+sy*by}, ${x2-sx*bx} ${y2-sy*by}, ${x2} ${y2}`
    }

    function clampEdge(cx, cy, tx, ty, w, h) {
    const hw = w / 2 + 6, hh = h / 2 + 6
    const dx = tx - cx, dy = ty - cy
    if (!dx && !dy) return { x: cx, y: cy }
    const tX = Math.abs(dx) > 0 ? hw / Math.abs(dx) : Infinity
    const tY = Math.abs(dy) > 0 ? hh / Math.abs(dy) : Infinity
    const t  = Math.min(tX, tY)
    return { x: cx + dx * t, y: cy + dy * t }
    }

    function markerUrl(color) {
    if (color.includes('56,189,248'))  return 'url(#mbl)'
    if (color.includes('192,132,252') && !color.includes('.14')) return 'url(#mpr)'
    if (color.includes('52,211,153'))  return 'url(#mgr)'
    if (color.includes('245,158,11'))  return 'url(#mgo)'
    if (color.includes('244,114,182')) return 'url(#mpk)'
    if (color.includes('.14'))         return 'url(#mfa)'
    return 'url(#mw)'
    }

    // ─── TOOLTIP ──────────────────────────────────────────────────────────────────
    function Tip({ type = 'tw', mark, children }) {
    const markStyles = {
        tw: { bg:'rgba(245,158,11,.12)', border:'1px solid rgba(245,158,11,.4)', color: T.gold },
        tg: { bg:'rgba(52,211,153,.1)',  border:'1px solid rgba(52,211,153,.4)',  color: T.green },
        tb: { bg:'rgba(56,189,248,.1)',  border:'1px solid rgba(56,189,248,.4)',  color: T.accent3 },
    }
    const s = markStyles[type]
    return (
        <span className={`ai-tooltip ${type}`} style={{ position:'relative', display:'inline', cursor:'help' }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, borderRadius:4, padding:'1px 7px', fontSize:11, fontWeight:500, whiteSpace:'nowrap', transition:'background .2s', verticalAlign:'middle', margin:'0 3px', fontStyle:'normal', fontFamily:'"DM Sans",sans-serif', ...s }}>
            {mark}
        </span>
        <div className="tip">{children}</div>
        </span>
    )
    }

    // ─── DRAGGABLE GRAPH ──────────────────────────────────────────────────────────
    function LifecycleGraph() {
    const boardRef = useRef(null)
    const svgRef   = useRef(null)

    // All mutable state lives in refs — zero re-renders during drag
    const posRef      = useRef({})   // { id: { x, y } }
    const sizeRef     = useRef({ w: 800, h: 580 })
    const dragRef     = useRef(null) // { id, pointerId }
    const nodeRefs    = useRef({})   // { id: HTMLElement }
    const edgeRefs    = useRef({})   // { edgeIndex: { path, dotA, dotB, label? } }
    const bootedRef   = useRef(false)
    const [resetKey, setResetKey] = useState(0) // triggers re-render only on reset

    // ── helpers (stable — never change) ──────────────────────────────────────────
    const computeDefaultPos = () => {
        const { w, h } = sizeRef.current
        NODE_DEFS.forEach(def => {
        posRef.current[def.id] = {
            x: Math.max(NODE_W/2 + 4, Math.min(w - NODE_W/2 - 4, (def.px/100)*w + NODE_W*0.25)),
            y: Math.max(24,            Math.min(h - 36,            (def.py/100)*h + 40)),
        }
        })
    }

    const placeNode = (id) => {
        const el = nodeRefs.current[id]
        if (!el) return
        const p = posRef.current[id]
        if (!p) return
        el.style.left = `${p.x - el.offsetWidth  / 2}px`
        el.style.top  = `${p.y - el.offsetHeight / 2}px`
    }

    const renderEdges = () => {
        EDGE_DEFS.forEach((def, i) => {
        const refs = edgeRefs.current[i]
        if (!refs) return
        const nA = nodeRefs.current[def.a], nB = nodeRefs.current[def.b]
        if (!nA || !nB) return
        const cA = posRef.current[def.a], cB = posRef.current[def.b]
        if (!cA || !cB) return
        const eA = clampEdge(cA.x, cA.y, cB.x, cB.y, nA.offsetWidth||NODE_W, nA.offsetHeight||80)
        const eB = clampEdge(cB.x, cB.y, cA.x, cA.y, nB.offsetWidth||NODE_W, nB.offsetHeight||80)
        refs.path?.setAttribute('d', cubicPath(eA.x, eA.y, eB.x, eB.y))
        if (refs.dotA) { refs.dotA.setAttribute('cx', eA.x); refs.dotA.setAttribute('cy', eA.y) }
        if (refs.dotB) { refs.dotB.setAttribute('cx', eB.x); refs.dotB.setAttribute('cy', eB.y) }
        if (refs.label) {
            refs.label.setAttribute('x', (eA.x + eB.x) / 2)
            refs.label.setAttribute('y', Math.min(eA.y, eB.y) - 10)
        }
        })
    }

    const animateEntrance = () => {
        EDGE_DEFS.forEach((_, i) => {
        const path = edgeRefs.current[i]?.path
        if (!path) return
        const len = path.getTotalLength?.() ?? 300
        path.style.strokeDasharray  = len
        path.style.strokeDashoffset = len
        path.style.transition = `stroke-dashoffset 1.2s ease ${0.08 + i * 0.07}s`
        requestAnimationFrame(() => requestAnimationFrame(() => {
            path.style.strokeDashoffset = 0
        }))
        })
        NODE_DEFS.forEach((def, i) => {
        const el = nodeRefs.current[def.id]
        if (!el) return
        el.style.opacity   = '0'
        el.style.transform = 'scale(0.85)'
        el.style.transition = `opacity .4s ease ${0.4 + i*0.06}s, transform .4s cubic-bezier(.34,1.56,.64,1) ${0.4 + i*0.06}s`
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.style.opacity   = '1'
            el.style.transform = 'scale(1)'
        }))
        })
    }

    const boot = () => {
        if (bootedRef.current) return
        bootedRef.current = true
        sizeRef.current = { w: boardRef.current.offsetWidth, h: boardRef.current.offsetHeight }
        computeDefaultPos()
        requestAnimationFrame(() => {
        NODE_DEFS.forEach(d => placeNode(d.id))
        renderEdges()
        animateEntrance()
        })
    }

    // ── mount: observers + drag listeners on board ────────────────────────────────
    useEffect(() => {
        const board = boardRef.current
        if (!board) return

        // Size tracking
        const ro = new ResizeObserver(([entry]) => {
        sizeRef.current = { w: entry.contentRect.width, h: entry.contentRect.height }
        if (bootedRef.current) renderEdges()
        })
        ro.observe(board)

        // Lazy boot on scroll into view
        const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { boot(); io.disconnect() }
        }, { threshold: 0.1 })
        io.observe(board)

        // ── board-level pointer events (captures all nodes) ────────────────────────
        const onBoardDown = (e) => {
        // Walk up from target to find a graph-node
        let target = e.target
        while (target && target !== board) {
            if (target.dataset.nodeId) break
            target = target.parentElement
        }
        if (!target || !target.dataset.nodeId) return
        const id = target.dataset.nodeId
        e.preventDefault()
        board.setPointerCapture(e.pointerId)
        target.classList.add('dragging')
        dragRef.current = { id, pointerId: e.pointerId }
        }

        const onBoardMove = (e) => {
        if (!dragRef.current) return
        const { id } = dragRef.current
        const rect = board.getBoundingClientRect()
        const bw = board.offsetWidth, bh = board.offsetHeight
        posRef.current[id] = {
            x: Math.max(NODE_W/2 + 4, Math.min(bw - NODE_W/2 - 4, e.clientX - rect.left)),
            y: Math.max(24,            Math.min(bh - 36,            e.clientY - rect.top)),
        }
        placeNode(id)
        renderEdges()
        }

        const onBoardUp = () => {
        if (!dragRef.current) return
        const el = nodeRefs.current[dragRef.current.id]
        el?.classList.remove('dragging')
        dragRef.current = null
        }

        board.addEventListener('pointerdown',   onBoardDown)
        board.addEventListener('pointermove',   onBoardMove)
        board.addEventListener('pointerup',     onBoardUp)
        board.addEventListener('pointercancel', onBoardUp)

        return () => {
        ro.disconnect()
        io.disconnect()
        board.removeEventListener('pointerdown',   onBoardDown)
        board.removeEventListener('pointermove',   onBoardMove)
        board.removeEventListener('pointerup',     onBoardUp)
        board.removeEventListener('pointercancel', onBoardUp)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // After reset re-render, re-place all nodes
    useEffect(() => {
        if (!bootedRef.current) return
        NODE_DEFS.forEach(d => placeNode(d.id))
        renderEdges()
    }, [resetKey]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleReset = () => {
        computeDefaultPos()
        setResetKey(k => k + 1)
    }

    // ── edge ref callback (stable per index) ──────────────────────────────────────
    const edgeRef = (i, key) => (el) => {
        if (!edgeRefs.current[i]) edgeRefs.current[i] = {}
        edgeRefs.current[i][key] = el
    }

    return (
        <div
        ref={boardRef}
        className="relative overflow-hidden"
        style={{
        height: 'clamp(380px, 60vw, 580px)',
            background: T.bg,
            backgroundImage: 'radial-gradient(rgba(255,255,255,.032) 1px,transparent 1px)',
            backgroundSize: '22px 22px',
            borderRadius: '0 0 20px 20px',
            touchAction: 'none',
            userSelect: 'none',
        }}
        >
        {/* ── SVG edges ── */}
        <svg
            ref={svgRef}
            className="absolute inset-0 pointer-events-none"
            style={{ width:'100%', height:'100%', overflow:'visible' }}
        >
            <defs>
            {[
                ['mw',  'rgba(255,255,255,.25)'],
                ['mbl', 'rgba(56,189,248,.7)'],
                ['mpr', 'rgba(192,132,252,.7)'],
                ['mgr', 'rgba(52,211,153,.7)'],
                ['mgo', 'rgba(245,158,11,.7)'],
                ['mpk', 'rgba(244,114,182,.6)'],
                ['mfa', 'rgba(192,132,252,.2)'],
            ].map(([id, fill]) => (
                <marker key={id} id={id} markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill={fill}/>
                </marker>
            ))}
            </defs>

            {EDGE_DEFS.map((def, i) => {
            const dotFill = def.color.replace(/[\d.]+\)$/, '0.7)')
            return (
                <g key={i}>
                <path
                    ref={edgeRef(i, 'path')}
                    fill="none"
                    stroke={def.color}
                    strokeWidth={def.w}
                    strokeLinecap="round"
                    strokeDasharray={def.dash || undefined}
                    markerEnd={markerUrl(def.color)}
                />
                <circle ref={edgeRef(i, 'dotA')} r={4} fill={dotFill} stroke="rgba(9,9,14,.8)" strokeWidth="1.5"/>
                <circle ref={edgeRef(i, 'dotB')} r={4} fill={dotFill} stroke="rgba(9,9,14,.8)" strokeWidth="1.5"/>
                {def.label && (
                    <text
                    ref={edgeRef(i, 'label')}
                    textAnchor="middle" fontSize="8"
                    fontFamily="DM Sans,sans-serif" fontStyle="italic"
                    fill={def.color.replace(/[\d.]+\)$/, '0.55)')}
                    />
                )}
                </g>
            )
            })}
        </svg>

        {/* ── Draggable nodes ── */}
        {NODE_DEFS.map(def => {
            const s = NODE_STYLES[def.variant]
            return (
            <div
                key={def.id}
                ref={el => { nodeRefs.current[def.id] = el }}
                data-node-id={def.id}
                className="graph-node"
                style={{
                position: 'absolute',
                width: NODE_W,
                background: s.bg,
                border: `1px ${s.dashed ? 'dashed' : 'solid'} ${s.border}`,
                borderRadius: 12,
                padding: '13px 17px',
                cursor: 'grab',
                transition: 'border-color .18s, box-shadow .18s, transform .12s',
                willChange: 'left, top',
                zIndex: def.variant === 'seg' || def.variant === 'props' ? 4 : 5,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '.14em',
                        textTransform: 'uppercase',
                        marginBottom: 4,
                        color: s.labelColor,
                        pointerEvents: 'none'
                    }}
                    >
                    {def.icon && (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                        {def.icon}
                        </span>
                    )}
                    <span className="font-display font-black">{def.label}</span>
                </div>
                <div className="font-display font-bold" style={{ fontSize:12, color: T.text, marginBottom:2, pointerEvents:'none' }}>
                {def.title}
                </div>
                <div className="text-slate-400 font-sans" style={{ fontSize:10, lineHeight:1.45, pointerEvents:'none' }}>
                {def.sub}
                </div>
            </div>
            )
        })}

        {/* ── Hint ── */}
        <span className="absolute bottom-6 left-6 text-xs text-slate-300" style={{ pointerEvents:'none', zIndex:20 }}>
            Arrastra los nodos · El canvas se actualiza en tiempo real
        </span>

        {/* ── Reset ── */}
        <button
            onClick={handleReset}
            className="reset-btn"
            style={{
            position:'absolute', bottom:14, right:14, zIndex:60,
            background:'rgba(192,132,252,.12)', border:'none',
            color: T.accent2, padding:'10px 13px', cursor:'pointer',
            fontFamily: "SVT323, monospace", fontSize:10, letterSpacing:'0.2rem',
            textTransform:'uppercase', display:'flex', alignItems:'center', gap:6,
            transition:'background .2s, transform .14s',
            }}
        >
            // Organizar _<ArrowClockwiseIcon />
        </button>
        </div>
    )
}

// ─── SCROLL REVEAL HOOK ───────────────────────────────────────────────────────
function useReveal() {
    useEffect(() => {
        const els = document.querySelectorAll('.reveal')
        const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') })
        }, { threshold: 0.08 })
        els.forEach(el => io.observe(el))
        return () => io.disconnect()
    }, [])
}

// ─── SECTION COMPONENTS ──────────────────────────────────────────────────────

function SectionTag({ children }) {
    return (
        <div className="reveal" style={{ display:'inline-block', fontSize:10, fontWeight:600, letterSpacing:'.25em', textTransform:'uppercase', color: T.accent2, background:'rgba(192,132,252,.07)', border:'1px solid rgba(192,132,252,.2)', padding:'5px 14px', borderRadius:20, marginBottom:20 }}>
        {children}
        </div>
    )
}

function H2({ children, className = '' }) {
    return (
        <h2 className={`reveal ${className}`} style={{ fontFamily:'"DM Serif Display",serif', fontSize:'clamp(26px,4vw,44px)', fontWeight:400, lineHeight:1.15, marginBottom:16, letterSpacing:'-.02em', color: T.text }}>
        {children}
        </h2>
    )
}

function Divider() {
    return <hr style={{ border:'none', borderTop:`1px solid ${T.border}` }}/>
}

// ── NAV ────────────────────────────────────────────────────────────────────────
function Nav() {
    return (
        <HeaderCase />
    )
}

// ── HERO ───────────────────────────────────────────────────────────────────────
function Hero() {
    const scrollToSection = (id) => {
    const el = document.getElementById(id)

        if (el) {
        window.scrollTo({
            top: el.offsetTop,
            behavior: "smooth"
        })
        }
    }

    const handleDownloadPDF = () => {
        window.print()
    }

    return (
    <section id="case-hero" className="relative w-full bg-white scroll-mt-20 min-h-screen flex flex-col justify-center">
        <div className="relative z-10 w-full mx-auto px-6 md:px-12 flex items-center justify-center text-center py-24 md:py-32">
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
                <img src="/edenred-logo.svg" alt="Edenred" className="reveal h-8 md:h-16 animate-fade mb-8" />
                <div className="reveal hero-eyebrow text-neutral-500">Case Study <span className="e-dot"></span> Lyfecycle & Automation Specialist</div>
                <h1 className="reveal text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight font-elegant text-neutral-800">Diseñando revenue con <span class="italic text-primary">datos imperfectos</span></h1>
                <p className="reveal mt-8 max-w-2xl text-sm md:text-base lg:text-lg leading-relaxed text-neutral-500 font-sans">Una base activa, campos incompletos, tracking inconsistente. En lugar de esperar data perfecta, el enfoque es construir un sistema que aprende mientras convierte.</p>
                
                <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 border-y border-slate-200 py-8 w-full">
                    <div className="grid leading-relaxed md:border-r">
                        <span className="text-xs font-sans text-neutral-500 tracking-[.2em] uppercase">Plataforma</span>
                        <span className="text-xs font-sans text-neutral-400 tracking-wide mt-2">HubSpot</span>
                    </div>
                    <div className="grid leading-relaxed md:border-r">
                        <span className="text-xs font-sans text-neutral-500 tracking-[.2em] uppercase">Canales</span>
                        <span className="text-xs font-sans text-neutral-400 tracking-wide mt-2">Email · In-app · WhatsApp</span>
                    </div>
                    <div className="grid leading-relaxed md:border-r">
                        <span className="text-xs font-sans text-neutral-500 tracking-[.2em] uppercase">Objetivo</span>
                        <span className="text-xs font-sans text-neutral-400 tracking-wide mt-2">Up-sell &amp; Cross-sell</span>
                    </div>
                    <div className="grid leading-relaxed">
                        <span className="text-xs font-sans text-neutral-500 tracking-[.2em] uppercase">Restricción</span>
                        <span className="text-xs font-sans text-neutral-400 tracking-wide mt-2">Máx. 6 touchpoints</span>
                    </div>
                </div>

                {/* <div className="mt-8">
                    <button onClick={handleDownloadPDF} className="btn-glitch-fill">
                        <span className="text">// Descargar</span>
                        <span className="text-decoration"> _</span>
                        <span className="decoration">⇒</span>
                    </button>
                </div> */}

                <div className="mt-16 no-print">
                    <button
                    onClick={() => scrollToSection("diagnostic")}
                    className="cursor-pointer bg-main-color px-3 py-2 rounded-md text-white tracking-wider animate-bounce hover:animate-none"
                    >
                        <svg
                            className="w-5 h-5"
                            stroke="currentColor"
                            stroke-width="2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            ></path>
                        </svg>
                    </button>
                </div>

            </div>
        </div>
    </section>
    )
}

// ── DIAGNÓSTICO ────────────────────────────────────────────────────────────────
function Diagnostico() {
    return (
    <section id="diagnostic" className="bg-slate-900 text-white overflow-hidden flex flex-col z-20 scroll-mt-20 py-16 md:py-32">
        <div className="relative z-10 w-full container mx-auto px-4 md:px-12">

            <div className="max-w-2xl">
                <div className="reveal hero-eyebrow text-neutral-200">Diagnóstico de datos</div>
                <h2 className="reveal font-elegant text-4xl md:text-4xl lg:text-6xl xl:text-6xl font-black tracking-tight mb-8">¿Qué está roto y qué es <span class="italic text-primary">suficiente para empezar?</span></h2>
                <p className="reveal text-sm md:text-base lg:text-lg leading-relaxed font-sans">El brief pide nombrar los 2–3 campos críticos para iniciar, esta es la pregunta de priorización que más revela criterio técnico real.</p>
            </div>

            <div className="reveal bg-slate-800 rounded-2xl p-12 realtive overflow-hidden mt-8">
                <h3 className="font-display font-black tracking-tight uppercase text-xl font-main-color">Señales críticas priorizadas para iniciar</h3>
                <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans my-4">No toda la data rota importa igual. Estas tres señales combinan alta predictibilidad con baja dependencia de tracking de producto.</p>

                <div class="relative overflow-x-auto">
                    <table class="w-full text-left table-auto my-4">
                        <thead class="border-b border-slate-700 text-[0.65rem] uppercase text-slate-500 pb-4 font-display tracking-widest">
                            <tr>
                                <th scope="col" class="px-8 py-3 font-black">
                                    Campo
                                </th>
                                <th scope="col" class="px-8 py-3 font-black">
                                    Por qué es prioritario
                                </th>
                                <th scope="col" class="px-8 py-3 font-black">
                                    Confianza
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-slate-700">
                                <th scope="row" class="px-8 py-4 text-sm font-sans">
                                    <p>Último click en email</p>
                                    <p className="mt-2"><span className="font-mono text-xs bg-purple-900 text-purple-400 px-2 py-1 rounded tracking-wider">hs_email_last_click_date</span></p>
                                </th>
                                <td class="px-8 py-4 text-sm font-sans text-sm">
                                    Siempre disponible en HubSpot sin integración de producto. Es el proxy más limpio de actividad reciente.
                                </td>
                                <td class="px-8 py-4 text-xs font-sans">
                                    <span className="font-sans bg-green-600 text-green-300 px-4 py-2 rounded-full border border-green-400">Alta</span>
                                </td>
                            </tr>
                            <tr class="border-b border-slate-700">
                                <th scope="row" class="px-8 py-4 text-sm font-sans">
                                    <p>Visita a páginas de pricing o add-ons</p>
                                    <p className="mt-2"><span className="font-mono text-xs bg-purple-900 text-purple-400 px-2 py-1 rounded">hs_analytics_last_url</span></p>
                                </th>
                                <td class="px-8 py-4 text-sm font-sans">
                                    Señal de intención comercial capturable con HubSpot Tracking Code. Alta correlación con apertura a oferta.
                                </td>
                                <td class="px-8 py-4 text-xs font-sans">
                                    <span className="font-sans bg-yellow-600 text-yellow-300 px-4 py-2 rounded-full border border-yellow-400">Media</span>
                                </td>
                            </tr>
                            <tr class="border-b border-slate-700">
                                <th scope="row" class="px-8 py-4 text-sm font-sans">
                                    <p>Días desde último login (o ausencia de evento)</p>
                                    <p className="mt-2"><span className="font-mono text-xs bg-purple-900 text-purple-400 px-2 py-1 rounded">last_login_date (custom)</span></p>
                                </th>
                                <td class="px-8 py-4 text-sm font-sans">
                                    Si el tracking falla, la ausencia de evento es en sí una señal. Un campo custom con timestamp es suficiente.
                                </td>
                                <td class="px-8 py-4 text-xs font-sans">
                                    <span className="font-sans bg-yellow-600 text-yellow-300 px-4 py-2 rounded-full border border-yellow-400">Media</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans my-4">Los campos: "plan" e "intereses", están incompletos. Ese es exactamente el problema que el TP 3 del flujo va a resolver. No son prerrequisito para lanzar, son el resultado esperado del sistema.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                    <div className="bg-slate-700 rounded-xl p-8">
                        <h3 className="font-display font-black tracking-tight uppercase text-lg font-main-color">Problemas que bloquean antes de lanzar</h3>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans my-4">Duplicados en CRM que pueden generar doble envío. Esto se trata antes de activar workflows.</p>
                    </div>
                    <div className="bg-slate-700 rounded-xl p-8">
                        <h3 className="font-display font-black tracking-tight uppercase text-lg font-main-color">Problemas que el sistema resuelve solo</h3>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans my-4">Campos vacíos de intereses, plan y uso se poblarán progresivamente con el comportamiento dentro del flujo.</p>
                    </div>
                </div>

                <div className="bg-slate-700 rounded-xl p-8">
                    <h3 className="font-display font-black tracking-tight uppercase text-lg font-main-color mb-4">Deduplicación previa al lanzamiento</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="lg:border-r border-slate-600">
                            <h3 className="font-elegant text-4xl italic mb-2 text-slate-500">1</h3>
                            <h4 className="text-[0.65rem] uppercase text-slate-500 font-display tracking-widest font-black mb-4">Regla Primaria</h4>
                            <div className="line-divider" />
                            <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans mt-4">Email como campo único. Merge automático si mismo email, diferente Contact ID.</p>
                        </div>
                        <div className="lg:border-r border-slate-600">
                            <h3 className="font-elegant text-4xl italic mb-2 text-slate-500">2</h3>
                            <h4 className="text-[0.65rem] uppercase text-slate-500 font-display tracking-widest font-black mb-4">Validación secundaria</h4>
                            <div className="line-divider" />
                            <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans mt-4">Teléfono como criterio de merge manual cuando email difiere pero teléfono coincide.</p>
                        </div>
                        <div className="lg:border-r border-slate-600">
                            <h3 className="font-elegant text-4xl italic mb-2 text-slate-500">3</h3>
                            <h4 className="text-[0.65rem] uppercase text-slate-500 font-display tracking-widest font-black mb-4">Exclusión activa</h4>
                            <div className="line-divider" />
                            <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans mt-4">Contactos sin email válido o con estado "bounced" excluidos de listas hasta resolución.</p>
                        </div>
                        <div className="">
                            <h3 className="font-elegant text-4xl italic mb-2 text-slate-500">4</h3>
                            <h4 className="text-[0.65rem] uppercase text-slate-500 font-display tracking-widest font-black mb-4">No bloqueante</h4>
                            <div className="line-divider" />
                            <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans mt-4">Se lanza sobre contactos validados. Los duplicados se resuelven en background.</p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </section>
    )
}        

// ── CONTEXTO & DECISIÓN ────────────────────────────────────────────────────────
function ContextoDecision() {
    return (
    <section id="context" className="bg-slate-400 text-white overflow-hidden flex flex-col z-20 scroll-mt-20 py-16 md:py-32">
        <div className="relative z-10 w-full container mx-auto px-4 md:px-12">
            
            <div className="reveal hero-eyebrow text-neutral-200">Contexto &amp; Decisión</div>
            <h2 className="reveal font-elegant text-4xl md:text-4xl lg:text-6xl xl:text-6xl font-black tracking-tight mb-8">El punto de partida y <span class="italic text-primary">cómo responder a él</span></h2>

            <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-500 rounded-xl p-8">
                    <h3 className="font-display font-black tracking-tight uppercase text-lg font-main-color mb-4">La situación real</h3>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="skill-dot"></span> Campos de plan, uso e intereses: incompletos o desactualizados</p>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="skill-dot"></span> Tracking de producto con eventos que no siempre llegan</p>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="skill-dot"></span> Duplicados activos en CRM</p>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="skill-dot"></span> Campañas previas con quejas por irrelevancia</p>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="skill-dot"></span> Revenue por usuario estancado</p>
                </div>
                <div className="bg-slate-500 rounded-xl p-8">
                    <h3 className="font-display font-black tracking-tight uppercase text-lg font-main-color mb-4">El reto concreto</h3> 
                    <svg width="100%" viewBox="0 0 300 100" preserveAspectRatio="xMidYMid meet" className="block" fill="none">
                        <rect x="6" y="55" width="66" height="38" rx="7" fill="rgba(59, 7, 100)" stroke="rgba(107, 33, 168)" strokeWidth="1"/>
                        <text x="39" y="74" className="font-sans text-[0.5rem]" fill="rgba(233, 213, 255)" textAnchor="middle">Revenue</text>
                        <text x="39" y="80" className="font-sans text-[0.3rem]" fill="rgba(233, 213, 255)" textAnchor="middle">Estancado</text>
                        <rect x="228" y="8" width="66" height="36" rx="7" fill="rgba(8, 47, 73)" stroke="rgba(7, 89, 133)" strokeWidth="1"/>
                        <text x="261" y="26" className="font-sans text-[0.5rem]" fill="rgba(186, 230, 253)" textAnchor="middle">Up/Cross sell</text>
                        <text x="261" y="34" className="font-sans text-[0.3rem]" fill="rgba(186, 230, 253)" textAnchor="middle">Objetivo</text>
                        <rect x="108" y="34" width="18" height="28" rx="4" fill="rgba(220, 38, 38)" stroke="rgba(185, 28, 28)" strokeWidth="1"/>
                        <text x="117" y="52" className="font-sans text-xs" fill="rgba(252, 165, 165)" textAnchor="middle">?</text>
                        <rect x="148" y="20" width="18" height="28" rx="4" fill="rgba(220, 38, 38)" stroke="rgba(185, 28, 28)" strokeWidth="1"/>
                        <text x="157" y="38" className="font-sans text-xs" fill="rgba(252, 165, 165)" textAnchor="middle">?</text>
                        <path d="M74 74 Q150 18 228 26" stroke="rgba(168, 85, 247)" strokeWidth="1" fill="none" strokeDasharray="5 3"/>
                        <text x="138" y="10" className="font-sans text-[0.5rem] italic" fill="#ffffff" textAnchor="middle">Behavioral Bridge</text>
                    </svg>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans mt-4">Crecer via up-sell y cross-sell sin datos confiables y sin reproducir las quejas que ya costaron confianza.</p>
                </div>
            </div>

            <div className="reveal bg-slate-500 rounded-xl p-8 mt-8">
                <h3 className="font-display font-black tracking-tight uppercase text-lg font-main-color mb-4">La decisión de arquitectura</h3>
                <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans my-4">Usar lo que existe ahora como punto de partida. El sistema mejora su propia data mientras opera.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-600 rounded-xl p-8">
                        <h4 className="text-[0.65rem] uppercase text-slate-400 font-display tracking-widest font-black mb-4">Lo que no haremos</h4>
                        <div className="line-divider" />
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans line-through mt-4">Esperar segmentación perfecta</p>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans line-through">Blast a toda la base</p>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans line-through">Formularios largos</p>
                    </div>
                    <div className="bg-slate-600 rounded-xl p-8">
                        <h4 className="text-[0.65rem] uppercase text-slate-400 font-display tracking-widest font-black mb-4">Lo que sí haremos</h4>
                        <div className="line-divider" />
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans mt-4">Comportamiento como proxy de intención</p>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Automatizaciones progresivas</p>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Cada interacción = dato nuevo</p>
                    </div>
                    <div className="bg-slate-600 rounded-xl p-8">
                        <h4 className="text-[0.65rem] uppercase text-slate-400 font-display tracking-widest font-black mb-4">La trampa real a evitar</h4>
                        <div className="line-divider" />
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans mt-4">Optimizar el copy antes de validar la segmentación. Un asunto bien escrito no compensa un segmento mal definido.</p>
                    </div>
                </div>

                <div className="mt-8 p-8 border-l-4 border-main-color bg-slate-600 rounded-r-xl font-elegant text-2xl italic">
                    "Es un sistema que mejora su propia inteligencia con cada touchpoint."
                </div>
            </div>

        </div>
    </section>
    )
}

// ── SEGMENTACIÓN ───────────────────────────────────────────────────────────────
function Segmentacion() {
    return (
    <section id="segmentation" className="bg-slate-100 text-neutral-900 overflow-hidden flex flex-col z-20 scroll-mt-20 py-16 md:py-32">
        <div className="relative z-10 w-full container mx-auto px-4 md:px-12">

            <div className="max-w-2xl">
                <div className="reveal hero-eyebrow text-neutral-900">Segmentación</div>
                <h2 className="reveal font-elegant text-4xl md:text-4xl lg:text-6xl xl:text-6xl font-black tracking-tight mb-8"><span class="italic text-primary">Segmentos probabilísticos</span> con criterios de entrada explícitos</h2>
                <p className="reveal text-sm md:text-base lg:text-lg leading-relaxed font-sans">El brief pide criterios aunque sean aproximados, eso no significa vagos. Cada segmento tiene umbrales concretos para ser replicable en HubSpot.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="reveal bg-slate-200 p-8 rounded-xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-slate-300">
                    <div className="p-2 basic-color-1 inline-block rounded-xl">
                        <ChartLineIcon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-display font-black tracking-tight uppercase text-md mb-2">Alta intención no monetizada</h3>
                    <span className="font-sans basic-color-1 color-1-300 px-4 py-2 rounded-full border border-[color-1-300] text-xs uppercase tracking-widest">Up-sell prioritario</span>
                    <h4 className="text-[0.65rem] uppercase text-slate-500 font-display tracking-widest font-black my-4">Criterio de entrada</h4>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="dot-1"></span>Abrió o clickeó email en los últimos <span className="font-mono text-xs bg-purple-900 text-purple-400 px-2 py-1 rounded">14 días</span></p>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="dot-1"></span>Visitó pricing o add-ons <span className="font-mono text-xs bg-purple-900 text-purple-400 px-2 py-1 rounded">≥ 1 vez</span></p>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="dot-1"></span><span className="font-mono text-xs bg-purple-900 text-purple-400 px-2 py-1 rounded">add_on_activo = false</span> o vacío</p>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans my-4">Señal de intención existente. El trabajo es reducir fricción hacia conversión.</p>
                    <div className="line-divider-dark" />
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans my-4 italic color-1">No generó intención. La convierto.</p>
                </div>
                <div className="reveal bg-slate-200 p-8 rounded-xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-slate-300">
                    <div className="p-2 basic-color-2 inline-block rounded-xl">
                        <ChartBarIcon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-display font-black tracking-tight uppercase text-md mb-2">Subutilización</h3>
                    <span className="font-sans basic-color-2 color-2-300 px-4 py-2 rounded-full border border-[color-2-300] text-xs uppercase tracking-widest">Cross-sell educativo</span>
                    <h4 className="text-[0.65rem] uppercase text-slate-500 font-display tracking-widest font-black my-4">Criterio de entrada</h4>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="dot-2"></span>Actividad app en últimos <span className="font-mono text-xs bg-purple-900 text-purple-400 px-2 py-1 rounded">30 días</span></p>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="dot-2"></span>Sin acceso a features avanzados <span className="font-mono text-xs bg-purple-900 text-purple-400 px-2 py-1 rounded">(si evento disponible)</span></p>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="dot-2"></span>Excluir Segmento 1 (no visitó pricing)</p>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans my-4">No perciben el valor completo. La oferta viene después de demostrar utilidad.</p>
                    <div className="line-divider-dark" />
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans my-4 italic color-2">Aquí no vendo. Primero construyo valor.</p>
                </div>
                <div className="reveal bg-slate-200 p-8 rounded-xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-slate-300">
                    <div className="p-2 basic-color-3 inline-block rounded-xl">
                        <WarningDiamondIcon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-display font-black tracking-tight uppercase text-md mb-2">Riesgo de desinterés</h3>
                    <span className="font-sans basic-color-3 color-3-300 px-4 py-2 rounded-full border border-[color-3-300] text-xs uppercase tracking-widest">Reactivación</span>
                    <h4 className="text-[0.65rem] uppercase text-slate-500 font-display tracking-widest font-black my-4">Criterio de entrada</h4>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="dot-3"></span>Sin apertura ni actividad en <span className="font-mono text-xs bg-purple-900 text-purple-400 px-2 py-1 rounded">15-45 días</span></p>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="dot-3"></span>No está en Segmento 1 ni Segmento 2</p>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans"><span className="dot-3"></span>CTR histórico <span className="font-mono text-xs bg-purple-900 text-purple-400 px-2 py-1 rounded">-5%</span> en últimas 3 campañas</p>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans my-4">Upsell solo si recuperan interacción. Primero reactivar, no vender.</p>
                    <div className="line-divider-dark" />
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans my-4 italic color-3">Empujar aquí reproduce las quejas anteriores.</p>
                </div>
            </div>

            <div className="reveal mt-8 p-8 border-l-4 border-main-color bg-slate-200 rounded-r-xl font-sans">
                <h4 className="text-[0.65rem] uppercase text-slate-500 font-display tracking-widest font-black my-4">Regla de prioridad para overlaps</h4>
                <p>Prioridad: Segmento 1 → Segmento 2 → Segmento 3. Si un contacto cumple criterios de más de un segmento, entra al de mayor intención. En HubSpot: la lista de Segmento 2 tiene como condición adicional "No está en lista Segmento 1"; la de Segmento 3, "No está en Segmento 1 ni Segmento 2". Resultado: listas siempre mutuamente excluyentes.</p>
            </div>

        </div>
    </section>
    )
}

// ── LIFECYCLE CANVAS ───────────────────────────────────────────────────────────
function FlujoCamvas() {
    return (
    <section id="lifecycle" className="bg-slate-700 text-white overflow-hidden flex flex-col z-20 scroll-mt-20 py-16 md:py-32">
        <div className="relative z-10 w-full container px-4 md:px-24">
            <div className="reveal hero-eyebrow">Flujo de Automatización</div>
            <h2 className="reveal font-elegant text-4xl md:text-4xl lg:text-6xl xl:text-6xl font-black tracking-tight mb-8">Orquestación del <span class="italic text-primary">lifecycle</span></h2>
            <p className="reveal text-sm md:text-base lg:text-lg leading-relaxed font-sans">Máximo 6 touchpoints · Workflows HubSpot · Listas dinámicas</p>
        </div>

        <div className="relative z-10 w-full px-4 md:px-24 mt-8">
            <div className="overflow-hidden bg-slate-800 rounded-3xl">
                <div style={{ padding:'16px 24px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:11 }}>
                    <div style={{ display:'flex', gap:5 }}>
                        {['#FF5F57','#FFBD2E','#27C93F'].map(c => <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>)}
                    </div>
                    <span className="font-display font-black text-slate-500 text-sm">Lifecycle Flow — HubSpot Workflows</span>
                </div>
                <LifecycleGraph />
            </div>
        </div>
    </section>
    )
}

// ── DATA ENGINE ────────────────────────────────────────────────────────────────
function DataEngine() {
    return (
    <section id="data" className="bg-slate-400 text-white overflow-hidden flex flex-col z-20 scroll-mt-20 py-16 md:py-32">
        <div className="relative z-10 w-full container mx-auto px-4 md:px-12">
            <div className="reveal hero-eyebrow">Enfoque de data & cleanup</div>
            <h2 className="reveal font-elegant text-4xl md:text-4xl lg:text-6xl xl:text-6xl font-black tracking-tight mb-8"><span class="italic text-primary">La calidad de datos</span> es un resultado del sistema, no su prerequisito</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="reveal bg-slate-500 p-8 rounded-xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-slate-700">
                    <h3 className="font-elegant text-4xl italic mb-2 text-slate-400">1</h3>
                    <h4 className="text-[0.65rem] uppercase text-slate-400 font-display tracking-widest font-black mb-4">Progressive Profiling</h4>
                    <div className="line-divider" />
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans mt-4">Sin formularios. Los clicks en el TP 3 populan propiedades custom directamente en HubSpot. Cada CTA es una respuesta de encuesta sin fricción.</p>
                </div>
                <div className="reveal bg-slate-500 p-8 rounded-xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-slate-700">
                    <h3 className="font-elegant text-4xl italic mb-2 text-slate-400">2</h3>
                    <h4 className="text-[0.65rem] uppercase text-slate-400 font-display tracking-widest font-black mb-4">Comportamiento como verdad</h4>
                    <div className="line-divider" />
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans mt-4">Si el tracking de producto falla, el comportamiento en email y web es el fallback. Siempre hay al menos una señal disponible para actuar.</p>
                </div>
                <div className="reveal bg-slate-500 p-8 rounded-xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-slate-700">
                    <h3 className="font-elegant text-4xl italic mb-2 text-slate-400">3</h3>
                    <h4 className="text-[0.65rem] uppercase text-slate-400 font-display tracking-widest font-black mb-4">Deduplicación no bloqueante</h4>
                    <div className="line-divider" />
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans mt-4">Email único como regla primaria. Contactos sin email válido excluidos de listas activas, pero no eliminados, se limpian en background.</p>
                </div>
                <div className="reveal bg-slate-500 p-8 rounded-xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-slate-700">
                    <h3 className="font-elegant text-4xl italic mb-2 text-slate-400">4</h3>
                    <h4 className="text-[0.65rem] uppercase text-slate-400 font-display tracking-widest font-black mb-4">Listas dinámicas auto-recalificantes <span className="font-sans bg-green-600 text-green-300 px-2 py-2 rounded-lg border border-green-400 ml-2">Presición</span></h4>
                    <div className="line-divider" />
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans mt-4">Recalificación automática en HubSpot (~15 min). Si un usuario de Segmento 3 reabre un email, sube a Segmento 2 automáticamente gracias a las exclusiones en cascada. El sistema se auto-corrige.</p>
                </div>
            </div>
        </div>
    </section>
    )
}

// ── MÉTRICAS ───────────────────────────────────────────────────────────────────
function Metricas() {
    return (
        <section id="metrics" className="bg-slate-500 text-white overflow-hidden flex flex-col z-20 scroll-mt-20 py-16 md:py-32">
            <div className="relative z-10 w-full container mx-auto px-4 md:px-12">
                <div className="max-w-2xl">
                    <div className="reveal hero-eyebrow">Métricas & Evaluación</div>
                    <h2 className="reveal font-elegant text-4xl md:text-4xl lg:text-6xl xl:text-6xl font-black tracking-tight mb-8">Se miden conversiones. Y se miden si <span class="italic text-primary">el sistema aprende.</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="reveal bg-slate-600 p-8 rounded-xl">
                        <h4 className="text-[0.65rem] uppercase text-slate-400 font-display tracking-widest font-black mb-4">Impacto en negocio</h4>
                        <div className="flex items-center border-b border-slate-500 py-4">
                            <span className="bg-secondary-color p-2 mr-4 rounded-md"><ChartLineUpIcon size={32} /></span><p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Revenue por usuario (ARPU)</p>
                        </div>
                        <div className="flex items-center border-b border-slate-500 py-4">
                            <span className="bg-secondary-color p-2 mr-4 rounded-md"><ChartBarIcon size={32} /></span><p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Tasa de adopción de Add-ons</p>
                        </div>
                        <div className="flex items-center border-b border-slate-500 py-4">
                            <span className="bg-secondary-color p-2 mr-4 rounded-md"><ClockIcon size={32} /></span><p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Conversion rate por segmento</p>
                        </div>
                        <div className="flex items-center border-b border-slate-500 py-4">
                            <span className="bg-secondary-color p-2 mr-4 rounded-md"><LineSegmentIcon size={32} /></span><p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Incremental revenue vs Grupo control</p>
                        </div>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans mt-4">El grupo control es indispensable. Sin él, cualquier mejora de ARPU puede ser estacional.</p>
                    </div>
                    <div className="reveal bg-slate-600 p-8 rounded-xl">
                        <h4 className="text-[0.65rem] uppercase text-slate-400 font-display tracking-widest font-black mb-4">Salud del Lifecycle</h4>
                        <div className="flex items-center border-b border-slate-500 py-4">
                            <span className="bg-secondary-color p-2 mr-4 rounded-md"><SparkleIcon size={32} /></span><p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">% Perfiles enriquecidos (Props Custom)</p>
                        </div>
                        <div className="flex items-center border-b border-slate-500 py-4">
                            <span className="bg-secondary-color p-2 mr-4 rounded-md"><EnvelopeIcon size={32} /></span><p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">CTR y engagement rate por touchpoint</p>
                        </div>
                        <div className="flex items-center border-b border-slate-500 py-4">
                            <span className="bg-secondary-color p-2 mr-4 rounded-md"><XCircleIcon size={32} /></span><p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Opt-outs y quejas (tasa, no volumen)</p>
                        </div>
                        <div className="flex items-center border-b border-slate-500 py-4">
                            <span className="bg-secondary-color p-2 mr-4 rounded-md"><StrategyIcon size={32} /></span><p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Tasa de recalificación entre segmentos</p>
                        </div>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans mt-4">La tasa de recalificación es el indicador más honesto de si el sistema está aprendiendo.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ── ITERACIÓN ──────────────────────────────────────────────────────────────────
function Iteracion() {
    return (
        <section id="optimization" className="bg-slate-600 text-white overflow-hidden flex flex-col z-20 scroll-mt-20 py-16 md:py-32">
            <div className="relative z-10 w-full container mx-auto px-4 md:px-12">
                
                <div className="max-w-2xl">
                    <div className="reveal hero-eyebrow">Optimización</div>
                    <h2 className="reveal font-elegant text-4xl md:text-4xl lg:text-6xl xl:text-6xl font-black tracking-tight">Después de 30 días, se optimiza el entendimiento, <span class="italic text-primary">no el subject del email.</span></h2>
                </div>

                <div className="my-8">
                    <div className="reveal relative border-l border-main-color">
                        {/* Item */}
                        <div className="relative pl-8">
                            {/* Dot */}
                            <span className="absolute left-0 -translate-x-1/2 top-0 w-3 h-3 bg-main-color rounded-full"></span>

                            {/* Content */}
                            <h3 className="text-white text-xl font-display font-bold mb-2">Re-segmentación por comportamiento real</h3>
                            <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Los proxies del día 1 se reemplazan por señales directas. "Visitó pricing" se refina por "clickeó CTA de add-on específico". El Seg 1 se vuelve mucho más preciso.</p>
                        </div>
                    </div>
                    <div className="reveal relative border-l border-main-color pt-8">
                        {/* Item */}
                        <div className="relative pl-8">
                            {/* Dot */}
                            <span className="absolute left-0 -translate-x-1/2 top-0 w-3 h-3 bg-main-color rounded-full"></span>

                            {/* Content */}
                            <h3 className="text-white text-xl font-display font-bold mb-2">Auditoría de Segmento 3</h3>
                            <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Si la tasa de reactivación de Seg 3 es menor al 8%, el segmento contiene usuarios ya irrecuperables. Acción: excluirlos de futuros flujos y pasarlos como señal de churn temprano.</p>
                        </div>
                    </div>
                    <div className="reveal relative border-l border-main-color pt-8">
                        {/* Item */}
                        <div className="relative pl-8">
                            {/* Dot */}
                            <span className="absolute left-0 -translate-x-1/2 top-0 w-3 h-3 bg-main-color rounded-full"></span>

                            {/* Content */}
                            <h3 className="text-white text-xl font-display font-bold mb-2">Validar la hipótesis del TP 3</h3>
                            <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Si el campo <span className="font-mono text-xs bg-purple-900 text-purple-400 px-2 py-1 rounded">interes_reportes</span> sigue vacío en más del 60% de contactos después de 30 días, el CTA de enriquecimiento necesita rediseño antes de optimizar cualquier otra cosa.</p>
                        </div>
                    </div>
                </div>

                <div className="reveal grid grid-cols-1 md:grid-cols-[8fr_1fr_8fr] gap-2 items-center">
                    <div className="bg-slate-700 p-8 rounded-xl">
                        <h3 className="font-display font-black tracking-tight uppercase text-xl mb-2 color-1">Grupo A</h3>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Segmentación inicial: proxies de comportamiento (email engagement + visita a pricing)</p>
                    </div>
                    <div className="text-center font-elegant text-4xl italic text-slate-400 py-2 md:py-0">
                        vs
                    </div>
                    <div className="bg-slate-700 p-8 rounded-xl">
                        <h3 className="font-display font-black tracking-tight uppercase text-xl mb-2 color-2">Grupo B</h3>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Segmentación enriquecida: comportamiento real 30d + propiedades custom capturadas en TP 3</p>
                    </div>
                </div>

                <div className="reveal bg-slate-700 p-8 rounded-xl mt-8">
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed font-sans">Hipótesis con criterio de éxito: El Grupo B tendrá un conversion rate al menos 15% mayor en up-sell de Reportes Avanzados que el Grupo A, medido a 60 días. Si la diferencia es menor al 10%, la segmentación inicial ya era suficientemente buena y la complejidad adicional no se justifica</p>
                </div>

            </div>
        </section>
    )
}

// ── INLINE ICON HELPERS ────────────────────────────────────────────────────────
function StarIcon() {
    return <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1.5 L6 3.8 L8.5 4 L6.8 5.8 L7.4 8.5 L5 7.2 L2.6 8.5 L3.2 5.8 L1.5 4 L4 3.8 Z" stroke="currentColor" strokeWidth="1" fill="none"/></svg>
    }
    function PlusIcon() {
    return <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2 L5 8 M2 5 L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    }
    function CheckIcon() {
    return <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5 L4 7 L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function EdenredCase() {
    useReveal()

    // Inject global CSS once
    useEffect(() => {
        const id = 'edenred-global-css'
        if (document.getElementById(id)) return
        const style = document.createElement('style')
        style.id = id
        style.textContent = GLOBAL_CSS
        document.head.appendChild(style)
        return () => document.getElementById(id)?.remove()
    }, [])

    return (
        <div style={{ background: T.bg, color: T.text, fontFamily:'"DM Sans",sans-serif', fontWeight:300, lineHeight:1.75, overflowX:'hidden', minHeight:'100vh' }}>
        {/* Noise overlay */}
        <div style={{ position:'fixed', inset:0, backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")', pointerEvents:'none', zIndex:999, opacity:.5 }}/>

        <Nav/>
        <Hero/>
        <Diagnostico/>
        <ContextoDecision/>
        <Segmentacion/>
        <FlujoCamvas/>
        <DataEngine/>
        <Metricas/>
        <Iteracion/>
        <FooterLanding />
        </div>
    )
}