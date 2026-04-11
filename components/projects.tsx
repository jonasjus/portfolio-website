"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Github, Star, GitFork, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ProjectData {
  title: string
  description: string
  github: string
  demo: string | null
  stars: number
  forks: number
  technologies: string[]
  inProgress?: boolean
}

interface RepoConfig {
  /** Optional GitHub repository URL */
  url?: string
  /** Optional custom title (overrides GitHub repository name) */
  title?: string
  /** Optional project status tag */
  inProgress?: boolean
  /** Optional custom description (overrides GitHub description) */
  description?: string
  /** Optional custom languages/technologies (overrides GitHub languages) */
  languages?: string[]
}

interface ProjectsProps {
  /** Array of GitHub repository configs to fetch and display */
  repos: RepoConfig[]
  /** GitHub username for the "View All" link */
  githubUsername?: string
}

export function Projects({ repos, githubUsername }: ProjectsProps) {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

          // Apply manual overrides for title, description and languages
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

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row lg:gap-16"
        >
          {/* Section Title */}
          <div className="lg:w-1/3 mb-8 lg:mb-0">
            <h2 className="text-xs tracking-widest text-muted-foreground uppercase lg:sticky lg:top-24">
              Projects
            </h2>
          </div>

          {/* Project Cards */}
          <div className="lg:w-2/3 space-y-8">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="ml-3 text-muted-foreground">Loading projects...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {!loading && !error && projects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No projects to display.</p>
              </div>
            )}

            {!loading &&
              !error &&
              projects.map((project, index) => (
                <motion.div
                  key={project.github || `${project.title}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group bg-transparent border-border/50 hover:border-primary/30 hover:bg-card/30 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="text-foreground font-medium text-lg group-hover:text-primary transition-colors duration-300">
                              {project.title}
                            </h3>
                            {project.inProgress && (
                              <span className="text-xs font-normal text-primary bg-primary/10 px-2 py-1 rounded">
                                In Progress
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                                aria-label={`${project.title} GitHub Repository`}
                              >
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                            {project.demo && (
                              <a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                                aria-label={`${project.title} Live Demo`}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {project.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="bg-primary/10 text-primary border-0 text-xs font-medium"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {project.stars.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitFork className="w-3 h-3" />
                              {project.forks.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

            {/* View All Link */}
            {githubUsername && (
              <motion.a
                href={`https://github.com/${githubUsername}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors duration-300 group"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                View Full Project Archive
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
