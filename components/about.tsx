"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, GraduationCap, Award, Heart, Coffee } from "lucide-react"
import { useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface TimelineItem {
  id: number
  title: string
  organization: string
  period: string
  description: string
  type: "work" | "education" | "award"
}

const timelineItems: TimelineItem[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    organization: "Tech Solutions Inc.",
    period: "2021 - Present",
    description:
      "Leading the frontend development team, implementing modern UI/UX practices, and optimizing application performance.",
    type: "work",
  },
  {
    id: 2,
    title: "Frontend Developer",
    organization: "Digital Innovations",
    period: "2018 - 2021",
    description:
      "Developed responsive web applications using React, implemented state management solutions, and collaborated with design teams.",
    type: "work",
  },
  {
    id: 3,
    title: "Master of Computer Science",
    organization: "University of Technology",
    period: "2016 - 2018",
    description:
      "Specialized in Human-Computer Interaction and Web Technologies with a focus on modern frontend frameworks.",
    type: "education",
  },
  {
    id: 4,
    title: "Best Web Application Award",
    organization: "Web Dev Conference",
    period: "2020",
    description:
      "Received recognition for developing an innovative web application with exceptional user experience and performance.",
    type: "award",
  },
  {
    id: 5,
    title: "Bachelor of Computer Science",
    organization: "State University",
    period: "2012 - 2016",
    description: "Graduated with honors, focusing on software development and web technologies.",
    type: "education",
  },
]

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  const getIcon = (type: string) => {
    switch (type) {
      case "work":
        return <Briefcase className="h-6 w-6" />
      case "education":
        return <GraduationCap className="h-6 w-6" />
      case "award":
        return <Award className="h-6 w-6" />
      default:
        return <Briefcase className="h-6 w-6" />
    }
  }

  return (
    <section id="about" className="py-20 w-full bg-muted/30" ref={containerRef}>
      <motion.div className="container mx-auto px-4" style={{ opacity, scale }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            About Me
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I'm a passionate developer with expertise in creating modern web applications. With a strong foundation in
            both frontend and backend technologies, I strive to build intuitive and performant digital experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-lg animate-pulse-slow"></div>
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] shadow-xl">
              <Image src="/about-image.jpg" alt="Ayush Raj working on a project" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
            </div>

            {/* Stats */}
            <div className="absolute -bottom-6 -right-6 bg-background/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-border/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Coffee className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">1,250+</div>
                    <div className="text-xs text-muted-foreground">Cups of Coffee</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-xs text-muted-foreground">Happy Clients</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold">Who Am I?</h3>
            <p className="text-muted-foreground">
              I'm Ayush Raj, a passionate Full-Stack Developer and UI/UX Designer with over 8 years of experience in
              creating digital solutions that combine functionality with aesthetic appeal.
            </p>
            <p className="text-muted-foreground">
              My journey in technology began with a curiosity about how things work, which evolved into a career
              dedicated to building intuitive and efficient web applications. I specialize in React, Next.js, and
              Node.js, with a strong focus on creating responsive, accessible, and performant user interfaces.
            </p>
            <p className="text-muted-foreground">
              When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or
              sharing my knowledge through blog posts and community events.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <div className="font-medium">Name:</div>
                <div className="text-muted-foreground">Ayush Raj</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Email:</div>
                <div className="text-muted-foreground">1raj.aayush@gmail.com</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Location:</div>
                <div className="text-muted-foreground">Patna, Bihar-20</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Availability:</div>
                <div className="text-primary font-medium">Open for opportunities</div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8 text-center"
        >
          Experience & Education
        </motion.h3>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>

          {/* Timeline items */}
          {timelineItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "relative mb-8",
                index % 2 === 0 ? "md:ml-auto md:mr-[50%] md:pr-8" : "md:mr-auto md:ml-[50%] md:pl-8",
              )}
              style={{ width: "calc(50% - 20px)" }}
            >
              <Card className="h-full border-border/50 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div
                    className={cn(
                      "absolute top-6 z-10 bg-background rounded-full p-2 border border-border shadow-md",
                      index % 2 === 0
                        ? "left-1/2 transform -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 md:translate-x-1/2"
                        : "left-1/2 transform -translate-x-1/2 md:left-0 md:-translate-x-1/2",
                    )}
                  >
                    {getIcon(item.type)}
                  </div>
                  <div className={cn("pt-10", index % 2 === 0 ? "md:text-right" : "")}>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-primary font-medium">{item.organization}</p>
                    <p className="text-sm text-muted-foreground mb-2">{item.period}</p>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
