"use client"

import { useEffect, useRef } from "react"

interface Neuron {
  x: number
  y: number
  layer: number
  activation: number
}

interface Synapse {
  from: number
  to: number
  brightness: number
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

      // Neural network layer configuration - creates a large network spanning the screen
      const layers = [6, 10, 14, 18, 14, 10, 6]
      const layerSpacing = canvas.width / (layers.length + 1)
      const padding = 80

      // Create neurons in organized layers
      let neuronIndex = 0
      layers.forEach((neuronCount, layerIndex) => {
        const x = layerSpacing * (layerIndex + 1)
        const availableHeight = canvas.height - padding * 2
        const spacing = availableHeight / (neuronCount + 1)

        for (let i = 0; i < neuronCount; i++) {
          const y = padding + spacing * (i + 1)
          
          neuronsRef.current.push({
            x,
            y,
            layer: layerIndex,
            activation: 0,
          })
          neuronIndex++
        }
      })

      // Create synapses between adjacent layers
      let startIndex = 0
      for (let l = 0; l < layers.length - 1; l++) {
        const currentLayerSize = layers[l]
        const nextLayerSize = layers[l + 1]
        const nextStartIndex = startIndex + currentLayerSize

        for (let i = 0; i < currentLayerSize; i++) {
          // Connect to a subset of neurons in next layer for cleaner look
          const connections = Math.min(nextLayerSize, 4 + Math.floor(Math.random() * 3))
          const connectedIndices = new Set<number>()
          
          while (connectedIndices.size < connections) {
            connectedIndices.add(Math.floor(Math.random() * nextLayerSize))
          }

          connectedIndices.forEach((j) => {
            synapsesRef.current.push({
              from: startIndex + i,
              to: nextStartIndex + j,
              brightness: 0,
            })
          })
        }

        startIndex += currentLayerSize
      }
    }

    const spawnPulse = () => {
      if (pulsesRef.current.length > 50) return
      if (synapsesRef.current.length === 0) return

      // Pick a random synapse to fire
      const synapseIndex = Math.floor(Math.random() * synapsesRef.current.length)
      
      pulsesRef.current.push({
        synapse: synapseIndex,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012,
      })

      // Activate source neuron
      const synapse = synapsesRef.current[synapseIndex]
      neuronsRef.current[synapse.from].activation = 1
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn new pulses periodically
      if (Math.random() < 0.15) spawnPulse()

      const neurons = neuronsRef.current
      const synapses = synapsesRef.current

      // Collect active pulse positions per synapse for local illumination
      const pulsesPerSynapse = new Map<number, number[]>()
      pulsesRef.current.forEach((pulse) => {
        if (!pulsesPerSynapse.has(pulse.synapse)) {
          pulsesPerSynapse.set(pulse.synapse, [])
        }
        pulsesPerSynapse.get(pulse.synapse)!.push(pulse.progress)
      })

      // Draw all synapses with base faint lines
      synapses.forEach((synapse, synapseIndex) => {
        const from = neurons[synapse.from]
        const to = neurons[synapse.to]
        
        // Draw the base faint line
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = "rgba(91, 200, 186, 0.06)"
        ctx.lineWidth = 0.5
        ctx.stroke()
        
        // Draw illuminated segments near pulse positions
        const pulsePositions = pulsesPerSynapse.get(synapseIndex)
        if (pulsePositions) {
          pulsePositions.forEach((progress) => {
            const pulseX = from.x + (to.x - from.x) * progress
            const pulseY = from.y + (to.y - from.y) * progress
            
            // Calculate line segment to illuminate (20% of line length around pulse)
            const illuminationRange = 0.15
            const startProgress = Math.max(0, progress - illuminationRange)
            const endProgress = Math.min(1, progress + illuminationRange)
            
            const startX = from.x + (to.x - from.x) * startProgress
            const startY = from.y + (to.y - from.y) * startProgress
            const endX = from.x + (to.x - from.x) * endProgress
            const endY = from.y + (to.y - from.y) * endProgress
            
            // Create gradient along the illuminated segment
            const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
            gradient.addColorStop(0, "rgba(91, 200, 186, 0.1)")
            gradient.addColorStop(0.5, "rgba(91, 200, 186, 0.5)")
            gradient.addColorStop(1, "rgba(91, 200, 186, 0.1)")
            
            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.lineTo(endX, endY)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 1.5
            ctx.stroke()
          })
        }
      })

      // Draw and update pulses
      pulsesRef.current = pulsesRef.current.filter((pulse) => {
        pulse.progress += pulse.speed
        
        const synapse = synapses[pulse.synapse]
        if (!synapse) return false

        if (pulse.progress >= 1) {
          // Activate target neuron when pulse arrives
          neurons[synapse.to].activation = 1
          return false
        }

        const from = neurons[synapse.from]
        const to = neurons[synapse.to]

        const x = from.x + (to.x - from.x) * pulse.progress
        const y = from.y + (to.y - from.y) * pulse.progress

        // Glowing pulse head
        const pulseGradient = ctx.createRadialGradient(x, y, 0, x, y, 6)
        pulseGradient.addColorStop(0, "rgba(91, 200, 186, 1)")
        pulseGradient.addColorStop(0.5, "rgba(91, 200, 186, 0.5)")
        pulseGradient.addColorStop(1, "rgba(91, 200, 186, 0)")

        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fillStyle = pulseGradient
        ctx.fill()

        return true
      })

      // Draw neurons (static positions in layers)
      neurons.forEach((neuron) => {
        // Decay activation
        neuron.activation *= 0.94

        const baseSize = 4
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
          glowGradient.addColorStop(0, `rgba(91, 200, 186, ${glowIntensity * 0.3})`)
          glowGradient.addColorStop(0.5, `rgba(91, 200, 186, ${glowIntensity * 0.1})`)
          glowGradient.addColorStop(1, "rgba(91, 200, 186, 0)")

          ctx.beginPath()
          ctx.arc(neuron.x, neuron.y, baseSize + glowIntensity * 15, 0, Math.PI * 2)
          ctx.fillStyle = glowGradient
          ctx.fill()
        }

        // Core neuron (always visible, brighter when activated)
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, baseSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(91, 200, 186, ${0.15 + glowIntensity * 0.35})`
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    resizeCanvas()
    initNetwork()
    draw()

    const handleResize = () => {
      resizeCanvas()
      initNetwork()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", handleResize)
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
