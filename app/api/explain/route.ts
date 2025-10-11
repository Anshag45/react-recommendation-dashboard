import { NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { product, score } = body as {
      product: { name: string; brand: string; price: number; category: string; features: Record<string, any> }
      score: number
    }

    const prompt = [
      "You are an assistant generating concise consumer-friendly explanations for product recommendations.",
      "Write 1-2 sentences. No marketing fluff. Explain why this product fits the user based on features and score.",
      `Product: ${product.name} by ${product.brand}`,
      `Category: ${product.category}; Price: $${product.price}`,
      `Features: ${JSON.stringify(product.features)}`,
      `Score: ${score} out of 100`,
      "Output should be plain text, 1-2 sentences.",
    ].join("\n")

    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt,
    })

    return NextResponse.json({ explanation: text.trim() })
  } catch (e) {
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 })
  }
}
