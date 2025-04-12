"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import {
  Environment,
  Float,
  Text3D,
  Box,
  OrbitControls,
  PerspectiveCamera,
  Line,
  Cylinder,
  Text,
} from "@react-three/drei"
import * as THREE from "three"
import { useMobile } from "@/hooks/use-mobile"

// Binary particles component
function BinaryParticles({ count = 100 }) {
  const { theme } = useTheme()
  const groupRef = useRef()
  const isDark = theme === "dark"
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const position = [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10 - 5]
      const binary = Math.random() > 0.5 ? "1" : "0"
      const scale = Math.random() * 0.5 + 0.5
      const speed = Math.random() * 0.02 + 0.01
      temp.push({ position, binary, scale, speed })
    }
    return temp
  }, [count])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      // Move particles slowly downward and reset when they go too far
      child.position.y -= particles[i].speed
      if (child.position.y < -10) {
        child.position.y = 10
        child.position.x = (Math.random() - 0.5) * 20
      }
    })
  })

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <Text
          key={i}
          position={particle.position}
          fontSize={0.3 * particle.scale}
          color={isDark ? "#4f46e5" : "#3b82f6"}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.ttf"
        >
          {particle.binary}
        </Text>
      ))}
    </group>
  )
}

// Circuit board lines
function CircuitLines({ count = 20 }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const groupRef = useRef()

  // Use useMemo to create stable circuit lines
  const lines = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      // Create a simpler path with guaranteed valid points
      const startX = (Math.random() - 0.5) * 15
      const startY = (Math.random() - 0.5) * 15
      const startZ = Math.random() * -10 - 2

      // Create circuit-like paths with right angles
      const points = []
      let currentX = startX
      let currentY = startY
      const currentZ = startZ

      // Add starting point
      points.push(new THREE.Vector3(currentX, currentY, currentZ))

      // Create 2-3 segments (reduced from 2-4 to minimize complexity)
      const segments = Math.floor(Math.random() * 2) + 2
      for (let j = 0; j < segments; j++) {
        // Decide direction: 0 = x, 1 = y
        const direction = Math.floor(Math.random() * 2)
        // Use smaller, fixed distances to avoid extreme values
        const distance = (Math.random() + 0.5) * (Math.random() > 0.5 ? 1 : -1)

        if (direction === 0) {
          currentX += distance
        } else {
          currentY += distance
        }

        // Ensure the point is valid before adding
        if (!isNaN(currentX) && !isNaN(currentY) && !isNaN(currentZ)) {
          points.push(new THREE.Vector3(currentX, currentY, currentZ))
        }
      }

      // Only add lines with at least 2 valid points
      if (points.length >= 2) {
        const color = isDark ? "#4f46e5" : "#3b82f6"
        // Use smaller line width to reduce visual complexity
        const lineWidth = Math.random() + 0.5
        temp.push({ points, color, lineWidth })
      }
    }
    return temp
  }, [count, isDark])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.z += 0.0005
  })

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          color={line.color}
          lineWidth={line.lineWidth}
          // Add these props to ensure proper rendering
          alphaTest={0.5}
          transparent={true}
          opacity={0.8}
        />
      ))}
    </group>
  )
}

// Code symbols
function CodeSymbols() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const symbols = ["{", "}", "(", ")", "[", "]", "<", ">", ";", "=", "+", "*", "/", "%", "&", "|", "!"]
  const groupRef = useRef()

  const codeElements = useMemo(() => {
    const temp = []
    for (let i = 0; i < 15; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)]
      const position = [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, Math.random() * -10 - 2]
      const rotation = [0, 0, Math.random() * Math.PI * 2]
      const scale = Math.random() * 0.5 + 0.5
      temp.push({ symbol, position, rotation, scale })
    }
    return temp
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.001

    groupRef.current.children.forEach((child, i) => {
      child.rotation.z += 0.002 * (i % 2 === 0 ? 1 : -1)
    })
  })

  return (
    <group ref={groupRef}>
      {codeElements.map((element, i) => (
        <Text3D
          key={i}
          font="/fonts/Inter_Bold.json"
          position={element.position}
          rotation={element.rotation}
          size={0.5 * element.scale}
          height={0.1}
          curveSegments={12}
        >
          {element.symbol}
          <meshStandardMaterial
            color={isDark ? "#8b5cf6" : "#6366f1"}
            emissive={isDark ? "#4f46e5" : "#3b82f6"}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>
      ))}
    </group>
  )
}

// Tech objects (CPU, RAM, etc.)
function TechObjects() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const groupRef = useRef()

  // Create a CPU-like object
  const CPU = () => {
    return (
      <group position={[3, 2, -5]}>
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
          {/* CPU base */}
          <Box args={[2, 0.2, 2]} position={[0, 0, 0]}>
            <meshStandardMaterial color={isDark ? "#1e293b" : "#cbd5e1"} metalness={0.8} roughness={0.2} />
          </Box>

          {/* CPU die */}
          <Box args={[1.2, 0.1, 1.2]} position={[0, 0.15, 0]}>
            <meshStandardMaterial color={isDark ? "#475569" : "#94a3b8"} metalness={0.9} roughness={0.1} />
          </Box>

          {/* CPU pins */}
          <group position={[0, -0.2, 0]}>
            {Array.from({ length: 8 }).map((_, i) =>
              Array.from({ length: 8 }).map((_, j) => (
                <Cylinder
                  key={`${i}-${j}`}
                  args={[0.03, 0.03, 0.2, 8]}
                  position={[(i - 3.5) * 0.2, -0.1, (j - 3.5) * 0.2]}
                >
                  <meshStandardMaterial color={isDark ? "#94a3b8" : "#64748b"} metalness={0.9} roughness={0.1} />
                </Cylinder>
              )),
            )}
          </group>

          {/* CPU text */}
          <Text
            position={[0, 0.21, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.2}
            color={isDark ? "#94a3b8" : "#334155"}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.ttf"
          >
            CPU
          </Text>
        </Float>
      </group>
    )
  }

  // Create a RAM-like object
  const RAM = () => {
    return (
      <group position={[-4, -1, -6]}>
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
          {/* RAM base */}
          <Box args={[3, 0.1, 1]} position={[0, 0, 0]}>
            <meshStandardMaterial color={isDark ? "#1e293b" : "#cbd5e1"} metalness={0.8} roughness={0.2} />
          </Box>

          {/* RAM chips */}
          {Array.from({ length: 8 }).map((_, i) => (
            <Box key={i} args={[0.3, 0.05, 0.8]} position={[(i - 3.5) * 0.35, 0.075, 0]}>
              <meshStandardMaterial color={isDark ? "#475569" : "#94a3b8"} metalness={0.9} roughness={0.1} />
            </Box>
          ))}

          {/* RAM text */}
          <Text
            position={[0, 0.15, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.2}
            color={isDark ? "#94a3b8" : "#334155"}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.ttf"
          >
            RAM
          </Text>
        </Float>
      </group>
    )
  }

  // Create a GPU-like object
  const GPU = () => {
    return (
      <group position={[0, -3, -7]}>
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
          {/* GPU base */}
          <Box args={[4, 0.2, 2]} position={[0, 0, 0]}>
            <meshStandardMaterial color={isDark ? "#1e293b" : "#cbd5e1"} metalness={0.8} roughness={0.2} />
          </Box>

          {/* GPU processor */}
          <Box args={[1.5, 0.1, 1.5]} position={[0, 0.15, 0]}>
            <meshStandardMaterial color={isDark ? "#475569" : "#94a3b8"} metalness={0.9} roughness={0.1} />
          </Box>

          {/* GPU fans */}
          <Cylinder args={[0.6, 0.6, 0.1, 32]} position={[-1.2, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color={isDark ? "#334155" : "#64748b"} metalness={0.7} roughness={0.3} />
          </Cylinder
\
          <Cylinder args={[0.6, 0.6, 0.1, 32]} position={[1.2, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color={isDark ? "#334155" : "#64748b"} metalness={0.7} roughness={0.3} />
          </Cylinder

          {/* GPU text */}
          <Text
            position={[0, 0.21, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.2}
            color={isDark ? "#94a3b8" : "#334155"}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.ttf"
          >
            GPU
          </Text>
        </Float>
      </group>
    )
  }

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.001
  })

  return (
    <group ref={groupRef}>
      <CPU />
      <RAM />
      <GPU />
    </group>
  )
}

// Programming language floating text
function ProgrammingLanguages() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const languages = ["Python", "Java", "C++", "JavaScript", "TypeScript", "Go", "Rust", "SQL", "HTML", "CSS"]

  return (
    <group>
      {languages.map((lang, i) => (
        <Float
          key={i}
          speed={1}
          rotationIntensity={0.3}
          floatIntensity={0.3}
          position={[(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, Math.random() * -15 - 5]}
        >
          <Text
            fontSize={0.5}
            color={isDark ? ["#4f46e5", "#8b5cf6", "#ec4899"][i % 3] : ["#3b82f6", "#6366f1", "#8b5cf6"][i % 3]}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.ttf"
          >
            {lang}
          </Text>
        </Float>
      ))}
    </group>
  )
}

// Main scene component
function Scene() {
  const { theme } = useTheme()
  const mousePosition = useRef({ x: 0, y: 0 })
  const isMobile = useMobile()

  // Mouse tracker
  useFrame(({ mouse }) => {
    mousePosition.current = { x: mouse.x, y: mouse.y }
  })

  return (
    <>
      <color attach="background" args={[theme === "dark" ? "#0f172a" : "#ffffff"]} />

      {/* Basic lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.2} color={theme === "dark" ? "#4f46e5" : "#3b82f6"} />

      {/* CSE-themed elements */}
      <BinaryParticles count={isMobile ? 50 : 100} />
      <CircuitLines count={isMobile ? 10 : 20} />
      <CodeSymbols />
      <TechObjects />
      <ProgrammingLanguages />

      {/* Environment lighting */}
      <Environment preset="city" />
    </>
  )
}

export default function CSE3DBackground() {
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
        {!isMobile && <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />}
      </Canvas>
    </div>
  )
}
