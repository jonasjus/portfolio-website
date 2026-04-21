"use client"

import Link from "next/link"
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const INTRO_TEXT = "Hello"
const TYPE_SPEED_MS = 120
const DELETE_SPEED_MS = 80
const HOLD_BEFORE_DELETE_MS = 2000
const HELLO_TRANSLATIONS = ["Hola", "Bonjour", "Ciao", "Hallo", "Hej", "안녕하세요", "你好", "こんにちは", "Salaam", "Hei", "مرحبا", "Zdravo"]

const SEARCH_ENGINES = {
  duckduckgo: {
    label: "DuckDuckGo",
    buildUrl: (query: string) => `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
  },
  google: {
    label: "Google",
    buildUrl: (query: string) => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  },
} as const

type SearchEngine = keyof typeof SEARCH_ENGINES

function EngineLogo({ engine }: { engine: SearchEngine }) {
  if (engine === "duckduckgo") {
    return (
      <span className="inline-flex size-6 items-center justify-center" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="size-6" role="img">
          {/* Red circle background */}
          <circle cx="60" cy="60" r="60" fill="#de5833" />

          {/* White duck body/face */}
          <path d="M104 41c-2.6-6.2-6.4-11.8-11.1-16.5-4.8-4.8-10.4-8.5-16.5-11.1C70 10.6 63.1 9.3 56 9.3s-13.9 1.4-20.3 4.1c-6.2 2.6-11.8 6.4-16.5 11.1C14.4 29.2 10.7 34.8 8.1 41 5.4 47.4 4 54.3 4 61.4c0 7 1.4 13.9 4.1 20.3 2.6 6.2 6.4 11.8 11.1 16.5 4.8 4.8 10.4 8.5 16.5 11.1 6.4 2.7 13.3 4.1 20.3 4.1s13.9-1.4 20.3-4.1c6.2-2.6 11.8-6.4 16.5-11.1 4.8-4.8 8.5-10.4 11.1-16.5 2.7-6.4 4.1-13.3 4.1-20.3S106.7 47.4 104 41zM67.7 108.2c-3-5.1-11-19.3-11-29.9 0-24.4 16.3-3.5 16.3-22.9 0-4.6-2.3-20.9-16.4-24.3-3.5-4.6-11.7-9-24.7-7.3 0 0 2.2.7 4.6 1.9 0 0-4.7.7-4.9 3.9 0 0 9.3-.5 14.6 1.2C34 32.6 27.6 39 28.7 50.8c1.6 16.5 8.6 45.9 11 56.2-18.5-6.7-31.8-24.4-31.8-45.3 0-26.5 21.5-48 48-48s48 21.5 48 48c0 22.7-15.6 41.7-36.2 46.5z" fill="#fff" />

          {/* Yellow beak */}
          <path d="M53.8 68.1c0-6.2 8.5-8.2 11.7-8.2 8.7 0 20.9-5.6 23.9-5.5 3.1.1 5.1 1.3 5.1 2.7 0 2.1-17.3 9.9-24 9.2-6.4-.6-7.9.1-7.9 2.7 0 2.3 4.6 4.3 9.7 4.3 7.6 0 15.1-3.4 17.3-1.8 2 1.4-5.2 6.5-13.4 6.5s-22.4-3.8-22.4-9.9z" fill="#fed30a" />

          {/* Left eye (larger) */}
          <circle cx="45.9" cy="52.6" r="3.8" fill="#2d4f8d" />
          <circle cx="47.3" cy="51.8" r="1.1" fill="#fff" />

          {/* Right eye (smaller) */}
          <circle cx="70.5" cy="50.8" r="3.3" fill="#2d4f8d" />
          <circle cx="71.7" cy="50" r="1" fill="#fff" />

          {/* Green bow tie */}
          <path d="M50.9 91.6c-1.6-1-8-4.4-11.4-5.3-1.5 1.7-8.1 5.6-10.7 4.9-1.5-.9-1.8-12.6-1.5-15.5.1-2.2 7.7 1.3 11.4 3.1 1.4-1.5 7.4-2.1 7.7-1.2.1.2.2.6.3 1 3.3-1.7 8.6-5.3 10.2-5.8 2-.5 2.3 14.8.6 15.3-1.3.5-7.6-2.6-10.5-3.7-.1.2-.2.4-.4.5-1.3.9-5 1.3-7-.3z" fill="#67bd47" />
</svg>
      </span>
    )
  }

  if (engine === "google") {
    return (
      <span className="inline-flex size-6 items-center justify-center" aria-hidden="true">
        <svg viewBox="0 0 256 256" className="size-6" role="img">
          <path d="M255.878,133.451 C255.878,122.717 255.007,114.884 253.122,106.761 L130.55,106.761 L130.55,155.209 L202.497,155.209 C201.047,167.249 193.214,185.381 175.807,197.565 L175.563,199.187 L214.318,229.21 L217.003,229.478 C241.662,206.704 255.878,173.196 255.878,133.451" fill="#4285F4" />

          <path d="M130.55,261.1 C165.798,261.1 195.389,249.495 217.003,229.478 L175.807,197.565 C164.783,205.253 149.987,210.62 130.55,210.62 C96.027,210.62 66.726,187.847 56.281,156.37 L54.75,156.5 L14.452,187.687 L13.925,189.152 C35.393,231.798 79.49,261.1 130.55,261.1" fill="#34A853" />

          <path d="M56.281,156.37 C53.525,148.247 51.93,139.543 51.93,130.55 C51.93,121.556 53.525,112.853 56.136,104.73 L56.063,103 L15.26,71.312 L13.925,71.947 C5.077,89.644 0,109.517 0,130.55 C0,151.583 5.077,171.455 13.925,189.152 L56.281,156.37" fill="#FBBC05" />

          <path d="M130.55,50.479 C155.064,50.479 171.6,61.068 181.029,69.917 L217.873,33.943 C195.245,12.91 165.798,0 130.55,0 C79.49,0 35.393,29.301 13.925,71.947 L56.136,104.73 C66.726,73.253 96.027,50.479 130.55,50.479" fill="#EB4335" />
        </svg>
      </span>
    )
  }
}

export default function Home() {
  const [now, setNow] = useState<Date | null>(null)
  const [typedHello, setTypedHello] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchEngine, setSearchEngine] = useState<SearchEngine>("duckduckgo")
  const typedHelloRef = useRef(typedHello)

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) {
      return
    }

    window.location.href = SEARCH_ENGINES[searchEngine].buildUrl(trimmedQuery)
  }

  useEffect(() => {
    typedHelloRef.current = typedHello
  }, [typedHello])

  useEffect(() => {
    document.title = "Welcome | J. Justesen"
  }, [])

  useEffect(() => {
    setNow(new Date())
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let isActive = true
    const intervalIds: number[] = []
    const timeoutIds: number[] = []

    const typeText = (text: string, speed: number, onDone?: () => void) => {
      let index = 0
      const intervalId = window.setInterval(() => {
        if (!isActive) {
          window.clearInterval(intervalId)
          return
        }

        index += 1
        const nextText = text.slice(0, index)
        typedHelloRef.current = nextText
        setTypedHello(nextText)

        if (index >= text.length) {
          window.clearInterval(intervalId)
          onDone?.()
        }
      }, speed)

      intervalIds.push(intervalId)
    }

    const deleteText = (speed: number, onDone?: () => void) => {
      const intervalId = window.setInterval(() => {
        if (!isActive) {
          window.clearInterval(intervalId)
          return
        }

        const previous = typedHelloRef.current
        if (previous.length <= 1) {
          typedHelloRef.current = ""
          setTypedHello("")
          window.clearInterval(intervalId)
          onDone?.()
          return
        }

        const nextText = previous.slice(0, -1)
        typedHelloRef.current = nextText
        setTypedHello(nextText)
      }, speed)

      intervalIds.push(intervalId)
    }

    const runRandomCycle = () => {
      if (!isActive) {
        return
      }

      const randomGreeting =
        HELLO_TRANSLATIONS[Math.floor(Math.random() * HELLO_TRANSLATIONS.length)]

      typeText(randomGreeting, TYPE_SPEED_MS, () => {
        const holdRandomTimeoutId = window.setTimeout(() => {
          deleteText(DELETE_SPEED_MS, runRandomCycle)
        }, HOLD_BEFORE_DELETE_MS)

        timeoutIds.push(holdRandomTimeoutId)
      })
    }

    typeText(INTRO_TEXT, TYPE_SPEED_MS, () => {
      const holdHelloTimeoutId = window.setTimeout(() => {
        deleteText(DELETE_SPEED_MS, runRandomCycle)
      }, HOLD_BEFORE_DELETE_MS)

      timeoutIds.push(holdHelloTimeoutId)
    })

    return () => {
      isActive = false
      intervalIds.forEach((id) => window.clearInterval(id))
      timeoutIds.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  const timeLabel = useMemo(
    () =>
      now
        ? now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
        : "--:--:--",
    [now]
  )

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center px-6 py-8">
        <div className="flex w-full flex-1 items-center justify-center">
          <div className="relative w-full text-center">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[110%] text-6xl font-mono tracking-widest sm:text-8xl md:text-9xl">
              {timeLabel}
            </div>
            <div className="text-4xl font-medium tracking-wide sm:text-5xl">
              {typedHello}
              <span className="animate-pulse">|</span>
            </div>
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto mt-8 flex w-full max-w-xl items-center gap-2 px-2"
            >
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={`Search with ${SEARCH_ENGINES[searchEngine].label}`}
                aria-label={`Search with ${SEARCH_ENGINES[searchEngine].label}`}
                className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-base outline-none transition focus:border-foreground"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Select search engine"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition hover:bg-accent"
                  >
                    <EngineLogo engine={searchEngine} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="min-w-0">
                  {(Object.keys(SEARCH_ENGINES) as SearchEngine[]).map((engine) => (
                    <DropdownMenuItem
                      key={engine}
                      onClick={() => setSearchEngine(engine)}
                      className="justify-center"
                      aria-label={SEARCH_ENGINES[engine].label}
                    >
                      <EngineLogo engine={engine} />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                type="submit"
                className="h-11 rounded-full border border-border px-5 text-sm font-medium uppercase tracking-[0.12em] transition hover:bg-foreground hover:text-background"
              >
                Search
              </button>
            </form>
          </div>
        </div>
        <div className="flex items-center justify-center pb-4">
          <Link
            href="/portfolio"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] transition hover:bg-foreground hover:text-background"
          >
            Open Portfolio
          </Link>
        </div>
      </div>
    </main>
  )
}
