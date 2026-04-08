import { Hero } from "@/components/hero"
import { Skills } from "@/components/skills"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

// Configure your GitHub repositories here
const GITHUB_REPOS = [
  "https://github.com/vercel/next.js",
  "https://github.com/vercel/ai",
  "https://github.com/shadcn-ui/ui",
  "https://github.com/tailwindlabs/tailwindcss",
]

// Your GitHub username for the "View All Projects" link
const GITHUB_USERNAME = "yourusername"

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Skills />
      <Experience />
      <Projects repoUrls={GITHUB_REPOS} githubUsername={GITHUB_USERNAME} />
      <Contact />
      <Footer />
    </main>
  )
}
