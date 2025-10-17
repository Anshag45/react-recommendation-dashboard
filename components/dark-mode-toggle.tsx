"use client"

import { Button } from "@/components/ui/button"
import { useDarkMode } from "@/hooks/use-dark-mode"
import { Moon, Sun } from "lucide-react"

export function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      className="rounded-full transition-all duration-300 bg-transparent"
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
