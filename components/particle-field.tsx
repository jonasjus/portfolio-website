"use client"

import { useEffect, useRef } from "react"

interface Neuron {
  x: number
  y: number
  activation: number
  pulsePhase: number
}

interface Synapse {
  from: number
  to: number
}

interface Pulse {
  synapse: number
  progress: number
  speed: number
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const neuronsRef = useRef<Neuron[]>([])
  const synapsesRef = useRef<Synapse[]>([])
  const pulsesRef = useRef<Pulse[]>([])
  const animationRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initNetwork = () => {
      neuronsRef.current = []
      synapsesRef.current = []

      // Create randomly distributed static neurons
      const neuronCount = Math.floor((canvas.width * canvas.height) / 25000)
      
      for (let i = 0; i < neuronCount; i++) {
        neuronsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          activation: 0,
          pulsePhase: Math.random() * Math.PI * 2,
        })
      }

      // Create synapses between nearby neurons
      const maxDistance = 250
      const neurons = neuronsRef.current

      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dx = neurons[i].x - neurons[j].x
          const dy = neurons[i].y - neurons[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDistance && Math.random() < 0.3) {
            synapsesRef.current.push({ from: i, to: j })
          }
        }
      }
    }

    const spawnPulse = () => {
      if (pulsesRef.current.length > 30) return
      if (synapsesRef.current.length === 0) return

      const synapseIndex = Math.floor(Math.random() * synapsesRef.current.length)
      
      pulsesRef.current.push({
        synapse: synapseIndex,
        progress: 0,
        speed: 0.01 + Math.random() * 0.015,
      })

      // Activate source neuron
      const synapse = synapsesRef.current[synapseIndex]
      neuronsRef.current[synapse.from].activation = 1
    }

    const draw = () => {
      timeRef.current += 0.016
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn new pulses periodically
      if (Math.random() < 0.08) spawnPulse()

      const neurons = neuronsRef.current
      const synapses = synapsesRef.current

      // Draw all synapses as faint lines
      synapses.forEach((synapse) => {
        const from = neurons[synapse.from]
        const to = neurons[synapse.to]

        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = "rgba(91, 200, 186, 0.06)"
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // Draw and update pulses
      pulsesRef.current = pulsesRef.current.filter((pulse) => {
        pulse.progress += pulse.speed

        if (pulse.progress >= 1) {
          // Activate target neuron when pulse arrives
          const synapse = synapses[pulse.synapse]
          if (synapse) {
            neurons[synapse.to].activation = 1
          }
          return false
        }

        const synapse = synapses[pulse.synapse]
        if (!synapse) return false

        const from = neurons[synapse.from]
        const to = neurons[synapse.to]

        const x = from.x + (to.x - from.x) * pulse.progress
        const y = from.y + (to.y - from.y) * pulse.progress

        // Bright line from source to pulse position
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(x, y)
        ctx.strokeStyle = "rgba(91, 200, 186, 0.4)"
        ctx.lineWidth = 1
        ctx.stroke()

        // Glowing pulse head
        const pulseGradient = ctx.createRadialGradient(x, y, 0, x, y, 6)
        pulseGradient.addColorStop(0, "rgba(91, 200, 186, 0.9)")
        pulseGradient.addColorStop(0.5, "rgba(91, 200, 186, 0.3)")
        pulseGradient.addColorStop(1, "rgba(91, 200, 186, 0)")

        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fillStyle = pulseGradient
        ctx.fill()

        return true
      })

      // Draw neurons (static positions)
      neurons.forEach((neuron) => {
        // Decay activation
        neuron.activation *= 0.92

        const baseSize = 3
        const glowIntensity = neuron.activation

        // Outer glow when activated
        if (glowIntensity > 0.1) {
          const glowGradient = ctx.createRadialGradient(
            neuron.x,
            neuron.y,
            0,
            neuron.x,
            neuron.y,
            baseSize + glowIntensity * 15
          )
          glowGradient.addColorStop(0, `rgba(91, 200, 186, ${glowIntensity * 0.5})`)
          glowGradient.addColorStop(0.5, `rgba(91, 200, 186, ${glowIntensity * 0.2})`)
          glowGradient.addColorStop(1, "rgba(91, 200, 186, 0)")

          ctx.beginPath()
          ctx.arc(neuron.x, neuron.y, baseSize + glowIntensity * 15, 0, Math.PI * 2)
          ctx.fillStyle = glowGradient
          ctx.fill()
        }

        // Core neuron (always visible, brighter when activated)
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, baseSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(91, 200, 186, ${0.3 + glowIntensity * 0.7})`
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    resizeCanvas()
    initNetwork()
    draw()

    window.addEventListener("resize", () => {
      resizeCanvas()
      initNetwork()
    })

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
