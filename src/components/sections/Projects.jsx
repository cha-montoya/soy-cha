import { useState, useRef, useEffect } from "react"
import { projects } from "../../data/projectsData"
import ProjectCard from "../ui/ProjectCard"
import ProjectModal from "../ui/ProjectModal"

export default function Projects() {

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

    if (updated.length === categories.length) {
      updated = ["all"]
    }

    if (updated.length === 0) {
      updated = ["all"]
    }

    setActiveFilters(updated)
  }

  const filteredProjects =
    activeFilters.includes("all")
      ? projects
      : projects.filter(project =>
          activeFilters.includes(project.category)
        )
        
        useEffect(() => {
          const active =
            activeFilters.includes("all")
              ? "all"
              : activeFilters[0]

          const el = filterRefs.current[active]

          if (el) {
            setUnderlineStyle({
              width: el.offsetWidth,
              left: el.offsetLeft,
            })
          }
        }, [activeFilters])

  return (
    <section id="projects" className="bg-slate-900 py-32 px-6 md:px-16">

      <div className="mb-16 text-center">
          <h2 className="font-display text-6xl md:text-5xl font-black tracking-tight mb-8 text-white">
            Proyectos
          </h2>
        </div>

      {/* FILTROS */}
      <div className="flex justify-center mb-16">
        <div className="relative flex gap-10 text-sm uppercase tracking-wide">

          <span
            ref={el => (filterRefs.current["all"] = el)}
            onClick={() => toggleFilter("all")}
            className={`cursor-pointer transition ${
              activeFilters.includes("all")
                ? "text-white"
                : "text-slate-500 hover:text-white"
            }`}
          >
            Todos
          </span>

          {categories.map(cat => (
            <span
              key={cat}
              ref={el => (filterRefs.current[cat] = el)}
              onClick={() => toggleFilter(cat)}
              className={`cursor-pointer transition ${
                activeFilters.includes(cat)
                  ? "text-white"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              {cat}
            </span>
          ))}

          {/* UNDERLINE */}
          <span
            className="absolute -bottom-2 h-[2px] bg-main-color transition-all duration-300 ease-out"
            style={underlineStyle}
          />

        </div>
      </div>


      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
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
