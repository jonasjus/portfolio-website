"use client"

import { motion } from "framer-motion"

const skillCategories = [
  {
    category: "Languages & Frameworks",
    skills: [
      { name: "Python", level: 95 },
      { name: "R", level: 85 },
      { name: "SQL", level: 90 },
      { name: "JavaScript", level: 75 },
    ],
  },
  {
    category: "Machine Learning",
    skills: [
      { name: "TensorFlow", level: 88 },
      { name: "PyTorch", level: 82 },
      { name: "Scikit-learn", level: 92 },
      { name: "Hugging Face", level: 78 },
    ],
  },
  {
    category: "Data Tools",
    skills: [
      { name: "Pandas", level: 95 },
      { name: "NumPy", level: 92 },
      { name: "Spark", level: 70 },
      { name: "Tableau", level: 80 },
    ],
  },
  {
    category: "Cloud & DevOps",
    skills: [
      { name: "AWS", level: 75 },
      { name: "Docker", level: 72 },
      { name: "Git", level: 88 },
      { name: "MLflow", level: 68 },
    ],
  },
]

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
                          <span className="text-muted-foreground font-mono">{skill.level}%</span>
                        </div>
                        <div className="h-1 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1,
                              delay: categoryIndex * 0.1 + skillIndex * 0.05,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
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
