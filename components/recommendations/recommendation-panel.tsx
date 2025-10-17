"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProductCard } from "./product-card"
import { SummaryPanel } from "./summary-panel"
import type { Product, ScoredRecommendation, UserBehavior } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

type ApiResponse = {
  ok: boolean
  count?: number
  behavior?: UserBehavior
  recommendations?: ScoredRecommendation[]
  error?: string
}

export function RecommendationPanel() {
  const [userId, setUserId] = useState<string>("")
  const [includeExplanations, setIncludeExplanations] = useState(true)
  const [limit, setLimit] = useState(8)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<ScoredRecommendation[]>([])
  const [derivedBehavior, setDerivedBehavior] = useState<UserBehavior | undefined>(undefined)
  const { toast } = useToast()

  async function runDemo() {
    setLoading(true)
    setError(null)
    setResults([])
    try {
      const demoBehavior: UserBehavior = {
        categoryCounts: { Electronics: 5, Fashion: 2 },
        brandCounts: { boAt: 3, Mi: 2, Noise: 2 },
        likedProductIds: [],
        viewedProductIds: [],
        pricePreference: 2499,
      }
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          behavior: userId ? undefined : demoBehavior,
          userId: userId || undefined,
          limit: Math.max(1, Math.min(20, limit)),
          includeExplanations,
        }),
      })
      const data: ApiResponse = await res.json()
      if (!data.ok) throw new Error(data.error || "Request failed")
      setResults(data.recommendations || [])
      setDerivedBehavior(data.behavior)
    } catch (e: any) {
      setError(e.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function useDemoUser() {
    setUserId("00000000-0000-0000-0000-000000000001")
  }

  async function recordInteraction(productId: string, type: "like" | "cart") {
    if (!userId) {
      toast({
        title: "User ID required",
        description: "Enter a user ID or click 'Use demo user' to record interactions.",
      })
      return
    }
    try {
      const res = await fetch("/api/interactions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, productId, type }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || "Interaction failed")
      toast({ title: "Saved", description: `Recorded ${type} on product.` })
      await runDemo()
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to record interaction" })
    }
  }

  const avgPrice =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.product.price, 0) / results.length
      : derivedBehavior?.pricePreference

  return (
    <div className="flex flex-col gap-6">
      {/* User Input Controls */}
      <Card className="rounded-xl shadow-md border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Get Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <Input
            placeholder="Optional: Enter a user ID to use real interactions"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="rounded-lg"
          />
          <Button variant="outline" onClick={useDemoUser} className="rounded-lg bg-transparent">
            Use demo user
          </Button>
          <div className="flex items-center gap-2">
            <label className="text-sm whitespace-nowrap">Limit</label>
            <Input
              type="number"
              min={1}
              max={20}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-20 rounded-lg"
            />
          </div>
          <Button
            onClick={() => setIncludeExplanations((v) => !v)}
            variant={includeExplanations ? "default" : "outline"}
            aria-pressed={includeExplanations}
            className="rounded-lg"
          >
            {includeExplanations ? "Explanations: On" : "Explanations: Off"}
          </Button>
          <Button onClick={runDemo} disabled={loading} className="rounded-lg">
            {loading ? "Loading..." : "Get Recommendations"}
          </Button>
        </CardContent>
      </Card>

      {/* Summary Panel */}
      {derivedBehavior && (
        <SummaryPanel
          data={{
            categories: derivedBehavior.categoryCounts || {},
            brands: derivedBehavior.brandCounts || {},
            avgPrice: derivedBehavior.pricePreference || 0,
            totalInteractions: Object.values(derivedBehavior.categoryCounts || {}).reduce((a, b) => a + b, 0),
          }}
        />
      )}

      {/* Error Message */}
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm">
          {error}
        </motion.p>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </motion.div>
      )}

      {/* Results Count */}
      {results.length > 0 && !loading && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{results.length}</span> recommendations
        </motion.p>
      )}

      {/* Recommendations Grid */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {results.map((r, idx) => (
            <motion.div
              key={r.product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProductCard
                product={r.product as Product}
                explanation={r.explanation}
                score={r.score}
                avgPrice={avgPrice}
                onAddToCart={() => recordInteraction(r.product.id, "cart")}
                onLike={() => recordInteraction(r.product.id, "like")}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-8">
          No recommendations yet. Click "Get Recommendations" to start.
        </p>
      )}
    </div>
  )
}
