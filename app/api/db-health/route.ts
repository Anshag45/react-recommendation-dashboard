import { dbHealth } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const ok = await dbHealth().catch(() => false)
  return NextResponse.json({ ok })
}
