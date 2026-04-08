"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github, Star, GitFork } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const projects = [
  {
    title: "StockSense AI",
    description:
      "A machine learning system that predicts stock market trends using LSTM neural networks and sentiment analysis from financial news. Achieved 78% accuracy on backtesting data.",
    image: "/projects/stocksense.jpg",
    technologies: ["Python", "TensorFlow", "NLTK", "FastAPI"],
    github: "https://github.com",
    demo: "https://example.com",
    stars: 234,
    forks: 45,
  },
  {
    title: "DataViz Dashboard",
    description:
      "An interactive dashboard for exploring and visualizing large datasets with real-time filtering, statistical summaries, and exportable reports.",
    image: "/projects/dataviz.jpg",
    technologies: ["React", "D3.js", "Python", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://example.com",
    stars: 156,
    forks: 32,
  },
  {
    title: "ChurnPredict",
    description:
      "End-to-end ML pipeline for customer churn prediction with feature engineering, model training, and deployment. Reduced churn by 23% for pilot customers.",
    image: "/projects/churnpredict.jpg",
    technologies: ["Scikit-learn", "XGBoost", "Docker", "AWS"],
    github: "https://github.com",
    stars: 89,
    forks: 18,
  },
  {
    title: "NLP Toolkit",
    description:
      "A collection of NLP utilities for text preprocessing, named entity recognition, and text classification using modern transformer architectures.",
    image: "/projects/nlp-toolkit.jpg",
    technologies: ["Hugging Face", "PyTorch", "spaCy", "Flask"],
    github: "https://github.com",
    demo: "https://example.com",
    stars: 312,
    forks: 67,
  },
]

export function Projects() {
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
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group bg-transparent border-border/50 hover:border-primary/30 hover:bg-card/30 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-foreground font-medium text-lg group-hover:text-primary transition-colors duration-300">
                          {project.title}
                        </h3>
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
                            {project.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="w-3 h-3" />
                            {project.forks}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {/* View All Link */}
            <motion.a
              href="https://github.com"
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
          </div>
        </motion.div>
      </div>
    </section>
  )
}
