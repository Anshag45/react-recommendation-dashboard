import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { product, userProfile } = await req.json()

    if (!product) {
      return Response.json({ ok: false, error: "Product is required" }, { status: 400 })
    }

    // Check if AI explanations are enabled
    const enableAI = process.env.ENABLE_AI_EXPLANATION === "true"

    if (!enableAI) {
      // Return a deterministic fallback explanation
      const fallback = `This product matches your interests based on your browsing history and preferences. ${product.category} items similar to this have been popular with users who viewed ${product.brand || "similar brands"}.`
      return Response.json({ ok: true, explanation: fallback })
    }

    // Generate LLM explanation
    const prompt = `Explain in 1-2 sentences why this product would be recommended to a user based on their profile.

Product: ${product.title}
Category: ${product.category}
Brand: ${product.brand}
Price: $${product.price}
Description: ${product.description}

User Profile: ${userProfile ? JSON.stringify(userProfile) : "General user"}

Keep the explanation concise and friendly.`

    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt,
      })

      return Response.json({ ok: true, explanation: text })
    } catch (aiError: any) {
      // Fallback if AI call fails
      console.error("AI generation failed:", aiError.message)
      const fallback = `This product matches your interests based on your browsing history and preferences. ${product.category} items similar to this have been popular with users who viewed ${product.brand || "similar brands"}.`
      return Response.json({ ok: true, explanation: fallback })
    }
  } catch (error: any) {
    console.error("Explain route error:", error)
    return Response.json({ ok: false, error: error.message || "Failed to generate explanation" }, { status: 500 })
  }
}
