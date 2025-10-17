import type { Product, UserBehavior, ScoredRecommendation } from "./types"

function zscore(val: number, mean: number, std: number) {
  if (std === 0) return 0
  return (val - mean) / std
}

export function scoreProducts(
  products: Product[],
  behavior: UserBehavior | undefined,
  limit = 8,
): ScoredRecommendation[] {
  if (!products.length) return []

  // Popularity fallback if no behavior
  if (!behavior || Object.keys(behavior).length === 0) {
    return products
      .slice()
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit)
      .map((p, i) => ({ product: p, score: p.popularity || products.length - i }))
  }

  const {
    categoryCounts = {},
    brandCounts = {},
    likedProductIds = [],
    pricePreference,
    viewedProductIds = [],
  } = behavior

  const likedSet = new Set(likedProductIds)
  const viewedSet = new Set(viewedProductIds)

  // Precompute price stats
  const prices = products.map((p) => p.price)
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length
  const variance = prices.reduce((a, b) => a + (b - mean) * (b - mean), 0) / prices.length
  const std = Math.sqrt(variance)

  // Simple bag-of-tags from liked/viewed as a proxy for preferences
  const tagPrefs = new Map<string, number>()
  for (const p of products) {
    if (likedSet.has(p.id) || viewedSet.has(p.id)) {
      const weight = likedSet.has(p.id) ? 2 : 1
      for (const t of p.tags || []) {
        tagPrefs.set(t, (tagPrefs.get(t) || 0) + weight)
      }
    }
  }

  const scored = products.map((p) => {
    let score = 0

    // Category affinity
    if (p.category && categoryCounts[p.category]) {
      score += 3 * categoryCounts[p.category]
    }

    // Brand affinity
    if (p.brand && brandCounts[p.brand]) {
      score += 2 * brandCounts[p.brand]
    }

    // Tag similarity to liked/viewed
    if (p.tags && p.tags.length) {
      for (const t of p.tags) {
        score += 1.5 * (tagPrefs.get(t) || 0)
      }
    }

    // Price preference: reward closeness to preference if set
    if (typeof pricePreference === "number") {
      const priceZ = Math.abs(zscore(p.price, mean, std))
      // closer to preference gets more points
      const diff = Math.abs(p.price - pricePreference)
      score += Math.max(0, 5 - diff / Math.max(1, pricePreference * 0.2)) // soft reward
      score -= priceZ * 0.25 // de-emphasize extreme prices
    }

    // Global popularity as small factor
    score += (p.popularity || 0) * 0.1

    // Down-rank already viewed slightly
    if (viewedSet.has(p.id)) score -= 0.5

    return { product: p, score }
  })

  return scored.sort((a, b) => b.score - a.score).slice(0, limit)
}
