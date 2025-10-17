"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type DarkModeContextType = {
  isDark: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load from localStorage
    const saved = localStorage.getItem("dark-mode")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = saved ? JSON.parse(saved) : prefersDark
    setIsDark(shouldBeDark)
    applyDarkMode(shouldBeDark)
  }, [])

  const applyDarkMode = (dark: boolean) => {
    const html = document.documentElement
    if (dark) {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
  }

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newValue = !prev
      localStorage.setItem("dark-mode", JSON.stringify(newValue))
      applyDarkMode(newValue)
      return newValue
    })
  }

  if (!mounted) return <>{children}</>

  return <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>{children}</DarkModeContext.Provider>
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode must be used within DarkModeProvider")
  }
  return context
}
