import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import ActiveSectionContextProvider from "@/components/active-section-context"
import ScrollProgress from "@/components/scroll-progress"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Ayush Raj | Portfolio",
  description: "Full-Stack Developer & UI/UX Designer",
   
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ActiveSectionContextProvider>
            <ScrollProgress />
            {children}
          </ActiveSectionContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'