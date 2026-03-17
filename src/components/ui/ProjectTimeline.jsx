import { useTranslation } from "react-i18next"

export default function ProjectTimeline({ involvement }) {
    const { t } = useTranslation()

    const stages = [
        { key: "strategy" },
        { key: "design" },
        { key: "implementation" },
        { key: "analytics" }
    ]

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
        {stages.map(({ key }) => {
            const active = involvement[key]
            return (
            <div key={key} className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${active ? "bg-main-color" : "bg-slate-600"}`} />
                <span className={`text-sm ${active ? "text-white" : "text-slate-500"}`}>
                {t(`timeline.${key}`)}
                </span>
            </div>
            )
        })}
        </div>
    )
}
