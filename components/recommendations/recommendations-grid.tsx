"use client"

import useSWR from "swr"
import { ProductCard } from "./product-card"
import type { Recommendation } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Props = {
  search: string
  category: string | "all"
  sort: "relevance" | "price" | "score"
}

export function RecommendationsGrid({ search, category, sort }: Props) {
  const { data, isLoading } = useSWR<Recommendation[]>("/api/recommendations", fetcher)

  const filtered = useMemo(() => {
    const list = (data ?? []).filter(
      (r) =>
        (category === "all" || r.product.category === category) &&
        (search.trim().length === 0 ||
          [r.product.name, r.product.brand].some((t) => t.toLowerCase().includes(search.toLowerCase()))),
    )

    const sorted = [...list]
    if (sort === "price") {
      sorted.sort((a, b) => a.product.price - b.product.price)
    } else if (sort === "score") {
      sorted.sort((a, b) => b.score - a.score)
    } else {
      // relevance: for now, same as score
      sorted.sort((a, b) => b.score - a.score)
    }
    return sorted
  }, [data, search, category, sort])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {filtered.map((rec) => (
        <ProductCard key={rec.product.id} rec={rec} />
      ))}
      {filtered.length === 0 ? (
        <div className="col-span-full text-sm text-muted-foreground">No recommendations match your filters.</div>
      ) : null}
    </div>
  )
}
