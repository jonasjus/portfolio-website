import { StudiesTimeline } from "@/components/studies-timeline"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { link } from "fs"

// Configure your semesters and courses here
// Add `link` on a semester to make all cards in that semester clickable.
// Add `link` on a course to override the semester link for that card.
const SEMESTERS = [
    {
        number: 1,
        period: "Fall 2023",
        courses: [
            { name: "Introduction to Programming", description: "Introduction to Programming", link: "https://www4.uib.no/studier/emner/inf100" },
            { name: "Calculus I", description: "Calculus I", link: "https://www4.uib.no/studier/emner/mat111" },
            { name: "Introduction to Cybersecurity", description: "Introduction to Cybersecurity", link: "https://www4.uib.no/studier/emner/inf140" },
        ],
    },
    {
        number: 2,
        period: "Spring 2024",
        courses: [
            { name: "Object-Oriented Programming", description: "Principles and practices of object-oriented design and programming", link: "https://www4.uib.no/studier/emner/inf101" },
            { name: "Linear Algebra", description: "Vectors, matrices, and linear transformations", link: "https://www4.uib.no/studier/emner/mat112" },
            { name: "Discrete Structures", description: "Logic, combinatorics, and graph theory", link: "https://www4.uib.no/studier/emner/mnf130" },
        ],
    },
    {
        number: 3,
        period: "Fall 2024",
        courses: [
            { name: "Basic Course in Statistics", description: "Introduction to probability and statistical inference", link: "https://www4.uib.no/studier/emner/stat110" },
            { name: "Introduction to Data Science", description: "Data Preparation, modeling and analysis", link: "https://www4.uib.no/studier/emner/inf165" },
            { name: "Algorithms, Data Structures and Programming", description: "Solved problems by utilizing various algorithms and focused on optimization", link: "https://www4.uib.no/studier/emner/inf102" },
        ],
    },
    {
        number: 4,
        period: "Spring 2025",
        courses: [
            { name: "Applied Statistics", description: "Application of statistical methods to real-world problems", link: "https://www4.uib.no/studier/emner/stat200" },
            { name: "Databases and modelling", description: "Create and normalize database schemas, and implement databases into applications", link: "https://www4.uib.no/studier/emner/inf115" },
            { name: "Introduction to Systems Development", description: "Produce a software system from concept to deployment working in a team and utilizing AGILE methodologies", link: "https://www4.uib.no/studier/emner/inf112" },
        ],
    },
    {
        number: 5,
        period: "Fall 2025",
        courses: [
            { name: "Signal and Systems Analysis", description: "Analysis of signals and systems in engineering applications", link: "https://www4.uib.no/studier/emner/phys116" },
            { name: "Innovation by Design Thinking", description: "Creative problem-solving and innovation methodologies", link: "https://www4.uib.no/studier/emner/innov210" },
            { name: "Modelling and Optimization", description: "Mathematical modelling and optimization techniques", link: "https://www4.uib.no/studier/emner/inf170" },
        ],
    },
    {
        number: 6,
        period: "Spring 2026",
        isCurrent: true,
        courses: [
            { name: "Foundations of data-oriented visual computing", description: "Real world applications of data-oriented visual computing", link: "https://www4.uib.no/studier/emner/inf250" },
            { name: "Deep Learning", description: "Neural network architectures and training methods", link: "https://www4.uib.no/studier/emner/inf265" },
            { name: "Examen Philosophicum", description: "Studying the ethics of science practice and communication", link: "https://www4.uib.no/studier/emner/exphil-mnsem" },
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
                        href="/portfolio"
                        className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                        Back to Portfolio
                    </Link>
                </div>

                <StudiesTimeline
                    semesters={SEMESTERS}
                    degree="M.Sc. in Data Science"
                    university="University of Bergen"
                />
            </div>
        </main>
    )
}
