"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import {
  Environment,
  Float,
  useGLTF,
  OrbitControls,
  PerspectiveCamera,
  Stars,
  Sphere,
  MeshDistortMaterial,
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

// Laptop model
function Laptop({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF("/assets/3d/duck.glb") // Using the duck as a placeholder
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.005
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <primitive ref={ref} object={scene} position={position} rotation={rotation} scale={scale} />
    </Float>
  )
}

// Abstract spheres for background decoration
function AbstractSpheres({ count = 15 }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const groupRef = useRef()

  const spheres = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2 + 1
      const speed = Math.random() * 0.01 + 0.002
      const distort = Math.random() * 0.3 + 0.1
      const color = isDark ? `hsl(${210 + i * 15}, 70%, ${40 + i * 3}%)` : `hsl(${210 + i * 15}, 60%, ${60 + i * 2}%)`

      temp.push({
        position: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40 - 10],
        size,
        speed,
        distort,
        color,
      })
    }
    return temp
  }, [count, isDark])

  useFrame((state) => {
    if (!groupRef.current) return

    groupRef.current.children.forEach((sphere, i) => {
      // Gentle rotation
      sphere.rotation.x += spheres[i].speed
      sphere.rotation.y += spheres[i].speed * 1.3

      // Subtle position changes
      sphere.position.y += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005
    })
  })

  return (
    <group ref={groupRef}>
      {spheres.map((sphere, i) => (
        <Sphere key={i} position={sphere.position} args={[sphere.size, 32, 32]}>
          <MeshDistortMaterial
            color={sphere.color}
            speed={2}
            distort={sphere.distort}
            roughness={0.4}
            metalness={0.3}
            opacity={0.8}
            transparent
          />
        </Sphere>
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

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.2} />

      {/* 3D Models */}
      <Laptop position={[0, 0, -5]} scale={2} />

      {/* Background elements */}
      <AbstractSpheres count={isMobile ? 8 : 15} />
      {theme === "dark" && <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade />}

      {/* Environment lighting */}
      <Environment preset="city" />
    </>
  )
}

export default function TechModelsBackground() {
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
