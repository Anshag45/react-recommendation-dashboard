"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { RecommendationsGrid } from "@/components/recommendations/recommendations-grid"
import { HistoryPanel } from "@/components/history/history-panel"

export default function Page() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string | "all">("all")
  const [sort, setSort] = useState<"relevance" | "price" | "score">("relevance")
  const [showHistory, setShowHistory] = useState(false)

  return (
    <div className="min-h-dvh flex bg-background">
      <Sidebar
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        onToggleHistory={() => setShowHistory((s) => !s)}
        className="hidden md:flex"
      />
      <main className="flex-1 flex flex-col">
        <Header search={search} onSearch={setSearch} onOpenHistory={() => setShowHistory(true)} />
        <Separator />
        <div className="flex-1 p-4 md:p-6">
          <RecommendationsGrid search={search} category={category} sort={sort} />
        </div>
      </main>

      {showHistory ? (
        <aside
          aria-label="Product history"
          className={cn("w-80 border-l bg-card text-card-foreground p-4 hidden lg:block")}
        >
          <HistoryPanel onClose={() => setShowHistory(false)} />
        </aside>
      ) : null}
    </div>
  )
}
