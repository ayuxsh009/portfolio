"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import {
  Environment,
  Float,
  MeshDistortMaterial,
  Sphere,
  Box,
  Torus,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei"
import { useMobile } from "@/hooks/use-mobile"

// Simplified floating shapes component
function FloatingShapes({ count = 10, mousePosition }) {
  const { theme } = useTheme()
  const groupRef = useRef()
  const [shapes, setShapes] = useState([])
  const isMobile = useMobile()

  // Reduce shape count on mobile
  const actualCount = isMobile ? Math.floor(count / 2) : count

  // Generate random shapes on mount
  useEffect(() => {
    const newShapes = []
    for (let i = 0; i < actualCount; i++) {
      // Simplified shape types
      const typeOptions = ["sphere", "box", "torus"]
      const type = typeOptions[Math.floor(Math.random() * typeOptions.length)]

      const size = Math.random() * 0.8 + 0.2
      const position = [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, Math.random() * -10 - 2]
      const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]

      // Simplified color selection
      const hue = Math.random() * 60 + (theme === "dark" ? 220 : 200)
      const saturation = Math.random() * 30 + (theme === "dark" ? 70 : 50)
      const lightness = Math.random() * 20 + (theme === "dark" ? 50 : 60)
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`

      const speed = Math.random() * 0.02 + 0.005
      const distortFactor = Math.random() * 0.3 + 0.1

      newShapes.push({
        id: i,
        type,
        size,
        position,
        rotation,
        color,
        speed,
        distortFactor,
      })
    }
    setShapes(newShapes)
  }, [actualCount, theme])

  // Animate shapes
  useFrame((state) => {
    if (!groupRef.current) return

    // Rotate the entire group slowly
    groupRef.current.rotation.y += 0.0005
    groupRef.current.rotation.x += 0.0002

    // Update each shape
    groupRef.current.children.forEach((shape, i) => {
      if (i >= shapes.length) return

      // Gentle floating motion
      shape.position.y += Math.sin(state.clock.elapsedTime * shapes[i].speed) * 0.003
      shape.position.x += Math.cos(state.clock.elapsedTime * shapes[i].speed) * 0.003

      // Subtle rotation
      shape.rotation.x += 0.001
      shape.rotation.y += 0.001

      // React to mouse position
      if (mousePosition.current) {
        const mouseInfluence = 0.0005
        shape.position.x += (mousePosition.current.x * 5 - shape.position.x) * mouseInfluence
        shape.position.y += (-mousePosition.current.y * 5 - shape.position.y) * mouseInfluence
      }
    })
  })

  return (
    <group ref={groupRef}>
      {shapes.map((shape) => (
        <Shape key={shape.id} shape={shape} />
      ))}
    </group>
  )
}

// Simplified shape component
function Shape({ shape }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Render different geometries based on shape type
  const renderShape = () => {
    switch (shape.type) {
      case "sphere":
        return (
          <Sphere args={[shape.size, 16, 16]} position={shape.position} rotation={shape.rotation}>
            <MeshDistortMaterial
              color={shape.color}
              speed={0.5}
              distort={shape.distortFactor}
              roughness={0.4}
              metalness={isDark ? 0.3 : 0.1}
              opacity={isDark ? 0.7 : 0.5}
              transparent
            />
          </Sphere>
        )
      case "box":
        return (
          <Box args={[shape.size, shape.size, shape.size]} position={shape.position} rotation={shape.rotation}>
            <MeshDistortMaterial
              color={shape.color}
              speed={0.5}
              distort={shape.distortFactor}
              roughness={0.4}
              metalness={isDark ? 0.3 : 0.1}
              opacity={isDark ? 0.7 : 0.5}
              transparent
            />
          </Box>
        )
      case "torus":
        return (
          <Torus args={[shape.size, shape.size / 3, 16, 32]} position={shape.position} rotation={shape.rotation}>
            <MeshDistortMaterial
              color={shape.color}
              speed={0.5}
              distort={shape.distortFactor}
              roughness={0.4}
              metalness={isDark ? 0.3 : 0.1}
              opacity={isDark ? 0.7 : 0.5}
              transparent
            />
          </Torus>
        )
      default:
        return (
          <Sphere args={[shape.size, 16, 16]} position={shape.position} rotation={shape.rotation}>
            <MeshDistortMaterial
              color={shape.color}
              speed={0.5}
              distort={shape.distortFactor}
              roughness={0.4}
              metalness={isDark ? 0.3 : 0.1}
              opacity={isDark ? 0.7 : 0.5}
              transparent
            />
          </Sphere>
        )
    }
  }

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
      {renderShape()}
    </Float>
  )
}

// Simplified mouse tracker
function MouseTracker({ mousePosition }) {
  useFrame(({ mouse }) => {
    mousePosition.current = { x: mouse.x, y: mouse.y }
  })

  return null
}

// Main scene component
function Scene() {
  const { theme } = useTheme()
  const mousePosition = useRef({ x: 0, y: 0 })
  const isMobile = useMobile()

  return (
    <>
      <color attach="background" args={[theme === "dark" ? "#0f172a" : "#ffffff"]} />

      {/* Basic lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      {/* Main floating shapes */}
      <FloatingShapes count={isMobile ? 8 : 15} mousePosition={mousePosition} />

      {/* Mouse tracker */}
      <MouseTracker mousePosition={mousePosition} />

      {/* Environment lighting */}
      <Environment preset="city" />
    </>
  )
}

export default function Advanced3DBackground() {
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
    <div className="!fixed inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 75, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
        <Scene />
        {!isMobile && <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />}
      </Canvas>
    </div>
  )
}
