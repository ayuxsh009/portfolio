"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface FloatingElement {
  id: number
  x: string
  y: string
  size: number
  duration: number
  delay: number
  rotate: number
  shape: "circle" | "square" | "triangle" | "donut" | "cross"
}

export default function FloatingElements() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Generate random floating elements
  const elements: FloatingElement[] = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 90 + 5}%`,
    y: `${Math.random() * 90 + 5}%`,
    size: Math.random() * 40 + 10,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    rotate: Math.random() * 360,
    shape: ["circle", "square", "triangle", "donut", "cross"][Math.floor(Math.random() * 5)] as any,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: element.x,
            top: element.y,
            width: element.size,
            height: element.size,
          }}
          animate={{
            y: ["-20px", "20px", "-20px"],
            x: ["-20px", "20px", "-20px"],
            rotate: [element.rotate, element.rotate + 180, element.rotate + 360],
          }}
          transition={{
            duration: element.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          {element.shape === "circle" && (
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `linear-gradient(45deg, ${
                  theme === "dark"
                    ? "rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3)"
                    : "rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2)"
                })`,
                border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
              }}
            />
          )}
          {element.shape === "square" && (
            <div
              className="w-full h-full rounded-md"
              style={{
                background: `linear-gradient(45deg, ${
                  theme === "dark"
                    ? "rgba(168, 85, 247, 0.3), rgba(99, 102, 241, 0.3)"
                    : "rgba(168, 85, 247, 0.2), rgba(99, 102, 241, 0.2)"
                })`,
                border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
              }}
            />
          )}
          {element.shape === "triangle" && (
            <div
              className="w-0 h-0"
              style={{
                borderLeft: `${element.size / 2}px solid transparent`,
                borderRight: `${element.size / 2}px solid transparent`,
                borderBottom: `${element.size}px solid ${
                  theme === "dark" ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.2)"
                }`,
              }}
            />
          )}
          {element.shape === "donut" && (
            <div
              className="w-full h-full rounded-full"
              style={{
                border: `${element.size / 4}px solid ${
                  theme === "dark" ? "rgba(236, 72, 153, 0.3)" : "rgba(236, 72, 153, 0.2)"
                }`,
              }}
            />
          )}
          {element.shape === "cross" && (
            <div className="relative w-full h-full">
              <div
                className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1/5"
                style={{
                  background: `linear-gradient(90deg, ${
                    theme === "dark"
                      ? "rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3)"
                      : "rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2)"
                  })`,
                }}
              />
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-1/5"
                style={{
                  background: `linear-gradient(180deg, ${
                    theme === "dark"
                      ? "rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3)"
                      : "rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2)"
                  })`,
                }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
