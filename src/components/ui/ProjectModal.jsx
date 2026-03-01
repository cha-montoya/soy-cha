import { useEffect, useState } from "react"
import ProjectTimeline from "./ProjectTimeline"

export default function ProjectModal({ project, onClose }) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        document.body.style.overflow = "hidden"

        // Trigger animation
        setTimeout(() => setIsVisible(true), 10)

        return () => {
        document.body.style.overflow = "auto"
        }
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(() => onClose(), 600)
    }

    return (
        <div className="fixed inset-0 z-50 bg-slate-800 flex items-center justify-center">

            {/* Reveal container */}
            <div className={`w-full h-full bg-slate-900 overflow-y-auto transform transition-transform duration-700 ease-in-out ${isVisible ? "scale-y-100" : "scale-y-0"} origin-center`}>
                <button onClick={handleClose} className="absolute top-8 right-8 text-white z-50">
                    ✕
                </button>
                
                <div className="max-w-6xl mx-auto mt-24 p-8 text-white">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* INFO */}
                        <div>
                            <h2 className="text-4xl font-black tracking-tight mb-4">
                                {project.title}
                            </h2>

                            <p className="text-slate-400 mb-12 capitalize">
                                {project.client} · {project.category}
                            </p>

                            {project.clientLogo && (
                                <div className="mb-12">
                                    <img
                                    src={project.clientLogo}
                                    alt={`${project.client} logo`}
                                    className="max-h-8 object-contain opacity-60 transition duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:opacity-100"
                                    />
                                </div>
                            )}

                            <ProjectTimeline involvement={project.involvement} />

                            <div className="mt-16 space-y-8">
                                <div>
                                    <h3 className="text-xl mb-2 font-bold">Contexto</h3>
                                    <p className="text-slate-300">
                                        {project.context}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl mb-2">Responsabilidades</h3>
                                    <ul className="text-slate-300 list-disc pl-6 space-y-2">
                                        {project.responsibilities.map((item, index) => (
                                        <li key={index}>{item}</li>
                                        ))}
                                    </ul>

                                    {project.previewUrl && (
                                    <div className="mt-12">
                                        <a
                                        href={project.previewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block"
                                        >
                                        <button className="btn-glitch-fill-white">
                                            <span className="text">// Ver Proyecto</span>
                                            <span className="text-decoration"> _</span>
                                            <span className="decoration">⇒</span>
                                        </button>
                                        </a>
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* IMAGES */}
                        <div className="grid grid-cols-2 gap-4 auto-rows-[200px]">
                            {project.images?.map((img, i) => (
                                <div
                                key={i}
                                className="overflow-hidden bg-slate-800"
                                >
                                    <img
                                    src={img}
                                    alt=""
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                
            </div>
        </div>
    )
}
