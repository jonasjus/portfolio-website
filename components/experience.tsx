"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const experiences = [
  {
    period: "2024 — PRESENT",
    title: "Data Science Intern",
    company: "TechVentures AI",
    url: "https://example.com",
    description:
      "Building machine learning models for predictive analytics and customer segmentation. Developing automated data pipelines and creating interactive dashboards for stakeholder reporting.",
    skills: ["Python", "TensorFlow", "SQL", "Tableau"],
  },
  {
    period: "2023 — 2024",
    title: "Research Assistant",
    company: "University ML Lab",
    url: "https://example.com",
    description:
      "Conducted research on deep learning architectures for natural language processing. Published findings on transformer models for sentiment analysis in academic journals.",
    skills: ["PyTorch", "NLP", "Research", "LaTeX"],
  },
  {
    period: "2022 — 2023",
    title: "Data Analyst",
    company: "DataDriven Co",
    url: "https://example.com",
    description:
      "Performed statistical analysis on large datasets to identify business trends. Created automated reporting solutions and improved data quality processes.",
    skills: ["R", "Excel", "Power BI", "Statistics"],
  },
]

export function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row lg:gap-16"
        >
          {/* Section Title - Hidden on large screens since navigation handles it */}
          <div className="lg:w-1/3 mb-8 lg:mb-0">
            <h2 className="text-xs tracking-widest text-muted-foreground uppercase lg:sticky lg:top-24">
              Experience
            </h2>
          </div>
          
          {/* Experience Cards */}
          <div className="lg:w-2/3 space-y-12">
            {experiences.map((exp, index) => (
              <motion.article
                key={exp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <a
                  href={exp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 -mx-6 rounded-lg transition-all duration-300 hover:bg-card/50"
                >
                  <div className="flex flex-col md:flex-row md:gap-6">
                    <span className="text-xs text-muted-foreground font-mono mb-2 md:mb-0 md:w-32 flex-shrink-0">
                      {exp.period}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-foreground font-medium mb-1 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                        {exp.title} · {exp.company}
                        <ExternalLink className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-primary/10 text-primary border-0 text-xs font-medium"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
