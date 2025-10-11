"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ListFilter, History, Home } from "lucide-react"
import { categories } from "@/lib/data"

type SidebarProps = {
  className?: string
  category: string | "all"
  onCategoryChange: (cat: string | "all") => void
  sort: "relevance" | "price" | "score"
  onSortChange: (s: "relevance" | "price" | "score") => void
  onToggleHistory?: () => void
}

export function Sidebar({ className, category, onCategoryChange, sort, onSortChange, onToggleHistory }: SidebarProps) {
  return (
    <aside className={cn("w-72 border-r bg-sidebar text-sidebar-foreground flex-col p-4 gap-4", className)}>
      <div className="flex items-center gap-2 px-2">
        <Home className="h-4 w-4" />
        <span className="font-semibold">Dashboard</span>
      </div>
      <Separator className="my-3" />
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ListFilter className="h-4 w-4" />
          Filters
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Category</label>
          <Select value={category} onValueChange={(v) => onCategoryChange(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Sort by</label>
          <Select value={sort} onValueChange={(v) => onSortChange(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="score">Score</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="mt-auto">
        <Button variant="outline" className="w-full bg-transparent" onClick={onToggleHistory}>
          <History className="mr-2 h-4 w-4" />
          View History
        </Button>
      </div>
    </aside>
  )
}
