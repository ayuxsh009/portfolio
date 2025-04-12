"use client"

import { useRef, useEffect, useState } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isMouseMovingRef = useRef(false)

  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Initialize particles
  useEffect(() => {
    if (typeof window === "undefined") return
    setMounted(true)

    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const width = window.innerWidth
        const height = window.innerHeight

        // Set canvas dimensions
        canvas.width = width
        canvas.height = height

        // Create particles
        const particleCount = Math.min(Math.floor((width * height) / 15000), 100)
        const newParticles: Particle[] = []

        for (let i = 0; i < particleCount; i++) {
          newParticles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: theme === "dark" ? "#9333ea" : "#7c3aed",
            opacity: Math.random() * 0.5 + 0.1,
          })
        }

        particlesRef.current = newParticles

        // Start animation if it's not already running
        if (!animationFrameRef.current) {
          animate()
        }
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [theme])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
      isMouseMovingRef.current = true

      // Reset the flag after some time
      setTimeout(() => {
        isMouseMovingRef.current = false
      }, 100)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Animation function (defined outside useEffect to avoid recreating it)
  const animate = () => {
    if (!canvasRef.current || !mounted) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    // Update and draw particles
    const particles = particlesRef.current

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]

      // Update position
      particle.x += particle.speedX
      particle.y += particle.speedY

      // Boundary check
      if (particle.x < 0 || particle.x > width) {
        particle.speedX = -particle.speedX
      }

      if (particle.y < 0 || particle.y > height) {
        particle.speedY = -particle.speedY
      }

      // Draw particle
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255)
        .toString(16)
        .padStart(2, "0")}`
      ctx.fill()

      // Connect particles
      for (let j = i + 1; j < particles.length; j++) {
        const particle2 = particles[j]
        const dx = particle.x - particle2.x
        const dy = particle.y - particle2.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          ctx.beginPath()
          ctx.strokeStyle = `${particle.color}${Math.floor((1 - distance / 150) * 50)
            .toString(16)
            .padStart(2, "0")}`
          ctx.lineWidth = 0.5
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(particle2.x, particle2.y)
          ctx.stroke()
        }
      }

      // Interact with mouse
      if (isMouseMovingRef.current) {
        const dx = particle.x - mousePositionRef.current.x
        const dy = particle.y - mousePositionRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          particle.speedX += Math.cos(angle) * force * 0.2
          particle.speedY += Math.sin(angle) * force * 0.2

          // Limit speed
          const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY)
          if (speed > 2) {
            particle.speedX = (particle.speedX / speed) * 2
            particle.speedY = (particle.speedY / speed) * 2
          }
        }
      }

      // Apply friction
      particle.speedX *= 0.98
      particle.speedY *= 0.98
    }

    // Request next frame
    animationFrameRef.current = requestAnimationFrame(animate)
  }

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: theme === "dark" ? "#09090b" : "#ffffff" }}
    />
  )
}
