import { RecommendationPanel } from "@/components/recommendations/recommendation-panel"

export default function Page() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">E-commerce Recommender Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Generate product recommendations from your catalog. Optionally provide a user ID to use their interactions.
          Explanations are powered by the LLM.
        </p>
      </header>

      <RecommendationPanel />
    </main>
  )
}
