"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import { Environment, Sphere, OrbitControls, PerspectiveCamera } from "@react-three/drei"

// Extremely simplified background as a fallback option
export default function Simple3DBackground() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="!fixed inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: false, powerPreference: "default" }}
      >
        <color attach="background" args={[isDark ? "#0f172a" : "#f8fafc"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
        <SimpleScene />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}

function SimpleScene() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const sphereRef = useRef()

  // Professional color palette
  const color = isDark ? "#3b82f6" : "#60a5fa"

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={sphereRef}>
      <Sphere position={[0, 0, -5]} args={[3, 32, 32]}>
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </Sphere>
    </group>
  )
}
