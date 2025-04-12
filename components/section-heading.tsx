"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SectionHeadingProps {
  badge: string
  title: string
  description: string
  className?: string
  textAlignment?: "left" | "center" | "right"
}

export default function SectionHeading({
  badge,
  title,
  description,
  className,
  textAlignment = "center",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={cn(
        "mb-16",
        textAlignment === "center" && "text-center",
        textAlignment === "left" && "text-left",
        textAlignment === "right" && "text-right",
        className,
      )}
    >
      <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
        {badge}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
    </motion.div>
  )
}
