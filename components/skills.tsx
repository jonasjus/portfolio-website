"use client"

import { motion } from "framer-motion"

const skillCategories = [
  {
    category: "Languages",
    skills: [
      { name: "Python", experience: 4 },
      { name: "SQL", experience: 4 },
      { name: "Java", experience: 4 },
    ],
  },
  {
    category: "Machine Learning",
    skills: [
      { name: "PyTorch", experience: 3 },
      { name: "Scikit-learn", experience: 3 },

    ],
  },
  {
    category: "Data Tools",
    skills: [
      { name: "Pandas", experience: 4 },
      { name: "NumPy", experience: 4 },
    ],
  },
  {
    category: "Other",
    skills: [
      { name: "Git", experience: 4 },
      { name: "Agile Methodologies", experience: 3 },
      { name: "Agentic Coding", experience: 3 },
    ],
  },
]

const MAX_EXPERIENCE_DOTS = 4

export function Skills() {
  return (
    <section id="about" className="py-24 px-6">
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
              Skills & Expertise
            </h2>
          </div>
          
          {/* Skills Grid */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skillCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-medium text-foreground">
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skill.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{skill.name}</span>
                          <div className="flex items-center gap-1" aria-label={`${skill.experience} out of ${MAX_EXPERIENCE_DOTS} experience dots`}>
                            {Array.from({ length: MAX_EXPERIENCE_DOTS }).map((_, dotIndex) => {
                              const isFilled = dotIndex < skill.experience
                              return (
                                <motion.span
                                  key={`${skill.name}-${dotIndex}`}
                                  className={`h-2.5 w-2.5 rounded-full ${isFilled ? "bg-primary" : "bg-secondary"}`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{
                                    duration: 0.25,
                                    delay: categoryIndex * 0.1 + skillIndex * 0.05 + dotIndex * 0.03,
                                  }}
                                />
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
