import { NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, productId, type } = body as { userId?: string; productId?: string; type?: string }
    if (!userId || !productId || !type) {
      return NextResponse.json({ ok: false, error: "Missing userId, productId, or type" }, { status: 400 })
    }
    if (!["view", "cart", "purchase", "like"].includes(type)) {
      return NextResponse.json({ ok: false, error: "Invalid interaction type" }, { status: 400 })
    }
    const sql = getSql()
    await sql`
      insert into interactions (user_id, product_id, type)
      values (${userId}::uuid, ${productId}::uuid, ${type}::interaction_type)
    `
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("[v0] /api/interactions error:", err?.message)
    return NextResponse.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 })
  }
}
