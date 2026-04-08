import { Hero } from "@/components/hero"
import { Skills } from "@/components/skills"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

// Configure your GitHub repositories here
// Each repo can have optional manual overrides for description and languages
const GITHUB_REPOS = [
  {
    url: "https://github.com/jonasjus/Tetris",
    // Uncomment and customize these to override GitHub data:
    // description: "A custom description for this project",
    // languages: ["Python", "Pygame", "AI"],
  },
]

// Your GitHub username for the "View All Projects" link
const GITHUB_USERNAME = "jonasjus"

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Skills />
      <Experience />
      <Projects repos={GITHUB_REPOS} githubUsername={GITHUB_USERNAME} />
      <Contact />
      <Footer />
    </main>
  )
}
