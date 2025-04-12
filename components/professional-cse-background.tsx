"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import { Environment, Float, Text, Box, Plane, OrbitControls, PerspectiveCamera, Line, Grid } from "@react-three/drei"
import * as THREE from "three"
import { useMobile } from "@/hooks/use-mobile"

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
      fadeDistance={50}
      fadeStrength={1}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  )
}

// Clean, professional code blocks
function CodeBlocks({ count = 6 }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const groupRef = useRef()

  // Sample code snippets (short and clean)
  const codeSnippets = [
    "function main() {\n  return data;\n}",
    "class Node {\n  constructor() {\n    this.value = 0;\n  }\n}",
    "const api = {\n  getData() {\n    return fetch('/api');\n  }\n};",
    "import { useState } from 'react';\n\nexport default function App() {\n  return <div />;\n}",
    "SELECT id, name\nFROM users\nWHERE active = true;",
    "def process(data):\n    return [x for x in data\n            if x > 0]",
  ]

  const blocks = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const snippet = codeSnippets[i % codeSnippets.length]
      const position = [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10 + 5, (Math.random() - 0.5) * 10 - 15]
      const rotation = [Math.random() * 0.1 - 0.05, Math.random() * Math.PI * 2, Math.random() * 0.1 - 0.05]
      const scale = Math.random() * 0.5 + 0.7

      temp.push({
        snippet,
        position,
        rotation,
        scale,
        speed: Math.random() * 0.01 + 0.005,
      })
    }
    return temp
  }, [count])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      child.rotation.y += blocks[i].speed
    })
  })

  return (
    <group ref={groupRef}>
      {blocks.map((block, i) => (
        <group key={i} position={block.position} rotation={block.rotation} scale={block.scale}>
          {/* Code block background */}
          <Plane args={[6, 4]} receiveShadow>
            <meshStandardMaterial
              color={isDark ? "#1e293b" : "#f8fafc"}
              metalness={0.1}
              roughness={0.8}
              opacity={0.9}
              transparent
            />
          </Plane>

          {/* Code text */}
          <Text
            position={[0, 0, 0.1]}
            fontSize={0.3}
            maxWidth={5}
            lineHeight={1.2}
            letterSpacing={0.02}
            textAlign="left"
            font="/fonts/GeistMono-Regular.ttf"
            color={isDark ? "#94a3b8" : "#334155"}
            anchorX="center"
            anchorY="middle"
          >
            {block.snippet}
          </Text>
        </group>
      ))}
    </group>
  )
}

// Professional data visualization elements
function DataVisualizations() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const groupRef = useRef()

  // Create bar chart data
  const barChart = useMemo(() => {
    const bars = []
    const barCount = 8
    const width = 6
    const spacing = width / barCount
    const barWidth = spacing * 0.7

    for (let i = 0; i < barCount; i++) {
      const height = Math.random() * 2 + 0.5
      bars.push({
        position: [-width / 2 + i * spacing + spacing / 2, height / 2, 0],
        size: [barWidth, height, barWidth],
        color: isDark ? `hsl(${210 + i * 10}, 70%, ${40 + i * 5}%)` : `hsl(${210 + i * 10}, 80%, ${50 + i * 3}%)`,
      })
    }

    return {
      position: [8, 0, -20],
      rotation: [0, -Math.PI / 6, 0],
      bars,
    }
  }, [isDark])

  // Create pie chart data
  const pieChart = useMemo(() => {
    const segments = []
    const segmentCount = 5
    const radius = 2
    let startAngle = 0

    for (let i = 0; i < segmentCount; i++) {
      const angle = (Math.random() * 0.3 + 0.1) * Math.PI * 2
      const endAngle = startAngle + angle

      // Create points for the segment
      const points = []
      points.push(new THREE.Vector3(0, 0, 0)) // Center

      const steps = 20
      for (let j = 0; j <= steps; j++) {
        const a = startAngle + (j / steps) * (endAngle - startAngle)
        const x = Math.cos(a) * radius
        const z = Math.sin(a) * radius
        points.push(new THREE.Vector3(x, 0, z))
      }

      segments.push({
        points,
        color: isDark ? `hsl(${210 + i * 30}, 70%, ${40 + i * 8}%)` : `hsl(${210 + i * 30}, 80%, ${50 + i * 5}%)`,
      })

      startAngle = endAngle
    }

    return {
      position: [-8, 0, -20],
      rotation: [Math.PI / 2, 0, Math.PI / 6],
      segments,
    }
  }, [isDark])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.001
  })

  return (
    <group ref={groupRef}>
      {/* Bar Chart */}
      <group position={barChart.position} rotation={barChart.rotation}>
        {/* Base */}
        <Plane args={[8, 8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <meshStandardMaterial
            color={isDark ? "#1e293b" : "#f8fafc"}
            metalness={0.1}
            roughness={0.8}
            opacity={0.7}
            transparent
          />
        </Plane>

        {/* Bars */}
        {barChart.bars.map((bar, i) => (
          <Box key={i} position={bar.position} args={bar.size} castShadow>
            <meshStandardMaterial color={bar.color} metalness={0.2} roughness={0.7} />
          </Box>
        ))}

        {/* Chart title */}
        <Text
          position={[0, 3.5, 0]}
          fontSize={0.4}
          font="/fonts/Inter-Bold.ttf"
          color={isDark ? "#e2e8f0" : "#334155"}
          anchorX="center"
          anchorY="middle"
        >
          Data Analysis
        </Text>
      </group>

      {/* Pie Chart */}
      <group position={pieChart.position} rotation={pieChart.rotation}>
        {/* Base */}
        <Plane args={[6, 6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <meshStandardMaterial
            color={isDark ? "#1e293b" : "#f8fafc"}
            metalness={0.1}
            roughness={0.8}
            opacity={0.7}
            transparent
          />
        </Plane>

        {/* Pie segments */}
        {pieChart.segments.map((segment, i) => (
          <mesh key={i} castShadow>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={segment.points.length}
                array={new Float32Array(segment.points.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <meshStandardMaterial color={segment.color} metalness={0.2} roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* Chart title */}
        <Text
          position={[0, 0.5, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.4}
          font="/fonts/Inter-Bold.ttf"
          color={isDark ? "#e2e8f0" : "#334155"}
          anchorX="center"
          anchorY="middle"
        >
          Resource Allocation
        </Text>
      </group>
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
    "Database Systems",
    "Networking",
    "Operating Systems",
    "Artificial Intelligence",
    "Web Development",
    "Mobile Development",
  ]

  return (
    <group>
      {keywords.map((keyword, i) => (
        <Float
          key={i}
          speed={0.5}
          rotationIntensity={0.2}
          floatIntensity={0.2}
          position={[(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 15, Math.random() * -30 - 10]}
        >
          <Text
            fontSize={0.6}
            color={isDark ? ["#3b82f6", "#2563eb", "#1d4ed8"][i % 3] : ["#3b82f6", "#2563eb", "#1d4ed8"][i % 3]}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.ttf"
          >
            {keyword}
          </Text>
        </Float>
      ))}
    </group>
  )
}

// Clean, professional circuit board pattern
function CircuitPattern() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const groupRef = useRef()

  // Create a grid-based circuit pattern
  const circuitLines = useMemo(() => {
    const lines = []
    const gridSize = 5
    const spacing = 2

    // Create horizontal and vertical lines
    for (let i = -gridSize; i <= gridSize; i++) {
      // Skip some lines for a more interesting pattern
      if (Math.random() > 0.7) continue

      // Horizontal line
      const hPoints = []
      let x = -gridSize * spacing
      while (x <= gridSize * spacing) {
        hPoints.push(new THREE.Vector3(x, i * spacing, 0))

        // Add some random turns
        if (Math.random() > 0.7 && x < gridSize * spacing - spacing) {
          const turnLength = Math.floor(Math.random() * 3) + 1
          const direction = Math.random() > 0.5 ? 1 : -1

          // Add vertical segment
          for (let j = 1; j <= turnLength; j++) {
            hPoints.push(new THREE.Vector3(x, i * spacing + j * spacing * direction, 0))
          }

          x += spacing
          hPoints.push(new THREE.Vector3(x, i * spacing + turnLength * spacing * direction, 0))

          // Continue from new position
          i += turnLength * direction
        }

        x += spacing
      }

      if (hPoints.length > 1) {
        lines.push({
          points: hPoints,
          color: isDark ? "#3b82f6" : "#2563eb",
          lineWidth: 1.5,
        })
      }

      // Vertical line
      if (Math.random() > 0.7) continue

      const vPoints = []
      let y = -gridSize * spacing
      while (y <= gridSize * spacing) {
        vPoints.push(new THREE.Vector3(i * spacing, y, 0))

        // Add some random turns
        if (Math.random() > 0.7 && y < gridSize * spacing - spacing) {
          const turnLength = Math.floor(Math.random() * 3) + 1
          const direction = Math.random() > 0.5 ? 1 : -1

          // Add horizontal segment
          for (let j = 1; j <= turnLength; j++) {
            vPoints.push(new THREE.Vector3(i * spacing + j * spacing * direction, y, 0))
          }

          y += spacing
          vPoints.push(new THREE.Vector3(i * spacing + turnLength * spacing * direction, y, 0))

          // Continue from new position
          i += turnLength * direction
        }

        y += spacing
      }

      if (vPoints.length > 1) {
        lines.push({
          points: vPoints,
          color: isDark ? "#3b82f6" : "#2563eb",
          lineWidth: 1.5,
        })
      }
    }

    // Add some connection nodes
    const nodes = []
    for (let i = -gridSize + 1; i < gridSize; i++) {
      for (let j = -gridSize + 1; j < gridSize; j++) {
        if (Math.random() > 0.9) {
          nodes.push({
            position: [i * spacing, j * spacing, 0],
            radius: Math.random() * 0.2 + 0.1,
            color: isDark ? "#60a5fa" : "#3b82f6",
          })
        }
      }
    }

    return { lines, nodes }
  }, [isDark])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.z += 0.0005
  })

  return (
    <group ref={groupRef} position={[0, 0, -40]} rotation={[Math.PI / 6, 0, 0]}>
      {circuitLines.lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          color={line.color}
          lineWidth={line.lineWidth}
          alphaTest={0.5}
          transparent={true}
          opacity={0.8}
        />
      ))}

      {circuitLines.nodes.map((node, i) => (
        <mesh key={`node-${i}`} position={node.position}>
          <sphereGeometry args={[node.radius, 16, 16]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
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
      <color attach="background" args={[theme === "dark" ? "#0f172a" : "#f8fafc"]} />

      {/* Professional lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.2} color={theme === "dark" ? "#3b82f6" : "#60a5fa"} />

      {/* Professional CSE-themed elements */}
      <GridFloor />
      <CodeBlocks count={isMobile ? 3 : 6} />
      <DataVisualizations />
      <TechKeywords />
      <CircuitPattern />

      {/* Environment lighting */}
      <Environment preset="city" />
    </>
  )
}

export default function ProfessionalCSEBackground() {
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
        shadows
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
