"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  // Function to cycle through themes
  const cycleTheme = () => {
    if (resolvedTheme === "light") {
      setTheme("dark")
    } else if (resolvedTheme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full"
      onClick={cycleTheme}
      title={`Current theme: ${theme}`}
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : resolvedTheme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <div className="h-[1.2rem] w-[1.2rem] flex items-center justify-center">
          <span className="text-sm">💻</span>
        </div>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
