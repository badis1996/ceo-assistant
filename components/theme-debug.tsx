"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeDebug() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme()

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-card border border-border rounded-lg shadow-lg">
      <div className="space-y-2 text-sm">
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <p>
          Resolved theme: <strong>{resolvedTheme}</strong>
        </p>
        <p>
          System theme: <strong>{systemTheme}</strong>
        </p>
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={() => setTheme("light")}>
            Light
          </Button>
          <Button size="sm" onClick={() => setTheme("dark")}>
            Dark
          </Button>
          <Button size="sm" onClick={() => setTheme("system")}>
            System
          </Button>
        </div>
      </div>
    </div>
  )
}
