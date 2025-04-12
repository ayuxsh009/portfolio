"use client"

import { useTheme } from "next-themes"
import { Environment, Grid } from "@react-three/drei"

// Main scene component - minimal version without 3D objects
export default function Scene() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <>
      <color attach="background" args={[isDark ? "#0f172a" : "#f8fafc"]} />

      {/* Basic lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />

      {/* Simple grid floor only */}
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

      {/* Subtle environment lighting */}
      <Environment preset="city" />
    </>
  )
}
