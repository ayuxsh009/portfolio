"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import { Environment, Float, Text, Box, OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei"
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
    return <div className="fixed inset-0 bg-background" />
  }

  return children
}

// Grid floor component for professional look
function GridFloor() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Grid
      position={[0, -5, 0]}
      args={[50, 50]}
      cellSize={1}
      cellThickness={0.6}
      cellColor={isDark ? "#1e293b" : "#e2e8f0"}
      sectionSize={5}
      sectionThickness={1.2}
      sectionColor={isDark ? "#334155" : "#cbd5e1"}
      fadeDistance={30}
      fadeStrength={1}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  )
}

// Simple floating boxes
function FloatingBoxes({ count = 20 }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const groupRef = useRef()

  const boxes = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 0.5 + 0.5
      temp.push({
        position: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 30 - 10],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        size: [size, size, size],
        color: isDark ? `hsl(${210 + i * 5}, 70%, ${40 + i * 2}%)` : `hsl(${210 + i * 5}, 60%, ${60 + i * 1.5}%)`,
        speed: Math.random() * 0.01 + 0.005,
      })
    }
    return temp
  }, [count, isDark])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((box, i) => {
      box.rotation.x += boxes[i].speed
      box.rotation.y += boxes[i].speed * 1.5
    })
  })

  return (
    <group ref={groupRef}>
      {boxes.map((box, i) => (
        <Box key={i} position={box.position} rotation={box.rotation} args={box.size}>
          <meshStandardMaterial color={box.color} metalness={0.2} roughness={0.8} opacity={0.7} transparent />
        </Box>
      ))}
    </group>
  )
}

// Professional floating tech keywords
function TechKeywords() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const keywords = [
    "Algorithms",
    "Data Structures",
    "Machine Learning",
    "Software Engineering",
    "Artificial Intelligence",
  ]

  return (
    <group>
      {keywords.map((keyword, i) => (
        <Float
          key={i}
          speed={0.5}
          rotationIntensity={0.2}
          floatIntensity={0.2}
          position={[(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20 - 10]}
        >
          <Text fontSize={0.6} color={isDark ? "#3b82f6" : "#2563eb"} anchorX="center" anchorY="middle">
            {keyword}
          </Text>
        </Float>
      ))}
    </group>
  )
}

// Main scene component
function Scene() {
  const { theme } = useTheme()
  const isMobile = useMobile()

  return (
    <>
      <color attach="background" args={[theme === "dark" ? "#0f172a" : "#f8fafc"]} />

      {/* Professional lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.2} />

      {/* Professional CSE-themed elements */}
      <GridFloor />
      <FloatingBoxes count={isMobile ? 10 : 20} />
      <TechKeywords />

      {/* Environment lighting */}
      <Environment preset="city" />
    </>
  )
}

export default function SimplifiedCSEBackground() {
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
          camera={{ position: [0, 0, 10], fov: 75, near: 0.1, far: 100 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "default", // Changed from high-performance
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
          <Scene />
          {!isMobile && <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />}
        </Canvas>
      </div>
    </ErrorBoundary>
  )
}
