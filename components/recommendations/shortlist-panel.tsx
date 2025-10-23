"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"
import useSWR from "swr"
import { motion } from "framer-motion"

interface ShortlistPanelProps {
  userId: string
}

export function ShortlistPanel({ userId }: ShortlistPanelProps) {
  const { data, isLoading } = useSWR(userId ? `/api/shortlist?userId=${userId}` : null, (url) =>
    fetch(url).then((r) => r.json()),
  )

  const shortlist = data?.shortlist || []

  if (!userId) {
    return (
      <Card className="rounded-xl shadow-md border-border/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Enter a user ID to view your shortlist.</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="rounded-xl shadow-md border-border/50">
        <CardContent className="pt-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl shadow-md border-border/50">
      <CardHeader>
        <CardTitle className="text-base">Your Shortlist ({shortlist.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {shortlist.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items in your shortlist yet. Like products to add them!</p>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortlist.map((product: Product, idx: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
