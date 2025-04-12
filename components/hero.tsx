"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, Send, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import ThemeToggle from "./theme-toggle"
import Image from "next/image"
import Link from "next/link"
import ParticleBackground from "./particle-background"

export default function Hero() {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  if (!mounted) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <section
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      ref={containerRef}
    >
      {/* Custom cursor effect */}
      <div
        className={`fixed w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-50 transition-all duration-200 ease-out ${isHovering ? "scale-150 bg-primary/10" : "scale-100"}`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 z-40 flex justify-between items-center backdrop-blur-sm bg-background/30">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold"
        >
          <span className="text-primary">Portfolio</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {["Home", "Projects", "About", "Skills", "Contact"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Link
                href={`#${item.toLowerCase()}`}
                className="text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
        </div>

        <ThemeToggle />
      </div>

      {/* Particle background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <motion.div
          className="absolute top-[20%] left-[15%] w-16 h-16 md:w-24 md:h-24"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Image src="/geometric-shape-1.png" alt="Geometric Shape" fill className="object-contain" />
        </motion.div>

        <motion.div
          className="absolute bottom-[25%] right-[10%] w-20 h-20 md:w-32 md:h-32"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Image src="/geometric-shape-2.png" alt="Geometric Shape" fill className="object-contain" />
        </motion.div>

        <motion.div
          className="absolute top-[60%] left-[20%] w-12 h-12 md:w-20 md:h-20"
          animate={{
            y: [0, 10, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Image src="/geometric-shape-3.png" alt="Geometric Shape" fill className="object-contain" />
        </motion.div>
      </div>

      {/* Main content */}
      <motion.div
        className="container relative z-20 mx-auto px-4 flex flex-col items-center text-center"
        style={{ opacity, scale, y }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="backdrop-blur-sm bg-background/30 p-8 rounded-xl max-w-3xl border border-primary/20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/30">
              <Image src="/profile.jpg" alt="Profile" fill className="object-cover" />
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Hi, I'm{" "}
            <span className="text-primary relative">
              Ayush Raj
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-primary"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 1.2 }}
              />
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <TypewriterEffect texts={["Full-Stack Developer", "UI/UX Designer", "3D Enthusiast"]} />
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="gap-2 relative overflow-hidden group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-300 transform group-hover:translate-x-full opacity-30"></span>
              <Send size={18} />
              <span>Hire Me</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="gap-2 relative overflow-hidden group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span className="absolute inset-0 w-0 h-full bg-primary transition-all duration-300 transform group-hover:w-full opacity-10"></span>
              <Download size={18} />
              <span>Download CV</span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center"
        animate={{
          y: [0, 10, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <span className="text-sm text-muted-foreground mb-2">Scroll Down</span>
        <ChevronDown className="h-6 w-6 text-primary" />
      </motion.div>
    </section>
  )
}

// Typewriter effect component
function TypewriterEffect({ texts }: { texts: string[] }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const fullText = texts[currentTextIndex]

        if (!isDeleting) {
          setCurrentText(fullText.substring(0, currentText.length + 1))

          if (currentText === fullText) {
            setIsDeleting(true)
            setTimeout(() => {}, 1000) // Pause at the end
          }
        } else {
          setCurrentText(fullText.substring(0, currentText.length - 1))

          if (currentText === "") {
            setIsDeleting(false)
            setCurrentTextIndex((currentTextIndex + 1) % texts.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [currentText, currentTextIndex, isDeleting, texts])

  return (
    <div className="h-8 md:h-12">
      <h2 className="text-xl md:text-2xl text-muted-foreground inline-block">
        {currentText}
        <span className="animate-pulse">|</span>
      </h2>
    </div>
  )
}
