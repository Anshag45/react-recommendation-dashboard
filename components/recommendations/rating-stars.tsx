"use client"

import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  value: number
  onChange: (v: number) => void
}

export function RatingStars({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Rate product">
      {[1, 2, 3, 4, 5].map((i) => {
        const active = i <= value
        return (
          <Button
            key={i}
            type="button"
            size="icon"
            variant="ghost"
            aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
            onClick={() => onChange(i)}
            className={active ? "text-primary" : "text-muted-foreground"}
          >
            <Star className={active ? "fill-current h-5 w-5" : "h-5 w-5"} />
          </Button>
        )
      })}
    </div>
  )
}
