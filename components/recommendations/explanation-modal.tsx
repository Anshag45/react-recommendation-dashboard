"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/lib/types"

export function ExplanationModal({
  product,
  userProfile,
}: {
  product: Product
  userProfile?: Record<string, any>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchExplanation = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product, userProfile }),
      })
      const data = await res.json()
      if (data.ok) {
        setExplanation(data.explanation)
      }
    } catch (e) {
      console.error("Failed to fetch explanation:", e)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = async () => {
    setIsOpen(true)
    if (!explanation) {
      await fetchExplanation()
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpen} className="w-full bg-transparent">
        Why this product?
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-md animate-in zoom-in-95 duration-300">
            <CardHeader>
              <CardTitle className="text-lg">{product.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                </div>
              ) : explanation ? (
                <p className="text-sm leading-relaxed text-muted-foreground">{explanation}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No explanation available.</p>
              )}
              <Button onClick={() => setIsOpen(false)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
