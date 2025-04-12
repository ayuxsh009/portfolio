"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Download,
  Send,
  Menu,
  X,
  Code,
  Terminal,
  Database,
  Server,
} from "lucide-react";
import { useTheme } from "next-themes";
import ThemeToggle from "./theme-toggle";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useActiveSectionContext } from "./active-section-context";
import AnimatedTooltip from "./animated-tooltip";
import { Brain } from "lucide-react";
import { Layers } from "lucide-react";

export default function HeroSection() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useMobile();
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Projects", href: "#projects" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  if (!mounted) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section
      id="home"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      ref={containerRef}
    >
      {/* Header */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 w-full z-40 transition-all duration-300",
          scrolled ? "bg-background/80 backdrop-blur-md shadow-md py-2" : "py-4"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Link
              href="#home"
              onClick={() => {
                setActiveSection("home");
                setTimeOfLastClick(Date.now());
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div className="relative w-10 h-10 group">
                <div className="absolute inset-0 bg-primary/10 rounded-full transition-all duration-300 group-hover:bg-primary/20"></div>
                <div className="absolute inset-0.5 bg-background dark:bg-black rounded-full flex items-center justify-center">
                  <Code className="h-5 w-5 text-primary" />
                </div>
              </div>
            </Link>
            <Link
              href="#home"
              onClick={() => {
                setActiveSection("home");
                setTimeOfLastClick(Date.now());
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
                Portfolio
              </span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors relative group py-2",
                    activeSection === item.name.toLowerCase() &&
                      "text-foreground font-medium"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(item.name.toLowerCase() as any);
                    setTimeOfLastClick(Date.now());
                    const element = document.getElementById(
                      item.name.toLowerCase()
                    );
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {item.name}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                      activeSection === item.name.toLowerCase() && "w-full"
                    )}
                  ></span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <AnimatedTooltip
              content={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              <ThemeToggle />
            </AnimatedTooltip>
            <button
              className="md:hidden flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "text-muted-foreground hover:text-foreground transition-colors py-2 block",
                        activeSection === item.name.toLowerCase() &&
                          "text-foreground font-medium"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSection(item.name.toLowerCase() as any);
                        setTimeOfLastClick(Date.now());
                        setMobileMenuOpen(false);
                        const element = document.getElementById(
                          item.name.toLowerCase()
                        );
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        className="container relative z-20 mx-auto px-4 flex flex-col items-center"
        style={{ opacity, y, scale }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl">
          {/* Left column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-lg animate-pulse-slow"></div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-background/80 dark:border-black/80 shadow-2xl">
                <Image
                  src="/profile.jpg"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
              </div>

              {/* Tech-themed decorative elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 flex items-center justify-center text-primary">
                <Terminal className="h-5 w-5" />
              </div>

              <div className="absolute -bottom-4 -left-4 w-10 h-10 rounded-full bg-background dark:bg-black shadow-lg flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Code className="h-3 w-3 text-primary" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            >
              <span className="mr-2">👋</span> Hello, I'm
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              Ayush Raj
              <motion.span
                className="block h-1 w-20 bg-primary mt-2"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              />
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mb-6"
            >
              <TypewriterEffect
                texts={[
                  "Computer Science Student",
                  "Software Developer",
                  "AI Enthusiast",
                ]}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="text-muted-foreground mb-8 max-w-md"
            >
              I'm a passionate Computer Science & Engineering student with a
              focus on AI and full-stack development. I love solving complex
              problems and building innovative applications that make a
              difference.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <Button
                size="lg"
                className="gap-2 relative group overflow-hidden"
                onClick={() => {
                  setActiveSection("contact");
                  setTimeOfLastClick(Date.now());
                  const element = document.getElementById("contact");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <span className="absolute inset-0 w-0 bg-white/10 transition-all duration-300 group-hover:w-full"></span>
                <Send size={18} />
                <span>Contact Me</span>
              </Button>

              <AnimatedTooltip content="Download my resume in PDF format">
                <a
                  href="https://drive.usercontent.google.com/u/0/uc?id=1u7JzJgTOrwfuzQozNqMFPrSfeuGt3Ohc&export=download"
                  download
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 relative group overflow-hidden"
                  >
                    <span className="absolute inset-0 w-0 bg-primary/10 transition-all duration-300 group-hover:w-full"></span>
                    <Download size={18} />
                    <span>Download CV</span>
                  </Button>
                </a>
              </AnimatedTooltip>
            </motion.div>

            {/* Tech Skills */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div className="text-center p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors duration-300">
                <div className="flex justify-center mb-1">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm font-medium">Software Development</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors duration-300">
                <div className="flex justify-center mb-1">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm font-medium">Full Stack Developer</div>
              </div>

              <div className="text-center p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors duration-300">
                <div className="flex justify-center mb-1">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm font-medium">AI & Machine Learning</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer"
        animate={{
          y: [0, 10, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        onClick={() => {
          setActiveSection("projects");
          setTimeOfLastClick(Date.now());
          const element = document.getElementById("projects");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        <span className="text-sm text-muted-foreground mb-2">Scroll Down</span>
        <div className="w-8 h-12 rounded-full border-2 border-muted-foreground/20 flex justify-center items-start p-1 hover:border-primary/30 transition-colors duration-300">
          <motion.div
            className="w-1 h-2 bg-primary rounded-full"
            animate={{
              y: [0, 16, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// Typewriter effect component
function TypewriterEffect({ texts }: { texts: string[] }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const fullText = texts[currentTextIndex];

        if (!isDeleting) {
          setCurrentText(fullText.substring(0, currentText.length + 1));

          if (currentText === fullText) {
            setIsDeleting(true);
            setTimeout(() => {}, 1000); // Pause at the end
          }
        } else {
          setCurrentText(fullText.substring(0, currentText.length - 1));

          if (currentText === "") {
            setIsDeleting(false);
            setCurrentTextIndex((currentTextIndex + 1) % texts.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, texts]);

  return (
    <div className="h-8">
      <h2 className="text-xl font-medium text-foreground inline-block">
        {currentText}
        <span className="animate-pulse">|</span>
      </h2>
    </div>
  );
}
