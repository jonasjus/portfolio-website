"use client"

import { motion } from "framer-motion"
import { BookOpen, Clock, CheckCircle2 } from "lucide-react"

interface Course {
  name: string
  description?: string
}

interface Semester {
  number: number
  period: string // e.g., "Fall 2023"
  courses: Course[]
  isCurrent?: boolean
}

interface StudiesTimelineProps {
  semesters: Semester[]
  degree?: string
  university?: string
}

export function StudiesTimeline({ 
  semesters, 
  degree = "Bachelor of Science",
  university = "University Name"
}: StudiesTimelineProps) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Academic Journey
          </h1>
          <p className="text-primary font-medium text-lg mb-2">{degree}</p>
          <p className="text-muted-foreground">{university}</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

          {semesters.map((semester, semesterIndex) => (
            <motion.div
              key={semester.number}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: semesterIndex * 0.1 }}
              className={`relative mb-12 md:mb-16 ${
                semesterIndex % 2 === 0 
                  ? "md:pr-[50%] md:text-right" 
                  : "md:pl-[50%] md:ml-auto"
              }`}
            >
              {/* Timeline node */}
              <div 
                className={`absolute left-0 md:left-1/2 top-0 w-4 h-4 rounded-full border-2 -translate-x-1/2 ${
                  semester.isCurrent 
                    ? "bg-primary border-primary animate-pulse" 
                    : "bg-background border-primary"
                }`}
              />

              {/* Content card */}
              <div 
                className={`ml-8 md:ml-0 ${
                  semesterIndex % 2 === 0 ? "md:mr-12" : "md:ml-12"
                }`}
              >
                {/* Semester header */}
                <div className={`flex items-center gap-3 mb-4 ${
                  semesterIndex % 2 === 0 ? "md:justify-end" : ""
                }`}>
                  {semester.isCurrent ? (
                    <Clock className="w-4 h-4 text-primary" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                  <span className="text-xs tracking-widest text-muted-foreground uppercase">
                    {semester.period}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-4">
                  Semester {semester.number}
                  {semester.isCurrent && (
                    <span className="ml-3 text-xs font-normal text-primary bg-primary/10 px-2 py-1 rounded">
                      In Progress
                    </span>
                  )}
                </h3>

                {/* Courses */}
                <div className="space-y-3">
                  {semester.courses.map((course, courseIndex) => (
                    <motion.div
                      key={courseIndex}
                      initial={{ opacity: 0, x: semesterIndex % 2 === 0 ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: semesterIndex * 0.1 + courseIndex * 0.05 }}
                      className={`group p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 ${
                        semesterIndex % 2 === 0 ? "md:text-left" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-4 h-4 text-primary mt-1 shrink-0" />
                        <div>
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                            {course.name}
                          </h4>
                          {course.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {course.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Future indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: semesters.length * 0.1 }}
            className="relative"
          >
            <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 rounded-full border-2 border-dashed border-muted-foreground -translate-x-1/2" />
            <p className="ml-8 md:ml-0 md:text-center text-sm text-muted-foreground pt-1">
              More to come...
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
