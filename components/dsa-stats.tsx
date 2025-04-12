"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

export default function DSAStats() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])
  const { theme } = useTheme()

  const [dsaStats, setDsaStats] = useState({
    leetcodeRanking: "#0",
    totalSolved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    easyPercentage: 0,
    mediumPercentage: 0,
    hardPercentage: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/leetcode-stats")
      const data = await res.json()

      if (data.error) {
        console.error("Error fetching LeetCode stats:", data.error)
        return
      }

      setDsaStats({
        leetcodeRanking: data.leetcodeRanking,
        totalSolved: data.totalSolved,
        easy: data.easy,
        medium: data.medium,
        hard: data.hard,
        easyPercentage: data.easyPercentage,
        mediumPercentage: data.mediumPercentage,
        hardPercentage: data.hardPercentage,
      })
    }

    fetchStats()
  }, [])

  return (
    <section id="dsa" className="py-20 w-full bg-muted/30" ref={containerRef}>
      <motion.div className="container mx-auto px-4" style={{ opacity, scale }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Problem Solving
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">DSA Challenges</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Showcasing my problem-solving skills through Data Structures and Algorithms challenges.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Card className="h-full border-border/50 bg-background/80 dark:bg-slate-800/90 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle className="text-center">Problems Solved</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={theme === "dark" ? "#1e293b" : "#e2e8f0"}
                      strokeWidth="10"
                    />
                    {dsaStats.hardPercentage > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="10"
                        strokeDasharray={`${dsaStats.hardPercentage * 2.83} 283`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    )}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="10"
                      strokeDasharray={`${dsaStats.mediumPercentage * 2.83} 283`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="10"
                      strokeDasharray={`${dsaStats.easyPercentage * 2.83} 283`}
                      strokeDashoffset={`${-dsaStats.mediumPercentage * 2.83}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold">{dsaStats.totalSolved}</span>
                    <span className="text-sm text-muted-foreground">Problems</span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Easy {dsaStats.easyPercentage}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Medium {dsaStats.mediumPercentage}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Hard {dsaStats.hardPercentage}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="h-full border-border/50 bg-background/80 dark:bg-slate-800/90 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>LeetCode Ranking</span>
                  <Badge variant="outline" className="text-lg font-mono">
                    {dsaStats.leetcodeRanking}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Total Solved</span>
                      <span className="text-sm font-medium">{dsaStats.totalSolved}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Easy</span>
                      <span className="text-sm font-medium">{dsaStats.easy}</span>
                    </div>
                    <Progress value={(dsaStats.easy / dsaStats.totalSolved) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Medium</span>
                      <span className="text-sm font-medium">{dsaStats.medium}</span>
                    </div>
                    <Progress value={(dsaStats.medium / dsaStats.totalSolved) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Hard</span>
                      <span className="text-sm font-medium">{dsaStats.hard}</span>
                    </div>
                    <Progress value={(dsaStats.hard / dsaStats.totalSolved) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
