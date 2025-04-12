"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react"
import Link from "next/link"
import { useActiveSectionContext } from "./active-section-context"
import AnimatedTooltip from "./animated-tooltip"

export default function Footer() {
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-primary/10 rounded-full"></div>
                <div className="absolute inset-0.5 bg-background dark:bg-black rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">P</span>
                </div>
              </div>
              <span className="text-2xl font-bold">Portfolio</span>
            </div>

            <div className="flex gap-4 mb-6">
              <AnimatedTooltip content="GitHub">
                <motion.a
                  href="https://github.com/ayuxsh009"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
              </AnimatedTooltip>
              <AnimatedTooltip content="LinkedIn">
                <motion.a
                  href="https://www.linkedin.com/in/ayush-raj009/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>
              </AnimatedTooltip>
              <AnimatedTooltip content="Twitter">
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </motion.a>
              </AnimatedTooltip>
              <AnimatedTooltip content="Email me">
                <motion.a
                  href="mailto:1raj.aayush@gmail.com"
                  whileHover={{ y: -5 }}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </motion.a>
              </AnimatedTooltip>
            </div>

            <div className="flex gap-6 mb-8">
              {["Home", "Projects", "About", "Skills", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-muted-foreground hover:text-foreground transition-colors relative group"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveSection(item.toLowerCase() as any)
                    setTimeOfLastClick(Date.now())
                    const element = document.getElementById(item.toLowerCase())
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </motion.div>

          <div className="w-full h-px bg-border mb-8"></div>

          <div className="flex flex-col md:flex-row justify-between items-center w-full">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">© {currentYear} Ayush Raj. All rights reserved.</p>
            <AnimatedTooltip content="Back to top">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-primary/10 hover:bg-primary/20 hover:scale-110 transition-all"
                onClick={() => {
                  setActiveSection("home")
                  setTimeOfLastClick(Date.now())
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }}
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </AnimatedTooltip>
          </div>
        </div>
      </div>
    </footer>
  )
}
