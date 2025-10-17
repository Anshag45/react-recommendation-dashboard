import { neon } from "@neondatabase/serverless"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("[v0] DATABASE_URL is missing. Add it in the Vars sidebar or via the Neon Connect integration.")
    process.exit(1)
  }
  const sql = neon(url)

  const files = ["001_create_tables.sql", "002_seed.sql"]
  for (const f of files) {
    const p = join(process.cwd(), "scripts", "sql", f)
    console.log("[v0] running", p)
    const text = await readFile(p, "utf8")
    // split on semicolons that end statements; simple splitter is enough for these files
    const statements = text
      .split(/;\s*$/m)
      .map((s) => s.trim())
      .filter(Boolean)
    for (const s of statements) {
      await sql(s)
    }
  }
  console.log("[v0] database seeded successfully.")
}

main().catch((e) => {
  console.error("[v0] seed failed:", e)
  process.exit(1)
})
