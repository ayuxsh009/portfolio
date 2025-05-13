"use client";
import Link from 'next/link';

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Code,
} from "lucide-react";
import Image from "next/image";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import SectionHeading from "./section-heading";
import AnimatedTooltip from "./animated-tooltip";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
  demo: string;
  featured: boolean;
  color: string;
  keyFeatures: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Kavach - Women Safety Web Application",
    description:
      "A women safety web app with real-time emergency alerts, live location sharing, complaint filing, and admin monitoring dashboard.",
    image: "/project1.png",
    technologies: ["React", "Node.js", "MongoDB", "Tailwind CSS", "javascript"],
    github: "https://github.com/ayuxsh009/Kavach",
    demo: "https://kavach-3hfl.onrender.com/",
    featured: true,
    color: "#3b82f6",
    keyFeatures: [
      "🚨 Emergency alerts with real-time live location sharing",
      "📝 File complaints with evidence upload and status tracking",
      "👮‍♀️ Admin dashboard to manage users and monitor activity",
      "📍 Google Maps integration for accurate location tracking",
      "🔔 Real-time notifications for updates and alerts",
      "🧑‍💼 User authentication and profile management",
    ],
  },
  {
    id: 2,
    title:
      "Saarthi: Empowering Rural Education through Interactive Learning and Gamification",
    description:
      "A rural education web app designed to empower children with interactive learning, gamified elements, and a responsive, user-friendly interface.",
    image: "/project2.png",
    technologies: [
      "Next.js",
      "OpenAI",
      "Tailwind CSS",
      "Vercel",
      "Javascript",
      "Typescript",
    ],
    github: "https://github.com/ayuxsh009/Saarthi_PR201",
    demo: "https://saarthi-pr-201.vercel.app/",
    featured: true,
    color: "#8b5cf6",
    keyFeatures: [
      "🧑‍💼 User authentication and profile management",
      "📚 Interactive learning modules with gamified features",
      "📱 Responsive design for seamless use on any device",
      "🔄 Real-time progress tracking for students",
      "🔔 Instant notifications for updates and new content",
      "🎮 Game-like rewards and challenges to motivate learning",
    ],
  },
  {
    id: 3,
    title: "Interview Prep Hub: AI-Powered Interview Preparation",
    description:
      "An AI-powered interview preparation platform offering personalized content, flashcards, quizzes, notes, and your ",
    image: "/connected-conversations.png",
    technologies: ["Next.js",
      "OpenAI",
      "Tailwind CSS",
      "Vercel",
      "Javascript",
      "Typescript",
    "PostgreSQL"],
    github: "https://github.com/ayuxsh009/Interview-Wrapper-Prep",
    demo: "https://interview-wrapper-prep.vercel.app/",
    featured: false,
    color: "#ec4899",
    keyFeatures: [
      "🧠 AI-curated learning paths for personalized interview prep",
      "📚 Structured courses, quizzes, and coding challenges",
      "🧩 DSA problems with AI-generated hints and solutions",
      "🎮 Gamified dashboard with progress tracking and achievements",
      "🤖 AI-powered mock interviews for DSA and behavioral questions",
      "📈 Detailed performance analytics and feedback",
      "📂 Curated library of resources, templates, and cheat sheets",
    ],
  },
  {
    id: 4,
    title:
      "Mentor Connect: Book 1:1 Sessions, Share Doubts & Learn Directly from Experts",
    description:
      "A personalized mentorship platform for booking one-on-one sessions, sharing doubts, and collaborating with experts via live calls and note sharing.",
    image: "/p4.png",
    technologies: ["Next.js",
      "OpenAI",
      "Tailwind CSS",
      "Vercel",
      "Javascript",
      "Typescript",],
    github: "https://github.com/ayuxsh009/Mentor-Meet-Booking",
    demo: "https://saarthi-mentor-meet-booking.vercel.app/",
    featured: false,
    color: "#10b981",
    keyFeatures: [
      "📅 Book one-on-one mentor sessions with real-time availability",
      "📞 Live video/audio calls for personalized guidance",
      "📤 Share doubts and notes before or during the call",
      "📝 Upload and discuss code snippets, questions, or documents",
      "🧑‍🏫 Expert mentors from top tech backgrounds",
      "🔔 Session reminders and follow-up notifications",
      "📂 Access session history, shared resources, and notes",
      "🧭 Smart mentor recommendations based on user needs",
    ],
  },
  {
    id: 5,
    title: "AI-Integrated Interview Platform: Real-Time Coding, AI Bot & Proctoring",
    description:
      "A comprehensive AI-powered interview platform that combines real-time coding, AI-driven mock interviews, Zoom-style video calls, and intelligent proctoring for fair and effective candidate evaluation.",
    image: "/futuristic-portfolio-display.png", // Replace with your actual image path or name
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Clerk",
      "Convex",
      "NeonDB",
      "RxDB",
      "OpenAI",
      "ElevenLabs",
      "Gemini API"
    ],
    github: "https://github.com/supernova0311/interview-wrapper",
    demo: "https://interview-wrapper.vercel.app/",
    featured: true,
    color: "#3b82f6", // Tailwind's blue-500, adjust as needed
    keyFeatures: [
      "📹 Zoom-style interview rooms with voice/video calls and custom controls",
      "💻 Real-time collaborative code editor with syntax highlighting and multi-language support",
      "🤖 AI Interview Bot for DSA and behavioral interviews using OpenAI and Gemini",
      "🗣 Voice synthesis with ElevenLabs and real-time speech-to-text via Whisper",
      "🧠 Tracks candidate tone, hesitation, and explanation depth",
      "📚 AI-curated interview prep hub with quizzes, challenges, and gamified progress tracking",
      "🛡 Anti-cheating system with tab-switch detection, webcam monitoring, and emotion analysis",
      "📊 AI-generated post-interview reports with behavioral and risk analysis"
    ]
  },
  
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );

  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [currentProject, setCurrentProject] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const featuredProjects = projects.filter((project) => project.featured);
  const isMobile = useMobile();

  const nextProject = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentProject((prev) => (prev + 1) % featuredProjects.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevProject = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentProject(
      (prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextProject();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <section
      id="projects"
      className="py-20 w-full bg-background overflow-hidden"
      ref={containerRef}
    >
      <motion.div className="container mx-auto px-4" style={{ opacity, scale }}>
        <SectionHeading
          badge="My Work"
          title="Featured Projects"
          description="Explore my recent work and projects that showcase my skills and expertise in web development and design."
        />

        {/* Featured Project Carousel */}
        <div className="mb-16 relative">
          <div className="overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden group">
                    <div
                      className="absolute inset-0 opacity-20 z-0"
                      style={{
                        backgroundColor: featuredProjects[currentProject].color,
                      }}
                    ></div>
                    <Image
                      src={
                        featuredProjects[currentProject].image ||
                        "/placeholder.svg"
                      }
                      alt={featuredProjects[currentProject].title}
                      fill
                      className="object-cover z-10 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 z-20">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {featuredProjects[currentProject].title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {featuredProjects[currentProject].technologies.map(
                            (tech) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="bg-white/20 text-white"
                              >
                                {tech}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        {featuredProjects[currentProject].title}
                      </h3>
                      <p className="text-muted-foreground">
                        {featuredProjects[currentProject].description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Key Features</h4>
                      <ul className="space-y-2">
                        {featuredProjects[currentProject].keyFeatures.map(
                          (feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span
                                className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{
                                  backgroundColor: `${featuredProjects[currentProject].color}20`,
                                }}
                              >
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{
                                    backgroundColor:
                                      featuredProjects[currentProject].color,
                                  }}
                                ></span>
                              </span>
                              <span>{feature}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="flex gap-4">
                      <AnimatedTooltip content="View live demo">
                        <Button
                          asChild
                          variant="default"
                          style={{
                            backgroundColor:
                              featuredProjects[currentProject].color,
                          }}
                          className="transition-transform hover:scale-105"
                        >
                          <a
                            href={featuredProjects[currentProject].demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink size={16} />
                            Live Demo
                          </a>
                        </Button>
                      </AnimatedTooltip>
                      <AnimatedTooltip content="View source code on GitHub">
                        <Button
                          asChild
                          variant="outline"
                          className="transition-transform hover:scale-105"
                        >
                          <a
                            href={featuredProjects[currentProject].github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Github size={16} />
                            View Code
                          </a>
                        </Button>
                      </AnimatedTooltip>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {featuredProjects.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-30 hover:scale-110 transition-transform"
                onClick={prevProject}
                disabled={isAnimating}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 md:translate-x-12 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-30 hover:scale-110 transition-transform"
                onClick={nextProject}
                disabled={isAnimating}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              <div className="flex justify-center mt-6 gap-2">
                {featuredProjects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isAnimating) {
                        setIsAnimating(true);
                        setCurrentProject(index);
                        setTimeout(() => setIsAnimating(false), 500);
                      }
                    }}
                    className={cn(
                      "h-3 w-12 rounded-full transition-all duration-300",
                      currentProject === index
                        ? "bg-primary"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8 text-center"
        >
          All Projects
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              className="h-full"
            >
              <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg group border-border/50 hover:border-primary/30">
                <div className="relative h-60 overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20 z-0"
                    style={{ backgroundColor: project.color }}
                  ></div>
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className={`object-cover transition-transform duration-700 z-10 ${
                      hoveredProject === project.id ? "scale-110" : "scale-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <div className="flex gap-4 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
                      <AnimatedTooltip content="View source code">
                        <Button
                          size="sm"
                          variant="secondary"
                          asChild
                          className="backdrop-blur-sm"
                        >
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Github size={16} />
                            Code
                          </a>
                        </Button>
                      </AnimatedTooltip>
                      <AnimatedTooltip content="View live demo">
                        <Button
                          size="sm"
                          asChild
                          style={{ backgroundColor: project.color }}
                        >
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink size={16} />
                            Demo
                          </a>
                        </Button>
                      </AnimatedTooltip>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    ></span>
                    {project.title}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-secondary/50"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="https://github.com/ayuxsh009?tab=repositories">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 hover:scale-105 transition-transform"
          >
            <Code size={16} />
            View All Projects
          </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
