import { getSql } from "@/lib/db"
import type { Product } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 })
    }

    const sql = getSql()
    const shortlist = await sql`
      SELECT p.* FROM products p
      INNER JOIN shortlist s ON p.id = s.product_id
      WHERE s.user_id = $1::uuid
      ORDER BY s.created_at DESC
    `(userId)

    return Response.json({ shortlist: shortlist as Product[] })
  } catch (error) {
    console.error("[v0] Shortlist GET error:", error)
    return Response.json({ error: "Failed to fetch shortlist" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, productId } = await request.json()

    if (!userId || !productId) {
      return Response.json({ error: "userId and productId are required" }, { status: 400 })
    }

    const sql = getSql()
    await sql`
      INSERT INTO shortlist (user_id, product_id)
      VALUES ($1::uuid, $2::uuid)
      ON CONFLICT (user_id, product_id) DO NOTHING
    `(userId, productId)

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Shortlist POST error:", error)
    return Response.json({ error: "Failed to add to shortlist" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const productId = searchParams.get("productId")

    if (!userId || !productId) {
      return Response.json({ error: "userId and productId are required" }, { status: 400 })
    }

    const sql = getSql()
    await sql`
      DELETE FROM shortlist
      WHERE user_id = $1::uuid AND product_id = $2::uuid
    `(userId, productId)

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Shortlist DELETE error:", error)
    return Response.json({ error: "Failed to remove from shortlist" }, { status: 500 })
  }
}
