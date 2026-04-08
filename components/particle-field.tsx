"use client"

import { useEffect, useRef } from "react"

interface Node {
  x: number
  y: number
  targetX: number
  targetY: number
  layer: number
  index: number
  pulsePhase: number
  activation: number
}

interface DataPulse {
  fromNode: number
  toNode: number
  progress: number
  speed: number
  layer: number
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const pulsesRef = useRef<DataPulse[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Neural network configuration
    const layers = [4, 6, 8, 6, 4] // Nodes per layer
    const layerSpacing = 0.18

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initNetwork = () => {
      nodesRef.current = []
      const startX = canvas.width * 0.15
      const endX = canvas.width * 0.85
      const layerWidth = (endX - startX) / (layers.length - 1)

      layers.forEach((nodeCount, layerIndex) => {
        const x = startX + layerIndex * layerWidth
        const layerHeight = canvas.height * 0.6
        const startY = (canvas.height - layerHeight) / 2
        const nodeSpacing = layerHeight / (nodeCount + 1)

        for (let i = 0; i < nodeCount; i++) {
          const y = startY + (i + 1) * nodeSpacing
          nodesRef.current.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            targetX: x,
            targetY: y,
            layer: layerIndex,
            index: i,
            pulsePhase: Math.random() * Math.PI * 2,
            activation: Math.random(),
          })
        }
      })
    }

    const getNodesInLayer = (layer: number) => {
      return nodesRef.current.filter((n) => n.layer === layer)
    }

    const spawnPulse = () => {
      if (pulsesRef.current.length > 50) return

      const randomLayer = Math.floor(Math.random() * (layers.length - 1))
      const sourceNodes = getNodesInLayer(randomLayer)
      const targetNodes = getNodesInLayer(randomLayer + 1)

      if (sourceNodes.length && targetNodes.length) {
        const sourceNode = sourceNodes[Math.floor(Math.random() * sourceNodes.length)]
        const targetNode = targetNodes[Math.floor(Math.random() * targetNodes.length)]

        pulsesRef.current.push({
          fromNode: nodesRef.current.indexOf(sourceNode),
          toNode: nodesRef.current.indexOf(targetNode),
          progress: 0,
          speed: 0.008 + Math.random() * 0.012,
          layer: randomLayer,
        })
      }
    }

    const draw = () => {
      timeRef.current += 0.016
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn new pulses periodically
      if (Math.random() < 0.15) spawnPulse()

      const nodes = nodesRef.current

      // Draw connections between layers (neural network synapses)
      for (let l = 0; l < layers.length - 1; l++) {
        const currentLayer = getNodesInLayer(l)
        const nextLayer = getNodesInLayer(l + 1)

        currentLayer.forEach((node) => {
          nextLayer.forEach((nextNode) => {
            const gradient = ctx.createLinearGradient(node.x, node.y, nextNode.x, nextNode.y)
            gradient.addColorStop(0, `rgba(91, 200, 186, 0.03)`)
            gradient.addColorStop(0.5, `rgba(91, 200, 186, 0.06)`)
            gradient.addColorStop(1, `rgba(91, 200, 186, 0.03)`)

            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(nextNode.x, nextNode.y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.5
            ctx.stroke()
          })
        })
      }

      // Draw and update data pulses
      pulsesRef.current = pulsesRef.current.filter((pulse) => {
        pulse.progress += pulse.speed

        if (pulse.progress >= 1) {
          // Activate target node
          const targetNode = nodes[pulse.toNode]
          if (targetNode) targetNode.activation = 1
          return false
        }

        const fromNode = nodes[pulse.fromNode]
        const toNode = nodes[pulse.toNode]
        if (!fromNode || !toNode) return false

        const x = fromNode.x + (toNode.x - fromNode.x) * pulse.progress
        const y = fromNode.y + (toNode.y - fromNode.y) * pulse.progress

        // Glowing pulse
        const pulseGradient = ctx.createRadialGradient(x, y, 0, x, y, 8)
        pulseGradient.addColorStop(0, "rgba(91, 200, 186, 0.9)")
        pulseGradient.addColorStop(0.5, "rgba(91, 200, 186, 0.4)")
        pulseGradient.addColorStop(1, "rgba(91, 200, 186, 0)")

        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fillStyle = pulseGradient
        ctx.fill()

        // Trail effect
        const trailLength = 0.15
        for (let t = 0; t < 5; t++) {
          const trailProgress = pulse.progress - (t * trailLength) / 5
          if (trailProgress > 0) {
            const tx = fromNode.x + (toNode.x - fromNode.x) * trailProgress
            const ty = fromNode.y + (toNode.y - fromNode.y) * trailProgress
            ctx.beginPath()
            ctx.arc(tx, ty, 2 - t * 0.3, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(91, 200, 186, ${0.3 - t * 0.05})`
            ctx.fill()
          }
        }

        return true
      })

      // Draw nodes
      nodes.forEach((node) => {
        // Gentle floating animation
        const floatX = Math.sin(timeRef.current * 0.5 + node.pulsePhase) * 3
        const floatY = Math.cos(timeRef.current * 0.3 + node.pulsePhase * 1.3) * 3

        // Mouse repulsion
        const dx = mouseRef.current.x - node.targetX
        const dy = mouseRef.current.y - node.targetY
        const dist = Math.sqrt(dx * dx + dy * dy)
        let repelX = 0
        let repelY = 0
        if (dist < 200) {
          const force = (200 - dist) / 200
          repelX = -(dx / dist) * force * 30
          repelY = -(dy / dist) * force * 30
        }

        node.x += (node.targetX + floatX + repelX - node.x) * 0.05
        node.y += (node.targetY + floatY + repelY - node.y) * 0.05

        // Decay activation
        node.activation *= 0.95

        // Node glow based on activation
        const baseSize = 4 + node.layer * 0.5
        const glowSize = baseSize + node.activation * 8
        const baseOpacity = 0.4 + node.activation * 0.6

        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          glowSize * 3
        )
        glowGradient.addColorStop(0, `rgba(91, 200, 186, ${baseOpacity * 0.3})`)
        glowGradient.addColorStop(0.5, `rgba(91, 200, 186, ${baseOpacity * 0.1})`)
        glowGradient.addColorStop(1, "rgba(91, 200, 186, 0)")

        ctx.beginPath()
        ctx.arc(node.x, node.y, glowSize * 3, 0, Math.PI * 2)
        ctx.fillStyle = glowGradient
        ctx.fill()

        // Core node
        ctx.beginPath()
        ctx.arc(node.x, node.y, baseSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(91, 200, 186, ${baseOpacity})`
        ctx.fill()

        // Inner highlight
        ctx.beginPath()
        ctx.arc(node.x - baseSize * 0.3, node.y - baseSize * 0.3, baseSize * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + node.activation * 0.3})`
        ctx.fill()
      })

      // Draw floating binary/hex data
      ctx.font = "10px monospace"
      const dataChars = ["0", "1", "01", "10", "∑", "∂", "λ", "θ", "∇", "α"]
      for (let i = 0; i < 15; i++) {
        const x = (Math.sin(timeRef.current * 0.2 + i * 1.5) * 0.5 + 0.5) * canvas.width
        const y = ((timeRef.current * 20 + i * 150) % (canvas.height + 50)) - 25
        const char = dataChars[i % dataChars.length]
        ctx.fillStyle = `rgba(91, 200, 186, ${0.1 + Math.sin(timeRef.current + i) * 0.05})`
        ctx.fillText(char, x, y)
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    resizeCanvas()
    initNetwork()
    draw()

    window.addEventListener("resize", () => {
      resizeCanvas()
      initNetwork()
    })
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
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
