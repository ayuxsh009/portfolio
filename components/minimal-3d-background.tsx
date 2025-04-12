"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import { Environment, Sphere, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { useMobile } from "@/hooks/use-mobile"

// Error boundary component
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = () => {
      setHasError(true)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-950" />
    )
  }

  return children
}

// Simple floating spheres
function FloatingSpheres() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const groupRef = useRef()

  // Create spheres at specific positions
  const spheres = [
    { position: [-10, -5, -15], size: 3, color: isDark ? "#3b82f6" : "#60a5fa" },
    { position: [15, 8, -20], size: 4, color: isDark ? "#8b5cf6" : "#a78bfa" },
    { position: [-8, 10, -12], size: 2, color: isDark ? "#6366f1" : "#818cf8" },
    { position: [12, -7, -18], size: 3.5, color: isDark ? "#4f46e5" : "#6366f1" },
    { position: [0, -12, -10], size: 2.5, color: isDark ? "#2563eb" : "#3b82f6" },
    { position: [-15, 0, -25], size: 5, color: isDark ? "#1d4ed8" : "#2563eb" },
  ]

  useFrame((state) => {
    if (!groupRef.current) return

    // Gentle rotation of the entire group
    groupRef.current.rotation.y += 0.001
    groupRef.current.rotation.x += 0.0005

    // Individual sphere animations
    groupRef.current.children.forEach((sphere, i) => {
      sphere.position.y += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.01
    })
  })

  return (
    <group ref={groupRef}>
      {spheres.map((sphere, i) => (
        <Sphere key={i} position={sphere.position} args={[sphere.size, 32, 32]}>
          <meshStandardMaterial color={sphere.color} roughness={0.4} metalness={0.3} opacity={0.7} transparent />
        </Sphere>
      ))}
    </group>
  )
}

// Main scene component
function Scene() {
  const { theme } = useTheme()

  return (
    <>
      <color attach="background" args={[theme === "dark" ? "#0f172a" : "#f8fafc"]} />

      {/* Simple lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      {/* Floating spheres */}
      <FloatingSpheres />

      {/* Environment lighting */}
      <Environment preset="city" />
    </>
  )
}

export default function Minimal3DBackground() {
  const [mounted, setMounted] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    setMounted(true)
    return () => {
      // Cleanup
    }
  }, [])

  if (!mounted) return null

  return (
    <ErrorBoundary>
      <div className="!fixed inset-0">
        <Canvas
          dpr={[1, 1.5]} // Reduced DPR for better performance
          camera={{ position: [0, 0, 15], fov: 60, near: 0.1, far: 100 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "default",
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
          <Scene />
          {!isMobile && <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />}
        </Canvas>
      </div>
    </ErrorBoundary>
  )
}
