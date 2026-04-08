import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  language: string | null
  languages_url: string
}

interface ProjectData {
  title: string
  description: string
  github: string
  demo: string | null
  stars: number
  forks: number
  technologies: string[]
}

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname !== "github.com") return null
    
    const parts = urlObj.pathname.split("/").filter(Boolean)
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] }
    }
    return null
  } catch {
    return null
  }
}

async function fetchRepoData(owner: string, repo: string): Promise<ProjectData | null> {
  try {
    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-Website",
    }
    
    // Add GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers, next: { revalidate: 3600 } } // Cache for 1 hour
    )

    if (!repoResponse.ok) {
      console.error(`GitHub API error: ${repoResponse.status}`)
      return null
    }

    const repoData: GitHubRepo = await repoResponse.json()

    // Fetch languages for better tech stack info
    let languages: string[] = []
    try {
      const langResponse = await fetch(repoData.languages_url, { 
        headers, 
        next: { revalidate: 3600 } 
      })
      if (langResponse.ok) {
        const langData = await langResponse.json()
        languages = Object.keys(langData).slice(0, 4) // Top 4 languages
      }
    } catch {
      // Fallback to topics if languages fail
    }

    // Combine languages and topics for technologies
    const technologies = languages.length > 0 
      ? languages 
      : repoData.topics?.slice(0, 4) || (repoData.language ? [repoData.language] : [])

    return {
      title: formatRepoName(repoData.name),
      description: repoData.description || "No description available.",
      github: repoData.html_url,
      demo: repoData.homepage || null,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      technologies,
    }
  } catch (error) {
    console.error(`Error fetching repo ${owner}/${repo}:`, error)
    return null
  }
}

function formatRepoName(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json()

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "Please provide an array of GitHub repository URLs" },
        { status: 400 }
      )
    }

    if (urls.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 repositories allowed per request" },
        { status: 400 }
      )
    }

    const projects: ProjectData[] = []

    for (const url of urls) {
      const parsed = parseGitHubUrl(url)
      if (!parsed) {
        console.warn(`Invalid GitHub URL: ${url}`)
        continue
      }

      const projectData = await fetchRepoData(parsed.owner, parsed.repo)
      if (projectData) {
        projects.push(projectData)
      }
    }

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      { error: "Failed to fetch repository data" },
      { status: 500 }
    )
  }
}
