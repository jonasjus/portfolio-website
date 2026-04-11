import { Hero } from "@/components/hero"
import { Skills } from "@/components/skills"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Configure your projects here
// url is optional; without it, the project is shown as a manual entry
// Each repo can have optional manual overrides for title, inProgress, description and languages
const GITHUB_REPOS = [
  {
    url: "https://github.com/jonasjus/webathon",
    title: "Webathon 2026 - Venue",
    inProgress: false,
    description: "",
  },
  {
    url: "",
    title: "Decoder-only Model for Text Generation",
    inProgress: true,
    description: "Implementing a decoder-only transformer model to generate coherent text based on a given prompt. The project includes data preprocessing, model architecture design, training, and evaluation using Python and PyTorch.",
    languages: ["Python", "Pytorch", "Transformers"],
  },
  {
    url: "",
    title: "Encoder-only Model for Movie Review Sentiment Classification",
    inProgress: true,
    description: "Implementing an encoder-only transformer model to classify movie reviews as positive or negative. The project involves data preprocessing, model architecture design, training, and evaluation using Python and PyTorch.",
    languages: ["Python", "Pytorch", "Transformers"],
  },
  {
    url: "",
    title: "Object detection with CNN",
    description: "Implemented a convolutional neural network for digit recognition using Python and TensorFlow.",
    languages: ["Python", "Pytorch", "CNN"],
  },
  {
    url: "https://github.com/jonasjus/StarJump",
    description: "Developed a 2D platformer game in Java, I worked on game mechanics such as character movement, enemy AI and level loader. Worked in a team of 6 using Git and Agile methodologies.",
    languages: ["Java", "Maven", "Agile", "Git teamwork"],
  }
]

// Your GitHub username for the "View All Projects" link
const GITHUB_USERNAME = "jonasjus"

export default function PortfolioPage() {
  return (
    <main className="relative">
      <div className="fixed top-6 left-6 z-20">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Home
        </Link>
      </div>
      <Hero />
      <Skills />
      <Experience />
      <Projects repos={GITHUB_REPOS} githubUsername={GITHUB_USERNAME} />
      <Contact />
      <Footer />
    </main>
  )
}
