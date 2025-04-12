"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AnimatedTooltipProps {
  children: React.ReactNode
  content: string
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
}

export default function AnimatedTooltip({ children, content, position = "top", delay = 300 }: AnimatedTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  if (!isMounted) return <>{children}</>

  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2"
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2"
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2"
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2"
      default:
        return "bottom-full left-1/2 -translate-x-1/2 mb-2"
    }
  }

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={`absolute z-50 whitespace-nowrap px-3 py-1.5 rounded-md bg-background border border-border text-sm font-medium shadow-md ${getPositionStyles()}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            {content}
            <div
              className={`absolute w-2 h-2 bg-background border border-border transform rotate-45 ${
                position === "top"
                  ? "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-0 border-l-0"
                  : position === "bottom"
                    ? "top-[-4px] left-1/2 -translate-x-1/2 border-b-0 border-r-0"
                    : position === "left"
                      ? "right-[-4px] top-1/2 -translate-y-1/2 border-l-0 border-b-0"
                      : "left-[-4px] top-1/2 -translate-y-1/2 border-r-0 border-t-0"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
