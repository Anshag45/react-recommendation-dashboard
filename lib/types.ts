export type Product = {
  id: string
  title: string
  description: string
  category: string
  brand: string
  price: number
  tags: string[] | null
  popularity: number
  image_url: string | null
}

export type InteractionType = "view" | "cart" | "purchase" | "like"

export type Interaction = {
  id: string
  user_id: string
  product_id: string
  type: InteractionType
  created_at: string
}

export type UserBehavior = {
  viewedProductIds?: string[]
  likedProductIds?: string[]
  categoryCounts?: Record<string, number>
  brandCounts?: Record<string, number>
  pricePreference?: number
}

export type ScoredRecommendation = {
  product: Product
  score: number
  explanation?: string
}
