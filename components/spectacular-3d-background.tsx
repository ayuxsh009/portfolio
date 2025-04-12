"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import {
  Environment,
  Sphere,
  Box,
  Torus,
  TorusKnot,
  OrbitControls,
  PerspectiveCamera,
  Text,
  Float,
  Sparkles,
  Stars,
} from "@react-three/drei"
import { useMobile } from "@/hooks/use-mobile"
import * as THREE from "three"

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

// Animated geometric shapes
function GeometricShapes() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const groupRef = useRef()
  const isMobile = useMobile()

  // Create shapes with professional colors and positions
  const shapes = useMemo(() => {
    // Professional color palette with more vibrant options
    const colors = isDark
      ? ["#1e40af", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#7c3aed", "#8b5cf6", "#a855f7"]
      : ["#3b82f6", "#60a5fa", "#93c5fd", "#6366f1", "#818cf8", "#8b5cf6", "#a78bfa", "#c084fc"]

    const count = isMobile ? 6 : 12
    const shapeData = []

    for (let i = 0; i < count; i++) {
      // Create a more intentional, balanced layout
      const angle = (i / count) * Math.PI * 2
      const radius = Math.random() * 8 + 10
      const shapeType = Math.floor(Math.random() * 4) // 0: sphere, 1: box, 2: torus, 3: torusKnot

      shapeData.push({
        type: shapeType,
        position: [
          Math.cos(angle) * radius,
          Math.sin((i / count) * Math.PI * 2) * 6 - 2,
          Math.sin(angle) * radius - 15,
        ],
        size: Math.random() * 1.5 + 1,
        color: colors[i % colors.length],
        speed: Math.random() * 0.002 + 0.001,
        rotationAxis: [Math.random(), Math.random(), Math.random()].map((v) => v * 2 - 1),
        initialOffset: Math.random() * Math.PI * 2,
        emissive: isDark ? colors[i % colors.length] : null,
        emissiveIntensity: isDark ? 0.3 : 0,
      })
    }

    return shapeData
  }, [isDark, isMobile])

  useFrame((state) => {
    if (!groupRef.current) return

    // Subtle group rotation
    groupRef.current.rotation.y += 0.001

    // Individual shape animations
    groupRef.current.children.forEach((shape, i) => {
      if (i < shapes.length) {
        const { speed, rotationAxis, initialOffset } = shapes[i]

        // Gentle floating motion
        shape.position.y += Math.sin(state.clock.elapsedTime * 0.5 + initialOffset) * 0.01

        // Subtle rotation on random axis
        shape.rotation.x += speed * rotationAxis[0]
        shape.rotation.y += speed * rotationAxis[1]
        shape.rotation.z += speed * rotationAxis[2]
      }
    })
  })

  // Render different shape types
  const renderShape = (shape, i) => {
    const commonProps = {
      position: shape.position,
    }

    const materialProps = {
      color: shape.color,
      roughness: 0.2,
      metalness: 0.8,
      emissive: shape.emissive,
      emissiveIntensity: shape.emissiveIntensity,
    }

    switch (shape.type) {
      case 0: // Sphere
        return (
          <Sphere key={i} {...commonProps} args={[shape.size, 32, 32]}>
            <meshStandardMaterial {...materialProps} />
          </Sphere>
        )
      case 1: // Box
        return (
          <Box key={i} {...commonProps} args={[shape.size, shape.size, shape.size]}>
            <meshStandardMaterial {...materialProps} />
          </Box>
        )
      case 2: // Torus
        return (
          <Torus key={i} {...commonProps} args={[shape.size, shape.size / 3, 16, 32]}>
            <meshStandardMaterial {...materialProps} />
          </Torus>
        )
      case 3: // TorusKnot
        return (
          <TorusKnot key={i} {...commonProps} args={[shape.size, shape.size / 3, 128, 16]}>
            <meshStandardMaterial {...materialProps} />
          </TorusKnot>
        )
      default:
        return null
    }
  }

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <Float key={i} speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
          {renderShape(shape, i)}
        </Float>
      ))}
    </group>
  )
}

// Moving particles instead of trails
function MovingParticles() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const isMobile = useMobile()
  const count = isMobile ? 3 : 5
  const groupRef = useRef()

  // Create particle data
  const particles = useMemo(() => {
    const colors = isDark
      ? ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#ec4899"]
      : ["#60a5fa", "#818cf8", "#a78bfa", "#c084fc", "#f472b6"]

    return Array.from({ length: count }, (_, i) => ({
      color: colors[i % colors.length],
      initialPosition: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20 - 10],
      speed: Math.random() * 0.02 + 0.01,
      radius: Math.random() * 5 + 3,
      offset: Math.random() * Math.PI * 2,
      size: Math.random() * 0.3 + 0.2,
      // Create trail points
      trailPositions: Array.from({ length: 20 }, () => new THREE.Vector3(0, 0, 0)),
    }))
  }, [count, isDark])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    groupRef.current.children.forEach((group, i) => {
      if (i >= particles.length) return

      const particle = particles[i]
      const t = clock.getElapsedTime() * particle.speed + particle.offset

      // Update the main particle position
      const mainParticle = group.children[0]
      if (mainParticle) {
        // Create circular motion
        const x = particle.initialPosition[0] + Math.cos(t) * particle.radius
        const y = particle.initialPosition[1] + Math.sin(t * 0.7) * particle.radius * 0.5
        const z = particle.initialPosition[2] + Math.sin(t) * particle.radius

        mainParticle.position.set(x, y, z)
      }

      // Update trail particles
      for (let j = 1; j < group.children.length; j++) {
        const trailParticle = group.children[j]
        if (trailParticle) {
          // Follow the main particle with delay
          const delay = j * 0.1
          const delayedT = t - delay

          const tx = particle.initialPosition[0] + Math.cos(delayedT) * particle.radius
          const ty = particle.initialPosition[1] + Math.sin(delayedT * 0.7) * particle.radius * 0.5
          const tz = particle.initialPosition[2] + Math.sin(delayedT) * particle.radius

          trailParticle.position.set(tx, ty, tz)

          // Fade out trail particles
          const opacity = 1 - j / group.children.length
          if (trailParticle.material) {
            trailParticle.material.opacity = opacity
          }
        }
      }
    })
  })

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <group key={i}>
          {/* Main particle */}
          <mesh position={particle.initialPosition}>
            <sphereGeometry args={[particle.size, 16, 16]} />
            <meshBasicMaterial color={particle.color} />
          </mesh>

          {/* Trail particles */}
          {Array.from({ length: 15 }, (_, j) => (
            <mesh key={j} position={particle.initialPosition}>
              <sphereGeometry args={[particle.size * (1 - j / 15), 8, 8]} />
              <meshBasicMaterial color={particle.color} transparent opacity={1 - j / 15} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// Floating text elements
function FloatingTextElements() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const isMobile = useMobile()

  // Professional keywords
  const keywords = isMobile
    ? ["Design", "Create", "Develop", "Innovate"]
    : ["Design", "Create", "Develop", "Innovate", "Build", "Imagine"]

  return (
    <group>
      {keywords.map((word, i) => (
        <Float
          key={i}
          position={[(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 30 - 20]}
          rotation={[0, Math.random() * Math.PI, 0]}
          speed={1}
          rotationIntensity={0.3}
          floatIntensity={0.5}
        >
          <Text
            color={isDark ? "#f8fafc" : "#0f172a"}
            fontSize={2}
            font="/fonts/Inter-Bold.ttf"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor={isDark ? "#0f172a" : "#f8fafc"}
            outlineOpacity={0.3}
          >
            {word}
          </Text>
        </Float>
      ))}
    </group>
  )
}

// Sparkle effects
function SparkleEffects() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const isMobile = useMobile()

  return (
    <>
      <Sparkles
        count={isMobile ? 100 : 200}
        scale={20}
        size={1}
        speed={0.3}
        opacity={0.5}
        color={isDark ? "#60a5fa" : "#3b82f6"}
      />
      <Sparkles
        count={isMobile ? 50 : 100}
        scale={30}
        size={2}
        speed={0.2}
        opacity={0.3}
        color={isDark ? "#a855f7" : "#8b5cf6"}
      />
    </>
  )
}

// Main scene component
function Scene() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <>
      <color attach="background" args={[isDark ? "#0f172a" : "#f8fafc"]} />

      {/* Professional lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.2} />

      {/* Professional 3D elements */}
      <GeometricShapes />
      <MovingParticles />
      <FloatingTextElements />
      <SparkleEffects />

      {/* Stars in dark mode only */}
      {isDark && <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />}

      {/* Environment lighting */}
      <Environment preset="city" />
    </>
  )
}

// Camera animation
function AnimatedCamera() {
  const cameraRef = useRef()

  useFrame(({ clock }) => {
    if (cameraRef.current) {
      const t = clock.getElapsedTime() * 0.1

      // Very subtle camera movement
      cameraRef.current.position.x = Math.sin(t) * 2
      cameraRef.current.position.y = Math.cos(t * 0.5) * 1
    }
  })

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 20]} fov={60} />
}

export default function Spectacular3DBackground() {
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
          dpr={[1, isMobile ? 1.5 : 2]} // Adjust DPR based on device
          camera={{ position: [0, 0, 20], fov: 60, near: 0.1, far: 1000 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: isMobile ? "default" : "high-performance",
          }}
        >
          <AnimatedCamera />
          <Scene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            rotateSpeed={0.5}
          />
        </Canvas>
      </div>
    </ErrorBoundary>
  )
}
