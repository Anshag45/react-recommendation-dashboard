"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface ProductCardProps {
  product: Product
  explanation?: string
  score?: number
  avgPrice?: number
  onAddToCart?: (p: Product) => void
  onLike?: (p: Product) => void
}

function generateTags(product: Product, score?: number): string[] {
  const tags: string[] = []

  if (product.price < 1000) tags.push("BudgetPick")
  if (product.popularity > 80) tags.push("PopularBrand")
  if (score && score > 75) tags.push("TopMatch")
  if (product.tags?.includes("trending")) tags.push("Trending")

  return tags.slice(0, 3)
}

function getPriceInsight(price: number, avgPrice?: number): string {
  if (!avgPrice) return ""
  const diff = price - avgPrice
  const percent = Math.abs((diff / avgPrice) * 100).toFixed(0)
  if (diff > 0) return `▲ ${percent}% above avg`
  if (diff < 0) return `▼ ${percent}% below avg`
  return "At avg price"
}

export function ProductCard({ product, explanation, score, avgPrice, onAddToCart, onLike }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    const cartState = localStorage.getItem(`cart-${product.id}`)
    const likeState = localStorage.getItem(`like-${product.id}`)

    if (cartState) setIsAdded(JSON.parse(cartState))
    if (likeState) setIsLiked(JSON.parse(likeState))
  }, [product.id])

  const handleAddToCart = (product: Product) => {
    const newState = !isAdded
    setIsAdded(newState)
    localStorage.setItem(`cart-${product.id}`, JSON.stringify(newState))

    if (onAddToCart) {
      onAddToCart(product)
    }
    ;(window as any).__addInteractionLog?.(
      `${newState ? "Added" : "Removed"} "${product.title}" ${newState ? "to" : "from"} cart`,
    )
  }

  const handleLike = (product: Product) => {
    const newState = !isLiked
    setIsLiked(newState)
    localStorage.setItem(`like-${product.id}`, JSON.stringify(newState))

    if (onLike) {
      onLike(product)
    }
    ;(window as any).__addInteractionLog?.(`${newState ? "Liked" : "Unliked"} "${product.title}"`)
  }

  const tags = generateTags(product, score)
  const priceInsight = getPriceInsight(product.price, avgPrice)
  const normalizedScore = score ? Math.min(100, Math.max(0, score)) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      className="h-full"
    >
      <Card className="h-full rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border-border/50 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm leading-tight flex-1 line-clamp-2">{product.title}</CardTitle>
            {score !== undefined && (
              <Badge
                variant="outline"
                className="text-xs whitespace-nowrap bg-blue-500/10 text-blue-400 border-blue-500/30"
              >
                {normalizedScore.toFixed(0)}%
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {/* Product Image */}
          <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted">
            <Image
              src={
                product.image_url ||
                `/placeholder.svg?height=160&width=320&query=Indian%20ecommerce%20product` ||
                "/placeholder.svg"
              }
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 320px"
            />
          </div>

          {/* Confidence Progress Bar */}
          {score !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Match Score</span>
                <span className="text-xs font-bold text-blue-400">{normalizedScore.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${normalizedScore}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Price & Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.brand && (
              <Badge variant="secondary" className="text-xs">
                {product.brand}
              </Badge>
            )}
            {product.category && (
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            )}
            <Badge className="ml-auto text-xs bg-green-600 hover:bg-green-700 font-bold">
              ₹{product.price.toLocaleString("en-IN")}
            </Badge>
          </div>

          {/* Price Insight */}
          {priceInsight && <p className="text-xs text-muted-foreground italic">{priceInsight}</p>}

          {/* Model Score */}
          <p className="text-xs text-slate-500">Model score: {(score || 0).toFixed(1)}</p>

          {/* Explanation (Toggleable) */}
          {showExplanation && explanation && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs leading-relaxed text-muted-foreground italic bg-slate-800/50 p-2 rounded"
            >
              {explanation}
            </motion.p>
          )}

          {/* Dynamic Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/30"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              className="shadow-md flex-1 text-xs"
              variant={isAdded ? "secondary" : "default"}
              onClick={() => handleAddToCart(product)}
              size="sm"
            >
              {isAdded ? "Remove" : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowExplanation(!showExplanation)}
              size="sm"
              className="text-xs"
            >
              Why?
            </Button>
            <Button variant={isLiked ? "default" : "secondary"} onClick={() => handleLike(product)} size="sm">
              {isLiked ? "❤️" : "🤍"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
