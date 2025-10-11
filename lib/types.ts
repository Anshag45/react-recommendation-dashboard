export interface Product {
  id: number
  name: string
  description: string
  category: string
  price: number
  brand: string
  features: Record<string, any>
}

export interface Recommendation {
  product: Product
  score: number // 0-100
  explanation: string
}

export interface UserBehavior {
  type: "view" | "purchase" | "wishlist" | "rating"
  productId: number
  value?: number
  timestamp: string
}
