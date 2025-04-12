"use client"

import { useRef, useEffect } from "react"
import { useTheme } from "next-themes"

export default function GradientBackground() {
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

    // Create gradient objects
    const gradients = [
      {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.max(canvas.width, canvas.height) * 0.3,
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1,
        color: theme === "dark" ? "rgba(236, 72, 153, 0.15)" : "rgba(236, 72, 153, 0.1)", // pink
      },
      {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.max(canvas.width, canvas.height) * 0.3,
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1,
        color: theme === "dark" ? "rgba(168, 85, 247, 0.15)" : "rgba(168, 85, 247, 0.1)", // purple
      },
      {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.max(canvas.width, canvas.height) * 0.3,
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1,
        color: theme === "dark" ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.1)", // indigo
      },
    ]

    const animate = () => {
      if (!canvas || !ctx) return

      // Clear canvas with a semi-transparent background to create trail effect
      ctx.fillStyle = theme === "dark" ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.02)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw gradients
      gradients.forEach((gradient) => {
        // Update position
        gradient.x += gradient.vx
        gradient.y += gradient.vy

        // Bounce off walls
        if (gradient.x < 0 || gradient.x > canvas.width) gradient.vx *= -1
        if (gradient.y < 0 || gradient.y > canvas.height) gradient.vy *= -1

        // Draw gradient
        const radialGradient = ctx.createRadialGradient(
          gradient.x,
          gradient.y,
          0,
          gradient.x,
          gradient.y,
          gradient.radius,
        )
        radialGradient.addColorStop(0, gradient.color)
        radialGradient.addColorStop(1, "transparent")

        ctx.fillStyle = radialGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: theme === "dark" ? "#000" : "#fff" }}
    />
  )
}
