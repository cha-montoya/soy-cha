import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import ProjectTimeline from "./ProjectTimeline"
import { useVisitorName } from "../../hooks/useVisitorName"

export default function ProjectModal({ project, onClose }) {
    const { t } = useTranslation()
    const [isVisible, setIsVisible] = useState(false)
    const { name, saveName } = useVisitorName()

    // Pull translated context and responsibilities by project id
    const projectData = t(`projects.data.${project.id}`, { returnObjects: true })

    useEffect(() => {
        document.body.style.overflow = "hidden"
        setTimeout(() => setIsVisible(true), 10)
        return () => { document.body.style.overflow = "auto" }
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(() => onClose(), 600)
    }

    const formatName = (value) => {
        if (!value) return "Cha"
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    }

    const niftyUrl = `https://img1.niftyimages.com/mti/cbj5/p995?first_name=${formatName(name)}`

    const handleOpenProject = () => {
        let url = project.previewUrl
        if (project.personalizedPreview && name) {
        url += `?name=${encodeURIComponent(name)}`
        }
        window.open(url, "_blank")
    }

    return (
        <div className="fixed inset-0 z-50 bg-slate-800 flex items-center justify-center">
        <div className={`w-full h-full bg-slate-900 overflow-y-auto transform transition-transform duration-700 ease-in-out ${isVisible ? "scale-y-100" : "scale-y-0"} origin-center`}>

            <button onClick={handleClose} className="absolute top-8 right-8 text-white z-50">✕</button>

            <div className="max-w-6xl mx-auto mt-24 p-8 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* INFO */}
                <div>
                <h2 className="text-4xl font-display font-black tracking-tight mb-2">
                    {project.title}
                </h2>
                <p className="text-slate-400 mb-4 capitalize">
                    {project.client} · {project.category}
                </p>

                {project.clientLogo && (
                    <div className="h-16 w-40 flex items-center mb-8 justify-center">
                    <img
                        src={project.clientLogo}
                        alt={`${project.client} logo`}
                        className="max-h-full max-w-full object-contain opacity-60 transition duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:opacity-100"
                    />
                    </div>
                )}

                <ProjectTimeline involvement={project.involvement} />

                <div className="mt-8 space-y-8">

                    <div>
                        <h3 className="text-xl mb-2 font-black font-display">{t("projects.modal.context")}</h3>
                        <p className="text-slate-300">{projectData.context}</p>
                    </div>

                    <div>
                        <h3 className="text-xl mb-2 font-black font-display">Automation</h3>
                        <img
                        src={project.automation}
                        alt={`${project.client} logo`}
                        className="max-h-30 max-w-30 object-contain opacity-60 transition duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:opacity-100"
                        />
                    </div>

                    <div>
                        <h3 className="text-xl mb-2 font-black font-display">{t("projects.modal.responsibilities")}</h3>
                        <ul className="text-slate-300 list-disc pl-6 space-y-2">
                            {projectData.responsibilities.map((item, index) => (
                            <li key={index}>{item}</li>
                            ))}
                        </ul>

                        {project.previewUrl && (
                            <div className="mt-12">
                            <button onClick={handleOpenProject} className="btn-glitch-fill-white">
                                <span className="text">// {t("projects.modal.cta")}</span>
                                <span className="text-decoration"> _</span>
                                <span className="decoration">⇒</span>
                            </button>
                            </div>
                        )}
                    </div>

                    {project.personalizedPreview && (
                    <div className="mt-12">
                        <h3 className="text-xl mb-4 font-bold">{t("projects.modal.personalizationTitle")}</h3>
                        <p className="text-slate-400 mb-4 text-sm">{t("projects.modal.personalizationDesc")}</p>
                        <input
                        type="text"
                        placeholder={t("projects.modal.personalizationPlaceholder")}
                        value={name}
                        onChange={(e) => saveName(e.target.value)}
                        className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
                        />
                    </div>
                    )}

                </div>
                </div>

                {/* IMAGES */}
                <div className="grid grid-cols-2 gap-6 auto-rows-[200px]">
                {project.images?.map((img, i) => {
                    const imageSrc = project.personalizedPreview && i === 0 ? niftyUrl : img
                    return (
                    <div key={i} className="overflow-hidden bg-slate-800">
                        <img
                        src={imageSrc}
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 rounded-xl"
                        />
                    </div>
                    )
                })}
                </div>

            </div>
            </div>
        </div>
        </div>
    )
}