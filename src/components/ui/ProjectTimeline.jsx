export default function ProjectTimeline({ involvement }) {
    const stages = [
        { key: "strategy", label: "Estrategia" },
        { key: "design", label: "Diseño" },
        { key: "implementation", label: "Implementación" },
        { key: "analytics", label: "Analytics" }
    ]

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
        {stages.map((stage, index) => {
            const active = involvement[stage.key]

            return (
            <div key={stage.key} className="flex items-center gap-4">
                <div
                className={`w-4 h-4 rounded-full ${
                    active ? "bg-white" : "bg-slate-600"
                }`}
                />
                <span
                className={`text-sm ${
                    active ? "text-white" : "text-slate-500"
                }`}
                >
                {stage.label}
                </span>
            </div>
            )
        })}
        </div>
    )
}
