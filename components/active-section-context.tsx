"use client"

import type React from "react"

import { createContext, useState, useContext, useEffect } from "react"

type SectionName = "home" | "projects" | "about" | "skills" | "contact"

type ActiveSectionContextType = {
  activeSection: SectionName
  setActiveSection: React.Dispatch<React.SetStateAction<SectionName>>
  timeOfLastClick: number
  setTimeOfLastClick: React.Dispatch<React.SetStateAction<number>>
}

export const ActiveSectionContext = createContext<ActiveSectionContextType | null>(null)

export default function ActiveSectionContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeSection, setActiveSection] = useState<SectionName>("home")
  const [timeOfLastClick, setTimeOfLastClick] = useState(0) // to disable observer temporarily when user clicks

  useEffect(() => {
    const handleScroll = () => {
      // Don't run if user just clicked - wait 1 second
      if (Date.now() - timeOfLastClick < 1000) return

      const sections = ["home", "projects", "about", "skills", "testimonials", "contact"] as SectionName[]

      const sectionElements = sections
        .map((section) => document.getElementById(section))
        .filter(Boolean) as HTMLElement[]

      const currentPosition = window.scrollY + window.innerHeight / 3

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i]
        if (section.offsetTop <= currentPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [timeOfLastClick])

  return (
    <ActiveSectionContext.Provider
      value={{
        activeSection,
        setActiveSection,
        timeOfLastClick,
        setTimeOfLastClick,
      }}
    >
      {children}
    </ActiveSectionContext.Provider>
  )
}

export function useActiveSectionContext() {
  const context = useContext(ActiveSectionContext)
  if (context === null) {
    throw new Error("useActiveSectionContext must be used within an ActiveSectionContextProvider")
  }
  return context
}
