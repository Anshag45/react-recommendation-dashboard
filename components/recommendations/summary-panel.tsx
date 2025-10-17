"use client"

import { motion } from "framer-motion"

interface SummaryData {
  categories: Record<string, number>
  brands: Record<string, number>
  avgPrice: number
  totalInteractions: number
}

export function SummaryPanel({ data }: { data: SummaryData }) {
  const topCategories = Object.entries(data.categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const topBrands = Object.entries(data.brands)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 shadow-lg border border-slate-700"
    >
      <h2 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">Your Behavior Profile</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Categories */}
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-medium">Top Categories</p>
          <div className="space-y-1">
            {topCategories.map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{cat}</span>
                <span className="text-xs font-bold text-blue-400">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-medium">Top Brands</p>
          <div className="space-y-1">
            {topBrands.map(([brand, count]) => (
              <div key={brand} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{brand}</span>
                <span className="text-xs font-bold text-purple-400">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avg Price */}
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-medium">Avg Spend</p>
          <p className="text-lg font-bold text-green-400">₹{data.avgPrice.toLocaleString("en-IN")}</p>
        </div>

        {/* Total Interactions */}
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-medium">Interactions</p>
          <p className="text-lg font-bold text-orange-400">{data.totalInteractions}</p>
        </div>
      </div>
    </motion.div>
  )
}
