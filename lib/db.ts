import { neon } from "@neondatabase/serverless"

let _sql: ReturnType<typeof neon> | null = null

export function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add it in the Vars sidebar or via the Neon Connect integration.")
  }
  if (_sql) return _sql
  _sql = neon(url)
  return _sql
}

export async function dbHealth(): Promise<boolean> {
  try {
    const sql = getSql()
    const rows = await sql`select 1 as ok`
    return Array.isArray(rows) && rows.length > 0
  } catch {
    return false
  }
}
