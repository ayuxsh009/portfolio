"use client"

import { useRef, useEffect } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (typeof window === "undefined") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    // Create particles
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 20000), 100)
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
      })
    }

    const animate = () => {
      if (!canvas || !ctx) return

      // Use a more subtle clear to create trails
      ctx.fillStyle = theme === "dark" ? "rgba(15, 23, 42, 0.05)" : "rgba(255, 255, 255, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Update position with slightly slower movement
        p.x += p.speedX * 0.7
        p.y += p.speedY * 0.7

        // Boundary check
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1

        // Draw particle with reduced opacity
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace("0.5", "0.3") // Reduce opacity
        ctx.fill()

        // Connect particles with thinner lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            // Reduced connection distance
            ctx.beginPath()
            ctx.strokeStyle = `${theme === "dark" ? "rgba(255, 255, 255," : "rgba(0, 0, 0,"} ${
              0.05 * (1 - distance / 120)
            })`
            ctx.lineWidth = 0.3 // Thinner lines
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [theme])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}
