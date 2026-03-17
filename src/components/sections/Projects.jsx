import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { projects } from "../../data/projectsData"
import ProjectCard from "../ui/ProjectCard"
import ProjectModal from "../ui/ProjectModal"

export default function Projects() {
  const { t } = useTranslation()
  const categories = ["branding", "web", "email"]

  const [activeFilters, setActiveFilters] = useState(["all"])
  const [activeProject, setActiveProject] = useState(null)

  const filterRefs = useRef({})
  const [underlineStyle, setUnderlineStyle] = useState({})

  const toggleFilter = (filter) => {
    if (filter === "all") {
      setActiveFilters(["all"])
      return
    }

    let updated = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters.filter(f => f !== "all"), filter]

    if (updated.length === categories.length || updated.length === 0) {
      updated = ["all"]
    }

    setActiveFilters(updated)
  }

  const filteredProjects = activeFilters.includes("all")
    ? projects
    : projects.filter(p => activeFilters.includes(p.category))

  useEffect(() => {
    const active = activeFilters.includes("all") ? "all" : activeFilters[0]
    const el = filterRefs.current[active]
    if (el) {
      setUnderlineStyle({ width: el.offsetWidth, left: el.offsetLeft })
    }
  }, [activeFilters])

  return (
    <section id="projects" className="bg-slate-900 py-16 md:py-32 px-6 md:px-16 scroll-mt-20">

      <div className="mb-16 text-center">
        <div className="hero-eyebrow text-neutral-400">{t("projects.eyebrow")}</div>
        <h2 className="font-elegant text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-8 text-white">
          {t("projects.headline")}
        </h2>
        <div className="text-sm md:text-base lg:text-lg leading-relaxed text-neutral-200 space-y-6">
          <p>{t("projects.p1")}</p>
          <p>{t("projects.p2")}</p>
        </div>
        
      </div>

      {/* FILTERS */}
      <div className="flex justify-center mb-16">
        <div className="relative flex gap-10 text-sm uppercase tracking-wide">

          <span
            ref={el => (filterRefs.current["all"] = el)}
            onClick={() => toggleFilter("all")}
            className={`cursor-pointer transition ${
              activeFilters.includes("all") ? "text-white" : "text-slate-500 hover:text-white"
            }`}
          >
            {t("projects.filters.all")}
          </span>

          {categories.map(cat => (
            <span
              key={cat}
              ref={el => (filterRefs.current[cat] = el)}
              onClick={() => toggleFilter(cat)}
              className={`cursor-pointer transition ${
                activeFilters.includes(cat) ? "text-white" : "text-slate-500 hover:text-white"
              }`}
            >
              {t(`projects.filters.${cat}`)}
            </span>
          ))}

          <span
            className="absolute -bottom-2 h-[2px] bg-main-color transition-all duration-300 ease-out"
            style={underlineStyle}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={setActiveProject}
            />
          ))}
        </div>
      </div>

      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </section>
  )
}
