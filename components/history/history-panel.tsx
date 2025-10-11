"use client"

import useSWR from "swr"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { Recommendation } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function HistoryPanel({ onClose }: { onClose?: () => void }) {
  const [history, setHistory] = useLocalStorage<number[]>("history", [])
  const { data } = useSWR<Recommendation[]>("/api/recommendations", fetcher)

  const products = (data ?? [])
    .filter((r) => history.includes(r.product.id))
    .sort((a, b) => history.indexOf(a.product.id) - history.indexOf(b.product.id))

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="font-semibold">History</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close history">
            <X className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setHistory([])}>
            Clear
          </Button>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="space-y-3">
        {products.length === 0 ? <div className="text-sm text-muted-foreground">No product history yet.</div> : null}
        {products.map((rec) => (
          <div key={rec.product.id} className="rounded-md border p-3">
            <div className="text-sm font-medium">{rec.product.name}</div>
            <div className="text-xs text-muted-foreground">{rec.product.brand}</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm">${rec.product.price.toFixed(2)}</div>
              <Badge variant="secondary">{rec.product.category}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
