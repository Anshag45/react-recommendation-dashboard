import { getSql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sql = getSql()

    // Get total products and interactions
    const [productsCount, interactionsCount, usersCount] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM products`,
      sql`SELECT COUNT(*) as count FROM interactions`,
      sql`SELECT COUNT(*) as count FROM users`,
    ])

    // Get interaction breakdown
    const interactionTypes = await sql`
      SELECT type, COUNT(*) as count FROM interactions GROUP BY type
    `

    // Get top products by interactions
    const topProducts = await sql`
      SELECT p.id, p.title, p.brand, COUNT(i.id) as interaction_count
      FROM products p
      LEFT JOIN interactions i ON p.id = i.product_id
      GROUP BY p.id, p.title, p.brand
      ORDER BY interaction_count DESC
      LIMIT 10
    `

    // Get category performance
    const categoryPerformance = await sql`
      SELECT p.category, COUNT(i.id) as interaction_count, AVG(p.price) as avg_price
      FROM products p
      LEFT JOIN interactions i ON p.id = i.product_id
      GROUP BY p.category
      ORDER BY interaction_count DESC
    `

    // Get brand performance
    const brandPerformance = await sql`
      SELECT p.brand, COUNT(i.id) as interaction_count, COUNT(DISTINCT i.user_id) as unique_users
      FROM products p
      LEFT JOIN interactions i ON p.id = i.product_id
      GROUP BY p.brand
      ORDER BY interaction_count DESC
      LIMIT 10
    `

    // Calculate engagement rate
    const totalInteractions = (interactionsCount[0] as any)?.count || 0
    const totalUsers = (usersCount[0] as any)?.count || 0
    const engagementRate = totalUsers > 0 ? ((totalInteractions / totalUsers) * 100).toFixed(2) : "0"

    // Calculate conversion rate (purchases / views)
    const interactionBreakdown = interactionTypes.reduce((acc: any, row: any) => {
      acc[row.type] = row.count
      return acc
    }, {})
    const conversionRate =
      interactionBreakdown.view > 0
        ? ((interactionBreakdown.purchase / interactionBreakdown.view) * 100).toFixed(2)
        : "0"

    return NextResponse.json({
      ok: true,
      summary: {
        totalProducts: (productsCount[0] as any)?.count || 0,
        totalInteractions,
        totalUsers,
        engagementRate: Number.parseFloat(engagementRate),
        conversionRate: Number.parseFloat(conversionRate),
      },
      interactionBreakdown,
      topProducts,
      categoryPerformance,
      brandPerformance,
    })
  } catch (error) {
    console.error("[v0] /api/metrics error:", error)
    return NextResponse.json({ ok: false, error: "Failed to fetch metrics" }, { status: 500 })
  }
}
