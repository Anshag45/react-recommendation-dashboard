"use client"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, History, Search } from "lucide-react"

type HeaderProps = {
  search: string
  onSearch: (v: string) => void
  onOpenHistory?: () => void
}

export function Header({ search, onSearch, onOpenHistory }: HeaderProps) {
  return (
    <header className="w-full bg-card text-card-foreground">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
        <div className="text-lg font-semibold text-pretty">Recommendations</div>
        <div className="flex-1" />
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search products or brands"
            className="pl-9"
            aria-label="Search products"
          />
        </div>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Open history" onClick={onOpenHistory}>
          <History className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
