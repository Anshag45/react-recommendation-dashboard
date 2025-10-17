"use client"

import dynamic from "next/dynamic"
import { RecommendationPanel } from "@/components/recommendations/recommendation-panel"
import { InteractionLog } from "@/components/recommendations/interaction-log"

const DarkModeToggle = dynamic(
  () => import("@/components/dark-mode-toggle").then((mod) => ({ default: mod.DarkModeToggle })),
  {
    ssr: false,
    loading: () => <div className="w-10 h-10" />,
  },
)

export default function RecommenderPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4 md:p-6">
          <div>
            <h1 className="text-2xl font-semibold text-balance">Indian E-commerce Recommender</h1>
            <p className="text-sm text-muted-foreground">
              Personalized product recommendations with AI-powered explanations
            </p>
          </div>
          <DarkModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 md:p-6">
        <div className="lg:col-span-3">
          <RecommendationPanel />
        </div>
        <div className="lg:col-span-1">
          <InteractionLog />
        </div>
      </div>

      <footer className="border-t border-border bg-background/50 p-4 md:p-6 text-center text-xs text-muted-foreground">
        <p>💡 Powered by AI-driven Multimodal Recommendation Engine (text + behavior + image context)</p>
      </footer>
    </main>
  )
}
