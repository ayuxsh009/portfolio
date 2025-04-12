"use client"

import { useEffect, useState } from "react"
import HeroSection from "@/components/hero-section"
import Projects from "@/components/projects"
import About from "@/components/about"
import Skills from "@/components/skills"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import { useActiveSectionContext } from "@/components/active-section-context"
import dynamic from "next/dynamic"

// Import the DSA Stats component
import DSAStats from "@/components/dsa-stats"

// Fallback component
const FallbackBackground = () => (
  <div className="fixed inset-0 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800" />
)

// Dynamically import the minimal background with error handling


// Simple background as fallback
const Simple3DBackground = dynamic(
  () => import("@/components/simple-3d-background").catch(() => () => <FallbackBackground />),
  {
    ssr: false,
    loading: () => <FallbackBackground />,
  },
)

export default function Home() {
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext()
  const [backgroundError, setBackgroundError] = useState(false)
  const [useFallback, setUseFallback] = useState(false)

  // Add useEffect to handle hash navigation on page load
  useEffect(() => {
    // Handle hash navigation on page load
    if (typeof window !== "undefined") {
      const hash = window.location.hash
      if (hash) {
        const id = hash.replace("#", "")
        const element = document.getElementById(id)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" })
            setActiveSection(id as any)
            setTimeOfLastClick(Date.now())
          }, 100)
        }
      }
    }
  }, [setActiveSection, setTimeOfLastClick])

  // Add error handling for the 3D background
  useEffect(() => {
    const handleError = (event) => {
      // Safely handle the error event
      if (
        event &&
        event.message &&
        (event.message.includes("three") ||
          event.message.includes("webgl") ||
          event.message.includes("canvas") ||
          event.message.includes("undefined"))
      ) {
        // Try the fallback first
        if (!useFallback) {
          setUseFallback(true)
        } else {
          // If fallback also fails, show static background
          setBackgroundError(true)
        }
      }
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [useFallback])

  // Render the appropriate background
  const renderBackground = () => {
    if (backgroundError) {
      return <FallbackBackground />
    } else if (useFallback) {
      return <Simple3DBackground />
    } 
  }

  // Add the DSAStats component to the main component's return statement, right after Skills component
  return (
    <main className="relative">
      {renderBackground()}

      <HeroSection />
      <Projects />
      <About />
      <Skills />
      <DSAStats />
      <Contact />
      <Footer />
    </main>
  )
}
