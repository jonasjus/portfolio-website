"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"

const INTRO_TEXT = "Hello"
const TYPE_SPEED_MS = 120
const DELETE_SPEED_MS = 80
const HOLD_BEFORE_DELETE_MS = 2000
const HELLO_TRANSLATIONS = ["Hola", "Bonjour", "Ciao", "Hallo", "Hej", "안녕하세요", "你好", "こんにちは", "Salaam", "Hei", "مرحبا", "Zdravo"]

export default function Home() {
  const [now, setNow] = useState<Date | null>(null)
  const [typedHello, setTypedHello] = useState("")
  const typedHelloRef = useRef(typedHello)

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
