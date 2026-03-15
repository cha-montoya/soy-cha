import useInView from "../../hooks/useInView"

export default function ProjectCard({ project, onOpen, index }) {
    const [ref, isVisible] = useInView()
    return (
        <div
            ref={ref}
            onClick={() => onOpen(project)}
            className={`
                group cursor-pointer
                transform transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
            `}
            style={{
                transitionDelay: `${index * 100}ms`,
            }}
        >
        <div className="relative aspect-square overflow-hidden bg-slate-800 rounded-xl">
            <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
        </div>

        <div className="mt-4">
            <h3 className="text-lg font-sans text-black text-white mb-2">
            {project.title}
            </h3>
            <div className="line-divider"></div>
            <p className="text-sm text-slate-400 mt-2 capitalize">
            {project.client} · {project.category}
            </p>
        </div>
        </div>
    )
}
