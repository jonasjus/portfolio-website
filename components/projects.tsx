"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink, Github, GitFork, Loader2, Sparkles, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

interface ProjectData {
  title: string
  description: string
  github: string
  demo: string | null
  image?: string
  stars: number
  forks: number
  technologies: string[]
  inProgress?: boolean
}

interface RepoConfig {
  url?: string
  title?: string
  inProgress?: boolean
  description?: string
  languages?: string[]
  image?: string
}

interface ProjectsProps {
  repos: RepoConfig[]
  githubUsername?: string
}

export function Projects({ repos, githubUsername }: ProjectsProps) {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null)
  const [modalImageAspectRatio, setModalImageAspectRatio] = useState<number | null>(null)

  useEffect(() => {
    if (!api) {
      return
    }

    const updateActiveIndex = () => {
      setActiveIndex(api.selectedScrollSnap())
    }

    updateActiveIndex()
    api.on("select", updateActiveIndex)
    api.on("reInit", updateActiveIndex)

    return () => {
      api.off("select", updateActiveIndex)
      api.off("reInit", updateActiveIndex)
    }
  }, [api])

  useEffect(() => {
    if (projects.length === 0) {
      setActiveIndex(0)
      return
    }

    if (activeIndex >= projects.length) {
      setActiveIndex(0)
      api?.scrollTo(0)
    }
  }, [activeIndex, api, projects.length])

  useEffect(() => {
    if (selectedProjectIndex !== null && selectedProjectIndex >= projects.length) {
      setSelectedProjectIndex(null)
    }
  }, [projects.length, selectedProjectIndex])

  useEffect(() => {
    async function fetchProjects() {
      if (repos.length === 0) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const reposWithUrl = repos.filter((repo) => Boolean(repo.url?.trim()))
        const manualProjects: ProjectData[] = repos
          .filter((repo) => !repo.url?.trim())
          .map((repo) => ({
            title: repo.title ?? "Untitled Project",
            description: repo.description ?? "No description available.",
            github: "",
            demo: null,
            image: repo.image,
            stars: 0,
            forks: 0,
            technologies: repo.languages ?? [],
            inProgress: repo.inProgress ?? false,
          }))

        let fetchedProjects: ProjectData[] = []
        if (reposWithUrl.length > 0) {
          const urls = reposWithUrl.map((repo) => repo.url as string)
          const response = await fetch("/api/github", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urls }),
          })

          if (!response.ok) {
            throw new Error("Failed to fetch projects")
          }

          const data = await response.json()

          fetchedProjects = data.projects.map((project: ProjectData) => {
            const repoConfig = reposWithUrl.find((repo) =>
              project.github.includes((repo.url as string).replace("https://github.com/", ""))
            )

            if (repoConfig) {
              return {
                ...project,
                title: repoConfig.title ?? project.title,
                description: repoConfig.description ?? project.description,
                technologies: repoConfig.languages ?? project.technologies,
                image: repoConfig.image,
                inProgress: repoConfig.inProgress ?? false,
              }
            }

            return {
              ...project,
              inProgress: false,
            }
          })
        }

        setProjects([...manualProjects, ...fetchedProjects])
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError("Failed to load projects. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [repos])

  const selectedProject =
    selectedProjectIndex !== null ? projects[selectedProjectIndex] ?? null : null

  useEffect(() => {
    setModalImageAspectRatio(null)
  }, [selectedProject?.image])

  const handleIndexBarClick = (index: number) => {
    if (api) {
      api.scrollTo(index)
      return
    }

    // Fallback keeps UI state responsive if carousel API isn't ready yet.
    setActiveIndex(index)
  }

  return (
    // Change 1 & 3: Section is now full-width (90vw) and uses a column layout
    // so the "PROJECTS" header sits directly above the carousel.
    <section id="projects" className="py-24 px-6">
      {/* Header row: matches Skills' max-w-5xl container and lg:w-1/3 column */}
      <div className="max-w-5xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row lg:gap-16"
        >
          <div className="lg:w-1/3">
            <h2 className="text-xs tracking-widest text-muted-foreground uppercase lg:sticky lg:top-24">
              Projects
            </h2>
          </div>
        </motion.div>
      </div>

      {/* Carousel: 90vw full-width below the header */}
      <div className="mx-auto w-[90vw]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8"
        >
          {/* Carousel area — full width of the 90vw container */}
          <div className="w-full space-y-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading projects...</span>
              </div>
            )}

            {error && (
              <div className="py-12 text-center">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {!loading && !error && projects.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No projects to display.</p>
              </div>
            )}

            {!loading && !error && projects.length > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative rounded-[2rem]">
                    <Carousel
                      setApi={setApi}
                      opts={{ align: "center", loop: projects.length > 1 }}
                      className="relative w-full [perspective:1400px]"
                    >
                      <div
                        className="overflow-hidden"
                        style={{
                          WebkitMaskImage:
                            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                          maskImage:
                            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                        }}
                      >
                        <CarouselContent className="-ml-3 items-stretch">
                          {projects.map((project, slideIndex) => {
                            const isActive = slideIndex === activeIndex
                            const isNeighbor = Math.abs(slideIndex - activeIndex) === 1

                            return (
                              <CarouselItem
                                key={project.github || `${project.title}-${slideIndex}`}
                                // Change 1: Each card takes ~40% width so side cards are visible at full size
                                className="basis-full pl-3 sm:basis-[80%] lg:basis-[40%]"
                              >
                                <motion.div
                                  animate={{
                                    scale: isActive ? 1 : 0.95,
                                    rotateY: isActive ? 0 : slideIndex < activeIndex ? 10 : -10,
                                    rotateX: isActive ? 0 : 2,
                                    y: isActive ? 0 : 16,
                                    // Change 2: Neighbors are no longer blurred — only opacity/scale differ
                                    opacity: isActive ? 1 : isNeighbor ? 0.72 : 0.55,
                                    filter: "blur(0px)",
                                  }}
                                  transition={{ duration: 0.45, ease: "easeOut" }}
                                  style={{ transformStyle: "preserve-3d" }}
                                  className="h-full"
                                >
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setSelectedProjectIndex(slideIndex)}
                                    onKeyDown={(event) => {
                                      if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault()
                                        setSelectedProjectIndex(slideIndex)
                                      }
                                    }}
                                    className="group block h-full w-full cursor-pointer text-left outline-none"
                                    aria-label={`Open details for ${project.title}`}
                                  >
                                    <Card
                                      className={
                                        "h-full overflow-hidden border-border/50 bg-card/40 transition-all duration-500" +
                                        (isActive
                                          ? " border-primary/35 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                                          : " border-border/30 shadow-none")
                                      }
                                    >
                                      <CardContent className="p-0">
                                        <div className="flex h-full min-h-[28rem] flex-col">
                                          <div className="relative min-h-44 border-b border-border/50 bg-gradient-to-br from-primary/20 via-card/70 to-transparent p-6 sm:min-h-52 sm:p-7">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
                                            {project.image ? (
                                              <>
                                                <Image
                                                  src={project.image}
                                                  alt={`${project.title} preview image`}
                                                  fill
                                                  className="object-cover"
                                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 40vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                                              </>
                                            ) : (
                                              <div className="absolute inset-0 z-10 flex items-center justify-center px-6 py-4 text-center sm:px-7">
                                                <div className="max-w-xs space-y-2 px-4">
                                                  <Sparkles className="mx-auto h-5 w-5 text-primary/80" />
                                                  <p className="text-sm font-medium text-foreground">
                                                    {project.title} preview image
                                                  </p>
                                                  <p className="text-sm text-muted-foreground">
                                                    Add an image path in the project config to display a featured visual.
                                                  </p>
                                                </div>
                                              </div>
                                            )}
                                          </div>

                                          <div className="flex flex-1 flex-col justify-between gap-7 p-7 sm:p-8">
                                            <div className="space-y-5">
                                              <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                                                  {project.title}
                                                </h3>
                                                {project.inProgress && (
                                                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                                                    In Progress
                                                  </span>
                                                )}
                                              </div>

                                              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                                                {project.description}
                                              </p>

                                              <div className="flex items-center gap-5 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                  <Star className="h-3 w-3" />
                                                  {project.stars.toLocaleString()}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                  <GitFork className="h-3 w-3" />
                                                  {project.forks.toLocaleString()}
                                                </span>
                                              </div>
                                            </div>

                                            <div className="space-y-5">
                                              <div className="flex flex-wrap items-center gap-2.5">
                                                {project.technologies.map((tech) => (
                                                  <Badge
                                                    key={tech}
                                                    variant="secondary"
                                                    className="border-0 bg-primary/10 text-xs font-medium text-primary"
                                                  >
                                                    {tech}
                                                  </Badge>
                                                ))}
                                              </div>

                                              <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                  {project.github && (
                                                    <a
                                                      href={project.github}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      onClick={(event) => event.stopPropagation()}
                                                      className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm text-foreground transition-colors duration-300 hover:border-primary/40 hover:text-primary"
                                                      aria-label={`${project.title} GitHub Repository`}
                                                    >
                                                      <Github className="h-4 w-4" />
                                                      Code
                                                    </a>
                                                  )}
                                                  {project.demo && (
                                                    <a
                                                      href={project.demo}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      onClick={(event) => event.stopPropagation()}
                                                      className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm text-foreground transition-colors duration-300 hover:border-primary/40 hover:text-primary"
                                                      aria-label={`${project.title} Live Demo`}
                                                    >
                                                      <ExternalLink className="h-4 w-4" />
                                                      Demo
                                                    </a>
                                                  )}
                                                </div>

                                                <div className="text-right text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                                  Click to expand
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </motion.div>
                              </CarouselItem>
                            )
                          })}
                        </CarouselContent>
                      </div>

                      <CarouselPrevious className="-left-4 h-11 w-11 border-border/60 bg-background/90 shadow-md" />
                      <CarouselNext className="-right-4 h-11 w-11 border-border/60 bg-background/90 shadow-md" />
                    </Carousel>
                  </div>
                </motion.div>

                <div className="relative z-40 mt-6 flex flex-col items-center gap-4 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    {projects.map((project, thumbIndex) => (
                      <button
                        key={project.github || `${project.title}-thumb-${thumbIndex}`}
                        type="button"
                        onClick={() => handleIndexBarClick(thumbIndex)}
                        className={
                          "h-2.5 cursor-pointer rounded-full transition-all duration-300" +
                          (thumbIndex === activeIndex
                            ? " w-8 bg-primary"
                            : " w-2.5 bg-border hover:bg-muted-foreground")
                        }
                        aria-label={`Jump to ${project.title}`}
                      />
                    ))}
                  </div>

                  <div className="text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {activeIndex + 1} / {projects.length}
                  </div>
                </div>
              </>
            )}

            {githubUsername && (
              <motion.a
                href={`https://github.com/${githubUsername}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-foreground transition-colors duration-300 hover:text-primary"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                View Full Project Archive
                <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </motion.a>
            )}

            <Dialog
              open={selectedProjectIndex !== null}
              onOpenChange={(open) => {
                if (!open) {
                  setSelectedProjectIndex(null)
                }
              }}
            >
              <DialogContent
                className="h-[calc(100vh-1rem)] max-w-[min(1100px,calc(100vw-1rem))] overflow-hidden border-border/60 bg-background/95 p-0 sm:max-w-[min(1100px,calc(100vw-2rem))]"
                showCloseButton
              >
                {selectedProject && (
                  <div className="grid h-full grid-rows-[auto_1fr]">
                    <div className="border-b border-border/60 bg-gradient-to-br from-primary/15 via-background to-transparent p-6 sm:p-8">
                      <DialogHeader className="max-w-3xl text-left">
                        <DialogTitle className="text-2xl sm:text-3xl">
                          {selectedProject.title}
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base">
                          Expanded project details with room for a larger hero image and extra context.
                        </DialogDescription>
                      </DialogHeader>
                    </div>

                    <div className="grid overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
                      <div className="border-b border-border/60 bg-card/40 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/20 via-card/80 to-transparent p-6 shadow-inner sm:p-8">
                          <div
                            className="relative w-full overflow-hidden rounded-2xl border border-border/50 bg-background/70 text-center"
                            style={{
                              aspectRatio: modalImageAspectRatio ? `${modalImageAspectRatio}` : "16 / 10",
                              minHeight: "260px",
                            }}
                          >
                            {selectedProject.image ? (
                              <>
                                <Image
                                  src={selectedProject.image}
                                  alt={`${selectedProject.title} main preview image`}
                                  fill
                                  className="object-contain"
                                  sizes="(max-width: 1024px) 100vw, 50vw"
                                  onLoadingComplete={(img) => {
                                    if (!img.naturalWidth || !img.naturalHeight) {
                                      return
                                    }

                                    const ratio = img.naturalWidth / img.naturalHeight
                                    setModalImageAspectRatio((currentRatio) => {
                                      if (currentRatio !== null && Math.abs(currentRatio - ratio) < 0.01) {
                                        return currentRatio
                                      }

                                      return ratio
                                    })
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                              </>
                            ) : (
                              <div className="absolute inset-0 items-center justify-center">
                                <div className="space-y-3 px-4 text-center">
                                  <p className="text-xl font-medium text-foreground">
                                    {selectedProject.title} preview image
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Add an image path in the project config to show a larger project visual here.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2.5">
                          {selectedProject.technologies.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="border-0 bg-primary/10 text-xs font-medium text-primary"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-6 overflow-y-auto p-6 sm:p-8">
                        <div className="space-y-6">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
                              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Stars
                              </p>
                              <p className="mt-2 text-2xl font-medium text-foreground">
                                {selectedProject.stars.toLocaleString()}
                              </p>
                            </div>
                            <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
                              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Forks
                              </p>
                              <p className="mt-2 text-2xl font-medium text-foreground">
                                {selectedProject.forks.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Overview
                            </p>
                            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                              {selectedProject.description}
                            </p>
                          </div>

                          {selectedProject.inProgress && (
                            <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                              This project is currently in progress.
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          {selectedProject.github && (
                            <a
                              href={selectedProject.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm text-foreground transition-colors duration-300 hover:border-primary/40 hover:text-primary"
                            >
                              <Github className="h-4 w-4" />
                              Open Code
                            </a>
                          )}
                          {selectedProject.demo && (
                            <a
                              href={selectedProject.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm text-foreground transition-colors duration-300 hover:border-primary/40 hover:text-primary"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Open Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </div>
    </section>
  )
}