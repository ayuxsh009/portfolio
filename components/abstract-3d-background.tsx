"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import {
  Environment,
  Float,
  Sphere,
  Box,
  Torus,
  OrbitControls,
  PerspectiveCamera,
  MeshDistortMaterial,
  MeshWobbleMaterial,
} from "@react-three/drei"
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

// Abstract shapes component
function AbstractShapes({ count = 25 }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const groupRef = useRef()

  const shapes = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      // Randomly select shape type
      const shapeType = Math.floor(Math.random() * 3) // 0: sphere, 1: box, 2: torus

      // Common properties
      const size = Math.random() * 1.5 + 0.5
      const position = [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 30 - 5]
      const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]

      // Material properties
      const materialType = Math.random() > 0.5 ? "distort" : "wobble"
      const color = isDark ? `hsl(${210 + i * 10}, 70%, ${40 + i * 2}%)` : `hsl(${210 + i * 10}, 60%, ${60 + i * 1.5}%)`

      // Animation properties
      const speed = Math.random() * 0.01 + 0.002
      const factor = Math.random() * 0.5 + 0.1

      temp.push({
        type: shapeType,
        position,
        rotation,
        size,
        materialType,
        color,
        speed,
        factor,
      })
    }
    return temp
  }, [count, isDark])

  useFrame((state) => {
    if (!groupRef.current) return

    groupRef.current.children.forEach((shape, i) => {
      // Gentle rotation
      shape.rotation.x += shapes[i].speed
      shape.rotation.y += shapes[i].speed * 1.3

      // Subtle position changes
      shape.position.y += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005
    })
  })

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => {
        // Render different shape types
        let ShapeComponent
        let shapeProps = {}

        if (shape.type === 0) {
          ShapeComponent = Sphere
          shapeProps = { args: [shape.size, 32, 32] }
        } else if (shape.type === 1) {
          ShapeComponent = Box
          shapeProps = { args: [shape.size, shape.size, shape.size] }
        } else {
          ShapeComponent = Torus
          shapeProps = { args: [shape.size, shape.size / 3, 16, 32] }
        }

        return (
          <Float key={i} speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
            <ShapeComponent position={shape.position} rotation={shape.rotation} {...shapeProps}>
              {shape.materialType === "distort" ? (
                <MeshDistortMaterial
                  color={shape.color}
                  speed={2}
                  distort={shape.factor}
                  roughness={0.4}
                  metalness={0.3}
                  opacity={0.8}
                  transparent
                />
              ) : (
                <MeshWobbleMaterial
                  color={shape.color}
                  factor={shape.factor}
                  speed={2}
                  roughness={0.4}
                  metalness={0.3}
                  opacity={0.8}
                  transparent
                />
              )}
            </ShapeComponent>
          </Float>
        )
      })}
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

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.2} />

      {/* Abstract shapes */}
      <AbstractShapes count={isMobile ? 15 : 25} />

      {/* Environment lighting */}
      <Environment preset="city" />
    </>
  )
}

export default function Abstract3DBackground() {
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
