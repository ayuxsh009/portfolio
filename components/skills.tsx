"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useMobile } from "@/hooks/use-mobile"

interface Skill {
  name: string
  level: number
  category: "frontend" | "backend" | "design" | "other"
  icon: string
  description: string
  color: string
}

const skills: Skill[] = [
  {
    name: "React",
    level: 90,
    category: "frontend",
    icon: "react-icon.png",
    description:
      "Building interactive UIs with React and its ecosystem including hooks, context, and state management.",
    color: "#61dafb",
  },
  {
    name: "Next.js",
    level: 85,
    category: "frontend",
    icon: "nextjs-icon.png",
    description: "Creating server-rendered React applications with optimized performance and SEO.",
    color: "#000000",
  },
  {
    name: "TypeScript",
    level: 80,
    category: "frontend",
    icon: "typescript-icon.png",
    description: "Developing type-safe applications with enhanced developer experience and fewer runtime errors.",
    color: "#3178c6",
  },
  {
    name: "Three.js",
    level: 75,
    category: "frontend",
    icon: "threejs-icon.png",
    description: "Implementing 3D graphics and animations for immersive web experiences.",
    color: "#049ef4",
  },
  {
    name: "Node.js",
    level: 80,
    category: "backend",
    icon: "nodejs-icon.png",
    description: "Building scalable server-side applications and APIs with JavaScript.",
    color: "#339933",
  },
  {
    name: "Express",
    level: 75,
    category: "backend",
    icon: "express-icon.png",
    description: "Creating robust web servers and RESTful APIs with minimal overhead.",
    color: "#000000",
  },
  {
    name: "MongoDB",
    level: 70,
    category: "backend",
    icon: "mongodb-icon.png",
    description: "Designing and implementing NoSQL database solutions for flexible data storage.",
    color: "#47A248",
  },
  {
    name: "PostgreSQL",
    level: 65,
    category: "backend",
    icon: "postgresql-icon.png",
    description: "Managing relational databases with advanced querying capabilities.",
    color: "#336791",
  },
  {
    name: "Figma",
    level: 85,
    category: "design",
    icon: "figma-icon.png",
    description: "Creating UI/UX designs, prototypes, and design systems for web and mobile applications.",
    color: "#F24E1E",
  },
  {
    name: "Tailwind CSS",
    level: 90,
    category: "frontend",
    icon: "tailwind-icon.png",
    description: "Rapidly building custom user interfaces without leaving HTML using utility classes.",
    color: "#06B6D4",
  },
  {
    name: "Docker",
    level: 60,
    category: "other",
    icon: "docker-icon.png",
    description: "Containerizing applications for consistent development, testing, and production environments.",
    color: "#2496ED",
  },
  {
    name: "AWS",
    level: 65,
    category: "other",
    icon: "aws-icon.png",
    description: "Deploying and managing cloud infrastructure for scalable web applications.",
    color: "#FF9900",
  },
]

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [mounted, setMounted] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("frontend")
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const { theme } = useTheme()
  const isMobile = useMobile()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <section id="skills" className="py-20 w-full bg-background overflow-hidden" ref={containerRef}>
      <motion.div className="container mx-auto px-4" style={{ opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            My Expertise
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Technologies</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I've worked with a variety of technologies and tools throughout my career. Here's a visualization of my
            technical expertise.
          </p>
        </motion.div>

        <Tabs defaultValue="frontend" className="w-full" onValueChange={setActiveCategory}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="frontend">Frontend</TabsTrigger>
              <TabsTrigger value="backend">Backend</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
          </div>

          {["frontend", "backend", "design", "other"].map((category) => (
            <TabsContent key={category} value={category} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="group"
                    >
                      <Card className="h-full transition-all duration-300 border-border/50 hover:shadow-lg hover:shadow-primary/10 hover:scale-105 bg-background/80 dark:bg-slate-800/90 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${skill.color}40` }}
                            >
                              <div className="relative w-8 h-8">
                                <img
                                  src={`/icons/${skill.icon}`}
                                  alt={skill.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg?height=32&width=32"
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-foreground dark:text-white">{skill.name}</h3>
                              <Badge
                                variant="default"
                                style={{ backgroundColor: skill.color, color: "#fff", fontWeight: "bold" }}
                              >
                                {skill.level}%
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm font-medium dark:text-slate-200">
                              <span>Proficiency</span>
                              <span>{skill.level}%</span>
                            </div>
                            <Progress
                              value={skill.level}
                              className="h-2"
                              indicatorClassName="group-hover:animate-pulse"
                              style={{
                                "--progress-background": skill.color,
                              }}
                            />
                          </div>

                          <p className="text-sm text-foreground dark:text-slate-200">{skill.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <motion.div className="mt-16 relative h-[300px] rounded-xl overflow-hidden" style={{ y }} ref={ref}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 backdrop-blur-sm">
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center max-w-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">Want to work together?</h3>
                <p className="mb-6">
                  I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
                </p>
                <motion.button
                  className="px-6 py-3 bg-primary text-white rounded-full font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const element = document.getElementById("contact")
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  Get In Touch
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
