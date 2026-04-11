"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

const INTRO_TEXT = "Hello World"
const TYPE_SPEED_MS = 120

export default function Home() {
  const [now, setNow] = useState<Date | null>(null)
  const [typedHello, setTypedHello] = useState("")

  useEffect(() => {
    setNow(new Date())
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let index = 0

    const typingTimer = window.setInterval(() => {
      index += 1
      setTypedHello(INTRO_TEXT.slice(0, index))

      if (index >= INTRO_TEXT.length) {
        window.clearInterval(typingTimer)
      }
    }, TYPE_SPEED_MS)

    return () => window.clearInterval(typingTimer)
  }, [])

  const timeLabel = useMemo(
    () =>
      now
        ? now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
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
              {typedHello.length < INTRO_TEXT.length && <span className="animate-pulse">|</span>}
            </div>
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
