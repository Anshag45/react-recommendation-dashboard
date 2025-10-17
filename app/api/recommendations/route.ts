import { NextResponse } from "next/server"
import { getSql } from "@/lib/db"
import { scoreProducts } from "@/lib/recommend"
import type { Product, UserBehavior } from "@/lib/types"
import { explainRecommendation } from "@/lib/ai"

export const dynamic = "force-dynamic" // ensure fresh data when testing

type ReqBody = {
  userId?: string
  behavior?: UserBehavior
  limit?: number
  includeExplanations?: boolean
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ReqBody
    const sql = getSql()

    // Pull products
    const productsRes = await sql<Product[]>`
      select id::text, title, description, category, brand, price::float8, tags, popularity, image_url
      from products
      order by id
    `

    let behavior = body.behavior as UserBehavior | undefined

    // If userId provided, compute behavior from interactions
    if (body.userId) {
      const rows = await sql<
        {
          product_id: string
          category: string | null
          brand: string | null
          price: number
          type: string
        }[]
      >`
        select i.product_id::text, p.category, p.brand, p.price::float8 as price, i.type
        from interactions i
        join products p on p.id = i.product_id
        where i.user_id = ${body.userId}
        order by i.created_at desc
        limit 200
      `
      const categoryCounts: Record<string, number> = {}
      const brandCounts: Record<string, number> = {}
      const likedProductIds: string[] = []
      const viewedProductIds: string[] = []
      let priceSum = 0
      let priceCount = 0

      for (const r of rows) {
        if (r.category) categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1
        if (r.brand) brandCounts[r.brand] = (brandCounts[r.brand] || 0) + 1
        if (r.type === "like") likedProductIds.push(r.product_id)
        if (r.type === "view" || r.type === "cart" || r.type === "purchase") viewedProductIds.push(r.product_id)
        priceSum += r.price
        priceCount++
      }

      behavior = {
        categoryCounts,
        brandCounts,
        likedProductIds,
        viewedProductIds,
        pricePreference: priceCount ? priceSum / priceCount : undefined,
      }
    }

    const limit = Math.max(1, Math.min(20, body.limit || 8))
    const scored = scoreProducts(productsRes, behavior, limit)

    let results = scored
    if (body.includeExplanations) {
      results = await Promise.all(
        scored.map(async (s) => ({
          ...s,
          explanation: await explainRecommendation({ product: s.product, behavior, score: s.score }),
        })),
      )
    }

    return NextResponse.json({
      ok: true,
      count: results.length,
      behavior,
      recommendations: results,
    })
  } catch (err: any) {
    console.error("[v0] /api/recommendations error:", err?.message)
    return NextResponse.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 })
  }
}
