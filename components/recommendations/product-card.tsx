"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp, Heart, ThumbsDown, ThumbsUp } from "lucide-react"
import type { Recommendation } from "@/lib/types"
import { RatingStars } from "./rating-stars"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Props = {
  rec: Recommendation
}

export function ProductCard({ rec }: Props) {
  const [explainOpen, setExplainOpen] = useState(false)
  const [explanation, setExplanation] = useState(rec.explanation)
  const { toast } = useToast()
  const [likes, setLikes] = useLocalStorage<Record<number, 1 | -1 | 0>>("likes", {})
  const [ratings, setRatings] = useLocalStorage<Record<number, number>>("ratings", {})
  const [history, setHistory] = useLocalStorage<number[]>("history", [])
  const [cart, setCart] = useLocalStorage<number[]>("cart", [])

  const likeState = likes[rec.product.id] ?? 0
  const rating = ratings[rec.product.id] ?? 0

  const handleLike = (val: 1 | -1) => {
    setLikes({ ...likes, [rec.product.id]: likeState === val ? 0 : val })
  }

  const handleRate = (value: number) => {
    setRatings({ ...ratings, [rec.product.id]: value })
    // add to history on rating
    addToHistory()
  }

  const addToHistory = () => {
    if (!history.includes(rec.product.id)) {
      setHistory([rec.product.id, ...history].slice(0, 50))
    } else {
      // move to top
      setHistory([rec.product.id, ...history.filter((id) => id !== rec.product.id)].slice(0, 50))
    }
  }

  const handleExplain = async () => {
    const res = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: {
          name: rec.product.name,
          brand: rec.product.brand,
          price: rec.product.price,
          category: rec.product.category,
          features: rec.product.features,
        },
        score: rec.score,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setExplanation(data.explanation)
      setExplainOpen(true)
    } else {
      toast({
        variant: "destructive",
        title: "Failed to generate explanation",
        description: "Please try again later.",
      })
    }
  }

  const handleAddToCart = () => {
    if (!cart.includes(rec.product.id)) {
      setCart([...cart, rec.product.id])
      toast({ title: "Added to cart", description: `${rec.product.name} added.` })
      addToHistory()
    } else {
      toast({ title: "Already in cart", description: `${rec.product.name} is already in cart.` })
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start gap-3">
        <ProductImage name={rec.product.name} />
        <div className="flex-1 space-y-1">
          <CardTitle className="text-base leading-snug">{rec.product.name}</CardTitle>
          <div className="text-xs text-muted-foreground">{rec.product.brand}</div>
        </div>
        <Badge variant="secondary" aria-label={`Score ${rec.score}`}>
          {rec.score}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">Price:</span>{" "}
            <span className="font-medium">${rec.product.price.toFixed(2)}</span>
          </div>
          <div className="text-xs rounded-md px-2 py-1 bg-accent text-accent-foreground">{rec.product.category}</div>
        </div>
        <RatingStars value={rating} onChange={handleRate} />
        <Separator />
        <div>
          <button
            onClick={() => setExplainOpen((o) => !o)}
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            aria-expanded={explainOpen}
            aria-controls={`why-${rec.product.id}`}
          >
            Why recommended?
            {explainOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {explainOpen ? (
            <p id={`why-${rec.product.id}`} className="text-sm mt-2 text-pretty">
              {explanation}
            </p>
          ) : null}
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={handleExplain}>
              Regenerate
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant={likeState === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => handleLike(1)}
            aria-pressed={likeState === 1}
          >
            <ThumbsUp className="h-4 w-4 mr-1" /> Like
          </Button>
          <Button
            variant={likeState === -1 ? "default" : "outline"}
            size="sm"
            onClick={() => handleLike(-1)}
            aria-pressed={likeState === -1}
          >
            <ThumbsDown className="h-4 w-4 mr-1" /> Dislike
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={addToHistory}>
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{rec.product.name}</DialogTitle>
              </DialogHeader>
              <div className="text-sm text-muted-foreground">{rec.product.description}</div>
              <Separator className="my-2" />
              <div className="text-sm">
                <div>
                  <span className="text-muted-foreground">Brand:</span> {rec.product.brand}
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span> {rec.product.category}
                </div>
                <div>
                  <span className="text-muted-foreground">Price:</span> ${rec.product.price.toFixed(2)}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" onClick={handleAddToCart}>
            <Heart className="h-4 w-4 mr-1" /> Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function ProductImage({ name }: { name: string }) {
  const letter = name?.[0]?.toUpperCase() || "?"
  return (
    <div
      className="h-12 w-12 rounded-md bg-muted text-foreground grid place-items-center font-semibold"
      aria-label={`Placeholder for ${name}`}
    >
      {letter}
    </div>
  )
}
