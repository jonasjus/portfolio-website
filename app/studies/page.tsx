import { StudiesTimeline } from "@/components/studies-timeline"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Configure your semesters and courses here
const SEMESTERS = [
  {
    number: 1,
    period: "Fall 2023",
    courses: [
      { name: "INF100", description: "Introduction to Programming" },
      { name: "MAT111", description: "Calculus I" },
      { name: "INF140", description: "Introduction to Cybersecurity" },
    ],
  },
  {
    number: 2,
    period: "Spring 2024",
    courses: [
      { name: "Data Structures & Algorithms", description: "Arrays, trees, graphs, and complexity analysis" },
      { name: "Calculus II", description: "Multivariable calculus and series" },
      { name: "Probability & Statistics", description: "Probability theory and statistical inference" },
    ],
  },
  {
    number: 3,
    period: "Fall 2024",
    courses: [
      { name: "Database Systems", description: "SQL, relational models, and query optimization" },
      { name: "Machine Learning Fundamentals", description: "Supervised and unsupervised learning" },
      { name: "Discrete Mathematics", description: "Logic, combinatorics, and graph theory" },
    ],
  },
  {
    number: 4,
    period: "Spring 2025",
    courses: [
      { name: "Deep Learning", description: "Neural networks, CNNs, and RNNs" },
      { name: "Statistical Modeling", description: "Regression, GLMs, and Bayesian methods" },
      { name: "Data Visualization", description: "Principles and tools for visual analytics" },
    ],
  },
  {
    number: 5,
    period: "Fall 2025",
    courses: [
      { name: "Natural Language Processing", description: "Text processing, embeddings, and transformers" },
      { name: "Big Data Technologies", description: "Distributed computing with Spark and Hadoop" },
      { name: "Ethics in AI", description: "Fairness, accountability, and transparency" },
    ],
  },
  {
    number: 6,
    period: "Spring 2026",
    isCurrent: true,
    courses: [
      { name: "Capstone Project", description: "End-to-end ML project with industry partner" },
      { name: "Advanced Topics in ML", description: "Reinforcement learning and generative models" },
      { name: "Research Methods", description: "Scientific writing and reproducibility" },
    ],
  },
]

export default function StudiesPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="relative z-10">
        {/* Back navigation */}
        <div className="fixed top-6 left-6 z-20">
          <Link 
            href="/"
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>
        </div>

        <StudiesTimeline 
          semesters={SEMESTERS}
          degree="B.Sc. in Data Science"
          university="Your University"
        />
      </div>
    </main>
  )
}
