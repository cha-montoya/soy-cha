import { useEffect, useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import ProjectTimeline from "./ProjectTimeline"
import { useVisitorName } from "../../hooks/useVisitorName"

// ─── LIGHTBOX ──────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex)

  const prev = useCallback(() =>
    setCurrent((i) => (i - 1 + images.length) % images.length), [images.length])

  const next = useCallback(() =>
    setCurrent((i) => (i + 1) % images.length), [images.length])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  prev()
      if (e.key === "ArrowRight") next()
      if (e.key === "Escape")     onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prev, next, onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Main image */}
      <div
        className="relative flex items-center justify-center w-full h-full px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={current}
          src={images[current]}
          alt=""
          className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl shadow-2xl"
        />

        {/* Counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono tracking-widest">
          {current + 1} / {images.length}
        </div>

        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2
                       w-10 h-10 flex items-center justify-center
                       rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Previous image"
          >
            ←
          </button>
        )}

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2
                       w-10 h-10 flex items-center justify-center
                       rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Next image"
          >
            →
          </button>
        )}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center
                   rounded-full bg-white/10 hover:bg-white/20 text-white transition text-lg"
        aria-label="Close lightbox"
      >
        ✕
      </button>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="absolute bottom-14 left-1/2 -translate-x-1/2
                     flex gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-12 h-8 rounded overflow-hidden border-2 transition
                ${i === current
                  ? "border-white opacity-100"
                  : "border-transparent opacity-40 hover:opacity-70"}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── MODAL ─────────────────────────────────────────────────────────────────
export default function ProjectModal({ project, onClose }) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible]         = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)  // null = closed
  const { name, saveName } = useVisitorName()

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

  // Build final images array — swap index 0 for nifty if personalizedPreview
  const allImages = (project.images ?? []).map((img, i) =>
    i === 0 && project.personalizedPreview ? niftyUrl : img
  )

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-800 flex items-center justify-center">
        <div
          className={`w-full h-full bg-slate-900 overflow-y-auto transform transition-transform duration-700 ease-in-out
            ${isVisible ? "scale-y-100" : "scale-y-0"} origin-center`}
        >
          <button onClick={handleClose} className="absolute top-8 right-8 text-white z-50">✕</button>

          <div className="max-w-6xl mx-auto mt-24 p-8 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

              {/* ── INFO ── */}
              <div>
                <h2 className="text-4xl font-display font-black tracking-tight mb-2">
                  {projectData.title}
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
                    <h3 className="text-xl mb-2 font-black font-display">Stack</h3>
                    <p className="text-slate-300">{project.automation}</p>
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

              {/* ── IMAGES ── */}
              <div className="flex flex-col gap-6">

                {/* First image — full width */}
                {allImages.length > 0 && (
                  <div
                    className="overflow-hidden bg-slate-800 h-[280px] rounded-xl cursor-zoom-in"
                    onClick={() => setLightboxIndex(0)}
                  >
                    <img
                      src={allImages[0]}
                      alt=""
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 rounded-xl"
                    />
                  </div>
                )}

                {/* Rest — 2-column grid */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-2 gap-6 auto-rows-[240px]">
                    {allImages.slice(1).map((img, i) => (
                      <div
                        key={i + 1}
                        className="overflow-hidden bg-slate-800 rounded-xl cursor-zoom-in"
                        onClick={() => setLightboxIndex(i + 1)}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 rounded-xl"
                        />
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox — z-[100] sits above the modal's z-50 */}
      {lightboxIndex !== null && (
        <Lightbox
          images={allImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}