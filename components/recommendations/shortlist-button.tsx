"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import useSWR from "swr"

interface ShortlistButtonProps {
  productId: string
  userId: string
  onToggle?: (isAdded: boolean) => void
}

export function ShortlistButton({ productId, userId, onToggle }: ShortlistButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { data: shortlist, mutate } = useSWR(userId ? `/api/shortlist?userId=${userId}` : null, (url) =>
    fetch(url).then((r) => r.json()),
  )

  const isInShortlist = shortlist?.shortlist?.some((p: any) => p.id === productId) ?? false

  const handleToggle = async () => {
    setIsAdding(true)
    try {
      if (isInShortlist) {
        await fetch(`/api/shortlist?userId=${userId}&productId=${productId}`, { method: "DELETE" })
      } else {
        await fetch("/api/shortlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId }),
        })
      }
      mutate()
      onToggle?.(!isInShortlist)
    } catch (error) {
      console.error("[v0] Shortlist toggle error:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isAdding}
      className={isInShortlist ? "text-red-500" : ""}
      aria-label={isInShortlist ? "Remove from shortlist" : "Add to shortlist"}
    >
      <Heart className={`h-4 w-4 ${isInShortlist ? "fill-current" : ""}`} />
    </Button>
  )
}
