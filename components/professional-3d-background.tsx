"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import { Environment, Grid, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { useMobile } from "@/hooks/use-mobile"

// Error boundary component
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = (event) => {
      if (event) {
        setHasError(true)
      }
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800" />
    )
  }

  return children
}

// Simple grid floor
function SimpleGridFloor() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const gridRef = useRef()

  useFrame(() => {
    if (gridRef.current) {
      // Very subtle rotation for minimal movement
      gridRef.current.rotation.z += 0.0002
    }
  })

  return (
    <group ref={gridRef}>
      <Grid
        position={[0, -5, 0]}
        args={[100, 100]}
        cellSize={2}
        cellThickness={0.3}
        cellColor={isDark ? "#1e293b" : "#e2e8f0"}
        sectionSize={10}
        sectionThickness={0.5}
        sectionColor={isDark ? "#334155" : "#cbd5e1"}
        fadeDistance={50}
        fadeStrength={1.5}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

// Main scene component
function Scene() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <>
      <color attach="background" args={[isDark ? "#0f172a" : "#f8fafc"]} />

      {/* Minimal lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <directionalLight position={[-10, -10, -5]} intensity={0.1} color={isDark ? "#3b82f6" : "#60a5fa"} />

      {/* Simple grid floor only */}
      <SimpleGridFloor />

      {/* Subtle environment lighting */}
      <Environment preset="city" />
    </>
  )
}

export default function Professional3DBackground() {
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
      <div className="!fixed inset-0 z-[-1]">
        <Canvas
          dpr={[1, isMobile ? 1.5 : 1.8]}
          camera={{ position: [0, 0, 20], fov: 60, near: 0.1, far: 1000 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "default",
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={60} />
          <Scene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>
    </ErrorBoundary>
  )
}
