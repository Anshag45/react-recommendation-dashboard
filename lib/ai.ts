import { generateText } from "ai"
import type { Product, UserBehavior } from "./types"

function fallbackExplanation(product: Product, behavior: UserBehavior | undefined, score: number) {
  const likedOverlap = behavior?.likedProductIds?.includes?.(product.id) ? " You liked a similar item earlier." : ""
  const catPref = behavior?.categoryCounts?.[product.category]
    ? ` You frequently engage with ${product.category} items.`
    : ""
  const brandPref = behavior?.brandCounts?.[product.brand] ? ` You often interact with ${product.brand}.` : ""
  const priceHint =
    behavior?.pricePreference != null
      ? ` The price aligns with your typical spend (around $${behavior.pricePreference.toFixed(2)}).`
      : ""
  return `Recommended due to similarity to items you've interacted with and its fit for your tastes.${catPref}${brandPref}${likedOverlap}${priceHint} (model score: ${score.toFixed(2)}).`
}

export async function explainRecommendation(opts: {
  product: Product
  behavior?: UserBehavior
  score: number
}) {
  const { product, behavior, score } = opts

  // Only call the LLM when explicitly enabled. Otherwise, return a deterministic explanation.
  if (process.env.ENABLE_AI_EXPLANATION !== "true") {
    return fallbackExplanation(product, behavior, score)
  }

  const prompt = `
You are a helpful shopping assistant. Explain in 2-4 concise sentences why this product is recommended to the user.
Avoid marketing fluff; reference the user's behavior signals plainly.

User behavior (may be partial):
- Categories preference counts: ${JSON.stringify(behavior?.categoryCounts || {})}
- Brands preference counts: ${JSON.stringify(behavior?.brandCounts || {})}
- Liked product IDs: ${JSON.stringify(behavior?.likedProductIds || [])}
- Price preference: ${behavior?.pricePreference ?? "unknown"}

Candidate product:
- Title: ${product.title}
- Category: ${product.category}
- Brand: ${product.brand}
- Price: $${product.price.toFixed(2)}
- Tags: ${(product.tags || []).join(", ") || "none"}

Model score: ${score.toFixed(2)}

Return a single paragraph tailored to the signals above.`.trim()

  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt,
    })
    return text
  } catch (err) {
    // Gateway not configured or blocked -> degrade gracefully
    return fallbackExplanation(product, behavior, score)
  }
}
