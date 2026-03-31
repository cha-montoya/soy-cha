import { useTranslation } from "react-i18next"

// ─── TYPE META ─────────────────────────────────────────────────────────────
const TYPE_META = {
    job:       { accent: "#005C52" },
    freelance: { accent: "#042940" },
    education: { accent: "#9FC131" },
    }

    // ─── DESKTOP CARD ──────────────────────────────────────────────────────────
    function MilestoneCard({ m, index, isFirst, isLast }) {
    const { t } = useTranslation()
    const meta = TYPE_META[m.type]

    return (
        <div
        className="relative flex flex-col h-full flex-shrink-0 px-8"
        style={{ width: "320px", scrollSnapAlign: "start" }}
        >
        {/* Rail + dot — centred vertically */}
        <div
            className="absolute left-0 right-0 flex items-center pointer-events-none"
            style={{ top: "50%", transform: "translateY(-50%)" }}
        >
            <div className="h-px flex-1 bg-slate-400" style={{ opacity: isFirst ? 0 : 1 }} />
            <div
            className="w-3.5 h-3.5 rounded-full flex-shrink-0 z-10"
            style={{ background: meta.accent, boxShadow: `0 0 10px ${meta.accent}99` }}
            />
            <div className="h-px flex-1 bg-slate-400" style={{ opacity: isLast ? 0 : 1 }} />
        </div>

        {/* Upper half */}
        <div className="flex flex-col justify-end pb-10" style={{ height: "50%" }}>
            <div
            className="font-display text-6xl font-black tracking-tight leading-none mb-2"
            style={{ color: meta.accent }}
            >
            {m.year}
            </div>

            <span
            className="inline-block text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-3 font-semibold w-fit"
            style={{
                background: `${meta.accent}1a`,
                color: meta.accent,
                border: `1px solid ${meta.accent}44`,
            }}
            >
            {t(`${m.type}`)}
            </span>

            <h3 className="font-elegant text-xl font-black text-black leading-snug">{m.role}</h3>
            <p className="text-neutral-500 text-xs mt-1 font-sans">{m.company}</p>
        </div>

        {/* Lower half */}
        <div className="flex flex-col justify-start pt-10 gap-4" style={{ height: "50%" }}>
            <p
            className="text-neutral-500 text-sm leading-relaxed border-l-2 pl-3"
            style={{ borderColor: meta.accent }}
            >
            {m.achievement}
            </p>

            <div className="flex flex-wrap gap-1.5">
            {m.tools.map((tool) => (
                <span
                key={tool}
                className="text-[11px] px-2 py-0.5 rounded font-mono"
                style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "#94a3b8",
                }}
                >
                {tool}
                </span>
            ))}
            </div>
        </div>
        </div>
    )
    }

    // ─── MAIN EXPORT ───────────────────────────────────────────────────────────
    export default function Trajectory() {
    const { t } = useTranslation()

    // Read milestones from translation file
    const milestones = t("trajectory.milestones", { returnObjects: true })

    // Drag-to-scroll handler (desktop)
    const handleDragScroll = (e) => {
        const el = e.currentTarget
        el.style.cursor = "grabbing"
        const startX     = e.pageX - el.offsetLeft
        const scrollLeft = el.scrollLeft

        const onMove = (ev) => {
        const x = ev.pageX - el.offsetLeft
        el.scrollLeft = scrollLeft - (x - startX)
        }
        const onUp = () => {
        el.style.cursor = "grab"
        window.removeEventListener("mousemove", onMove)
        window.removeEventListener("mouseup", onUp)
        }
        window.addEventListener("mousemove", onMove)
        window.addEventListener("mouseup", onUp)
    }

    return (
        <>
        <section
            id="trajectory"
            className="bg-white text-black pt-20 px-6 md:px-16 scroll-mt-20"
        >
            <div className="w-full lg:w-1/2 px-6 md:px-16 py-24 lg:py-16 mx-auto text-center">
            <div>
                <div className="hero-eyebrow text-neutral-400">
                {t("trajectory.eyebrow")}
                </div>
                <h2
                className="font-elegant text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-8 text-black"
                dangerouslySetInnerHTML={{ __html: t("trajectory.headline") }}
                />
                <p className="text-sm md:text-base lg:text-lg leading-relaxed text-neutral-400">
                {t("trajectory.line1")}
                </p>
            </div>
            </div>
        </section>

        {/* Inject single rule to hide WebKit scrollbar */}
        <style>{`.traj-track::-webkit-scrollbar{display:none}`}</style>

        {/* Desktop */}
        <section className="hidden lg:block bg-white" aria-label="Career timeline">
            <div
            className="traj-track overflow-x-auto"
            style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                cursor: "grab",
                WebkitOverflowScrolling: "touch",
            }}
            onMouseDown={handleDragScroll}
            >
                <div
                    className="flex"
                    style={{ height: "500px", width: "max-content", paddingInline: "64px" }}
                >
                    {milestones.map((m, i) => (
                    <MilestoneCard
                        key={`${m.year}-${i}`}
                        m={m}
                        index={i}
                        isFirst={i === 0}
                        isLast={i === milestones.length - 1}
                    />
                    ))}
                </div>
            </div>
        </section>

        {/* Mobile */}
        <section className="lg:hidden bg-white text-black pb-16 px-6" aria-label="Career timeline">
            <div className="relative ml-4">
                <div className="absolute left-[6px] top-0 bottom-0 w-px bg-slate-700" />

                <div className="flex flex-col">
                    {milestones.map((m, i) => {
                    const meta = TYPE_META[m.type]
                    return (
                        <div key={`${m.year}-${i}`} className="relative pl-10 pb-10">
                        <div
                            className="absolute left-0 top-2 w-3.5 h-3.5 rounded-full z-10"
                            style={{ background: meta.accent, boxShadow: `0 0 8px ${meta.accent}88` }}
                        />

                        <div
                            className="font-display text-4xl font-black tracking-tighter leading-none mb-1"
                            style={{ color: meta.accent }}
                        >
                            {m.year}
                        </div>

                        <span
                            className="inline-block text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-semibold"
                            style={{
                            background: `${meta.accent}1a`,
                            color: meta.accent,
                            border: `1px solid ${meta.accent}44`,
                            }}
                        >
                            {t(`${m.type}`)}
                        </span>

                        <h3 className="font-elegant text-xl font-black text-white leading-snug">{m.role}</h3>
                        <p className="text-slate-400 text-xs mb-3">{m.company}</p>

                        <p
                            className="text-neutral-300 text-sm leading-relaxed border-l-2 pl-3 mb-3"
                            style={{ borderColor: meta.accent }}
                        >
                            {m.achievement}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                            {m.tools.map((tool) => (
                            <span
                                key={tool}
                                className="text-[11px] px-2 py-0.5 rounded font-mono"
                                style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "#94a3b8",
                                }}
                            >
                                {tool}
                            </span>
                            ))}
                        </div>
                        </div>
                    )
                    })}
                </div>
            </div>
        </section>
        </>
    )
}