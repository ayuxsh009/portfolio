"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useTheme } from "next-themes"
import { Environment, Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere } from "@react-three/drei"

function FloatingShapes({ count = 8, mousePosition }) {
  const { theme } = useTheme()
  const { viewport } = useThree()
  const groupRef = useRef()
  const [shapes, setShapes] = useState([])

  // Generate random shapes on mount
  useEffect(() => {
    const newShapes = []
    for (let i = 0; i < count; i++) {
      const type = Math.random() > 0.5 ? "sphere" : "box"
      const size = Math.random() * 0.5 + 0.1
      const position = [
        (Math.random() - 0.5) * viewport.width * 1.5,
        (Math.random() - 0.5) * viewport.height * 1.5,
        Math.random() * -5 - 2,
      ]
      const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
      const color = theme === "dark" ? getRandomColor(0.5) : getRandomColor(0.8)
      const speed = Math.random() * 0.01 + 0.001
      const wobbleSpeed = Math.random() * 2 + 1
      const distortSpeed = Math.random() * 2 + 1

      newShapes.push({
        id: i,
        type,
        size,
        position,
        rotation,
        color,
        speed,
        wobbleSpeed,
        distortSpeed,
      })
    }
    setShapes(newShapes)
  }, [count, viewport, theme])

  // Animate shapes
  useFrame((state) => {
    if (!groupRef.current) return

    // Rotate the entire group slowly
    groupRef.current.rotation.y += 0.001
    groupRef.current.rotation.x += 0.0005

    // Update each shape
    groupRef.current.children.forEach((shape, i) => {
      if (i >= shapes.length) return

      // Gentle floating motion
      shape.position.y += Math.sin(state.clock.elapsedTime * shapes[i].speed) * 0.002
      shape.position.x += Math.cos(state.clock.elapsedTime * shapes[i].speed) * 0.002

      // Subtle rotation
      shape.rotation.x += 0.001 * shapes[i].wobbleSpeed
      shape.rotation.y += 0.001 * shapes[i].distortSpeed

      // React to mouse position
      if (mousePosition.current) {
        const mouseInfluence = 0.0005
        shape.position.x += (mousePosition.current.x * viewport.width * 0.5 - shape.position.x) * mouseInfluence
        shape.position.y += (-mousePosition.current.y * viewport.height * 0.5 - shape.position.y) * mouseInfluence
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

function Shape({ shape }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  if (shape.type === "sphere") {
    return (
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere position={shape.position} args={[shape.size, 16, 16]}>
          <MeshDistortMaterial
            color={shape.color}
            speed={shape.distortSpeed}
            distort={0.3}
            radius={1}
            roughness={0.4}
            metalness={isDark ? 0.3 : 0.1}
            opacity={isDark ? 0.6 : 0.4}
            transparent
          />
        </Sphere>
      </Float>
    )
  } else {
    return (
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.6}>
        <mesh position={shape.position} rotation={shape.rotation}>
          <boxGeometry args={[shape.size, shape.size, shape.size]} />
          <MeshWobbleMaterial
            color={shape.color}
            factor={0.2}
            speed={shape.wobbleSpeed}
            roughness={0.4}
            metalness={isDark ? 0.3 : 0.1}
            opacity={isDark ? 0.6 : 0.4}
            transparent
          />
        </mesh>
      </Float>
    )
  }
}

function getRandomColor(saturation = 0.5) {
  const hue = Math.random() * 360
  const lightness = Math.random() * 20 + 50 // 50-70% lightness
  return `hsl(${hue}, ${saturation * 100}%, ${lightness}%)`
}

function MouseTracker({ mousePosition }) {
  const { viewport } = useThree()
  const [spherePos, setSpherePos] = useState([0, 0, -3])

  useFrame(({ mouse }) => {
    mousePosition.current = { x: mouse.x, y: mouse.y }
    setSpherePos([mouse.x * viewport.width * 0.5, -mouse.y * viewport.height * 0.5, -3])
  })

  return (
    <Sphere position={spherePos} args={[0.5, 16, 16]}>
      <MeshDistortMaterial color="#4f46e5" speed={2} distort={0.4} opacity={0.1} transparent />
    </Sphere>
  )
}

function AnimatedBackground() {
  const { theme } = useTheme()
  const mousePosition = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  return (
    <>
      <color attach="background" args={[theme === "dark" ? "#0f172a" : "#ffffff"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Main floating shapes */}
      <FloatingShapes count={10} mousePosition={mousePosition} />

      {/* Mouse tracker */}
      <MouseTracker mousePosition={mousePosition} />

      {/* Environment lighting */}
      <Environment preset="city" />
    </>
  )
}

export default function ThreeDBackground() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Canvas className="!fixed inset-0" camera={{ position: [0, 0, 10], fov: 75 }}>
      <AnimatedBackground />
    </Canvas>
  )
}
