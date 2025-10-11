import type { Product, Recommendation } from "./types"

export const categories: string[] = ["Laptops", "Headphones", "Smartphones", "Monitors", "Accessories"]

const products: Product[] = [
  {
    id: 1,
    name: "Aurora X15 Laptop",
    description: "15-inch performance laptop with long battery life and a bright display.",
    category: "Laptops",
    price: 1299,
    brand: "Aurora",
    features: { cpu: "Intel i7", ram: "16GB", storage: "512GB SSD", weight: "1.6kg" },
  },
  {
    id: 2,
    name: "Nimbus ANC Headphones",
    description: "Wireless over-ear headphones with active noise cancellation.",
    category: "Headphones",
    price: 249,
    brand: "Nimbus",
    features: { anc: true, codec: ["AAC", "LDAC"], battery: "35h" },
  },
  {
    id: 3,
    name: "Pixelon S Pro",
    description: "Flagship smartphone with exceptional camera performance.",
    category: "Smartphones",
    price: 999,
    brand: "Pixelon",
    features: { camera: "50MP", display: '6.7" OLED 120Hz', battery: "4500mAh" },
  },
  {
    id: 4,
    name: "Clarity 27Q Monitor",
    description: "27-inch QHD monitor with 99% sRGB and ergonomic stand.",
    category: "Monitors",
    price: 329,
    brand: "Clarity",
    features: { size: '27"', resolution: "2560x1440", refresh: "75Hz" },
  },
  {
    id: 5,
    name: "Bolt USB-C Charger",
    description: "Compact 65W GaN charger with dual USB-C ports.",
    category: "Accessories",
    price: 49,
    brand: "Bolt",
    features: { power: "65W", ports: 2 },
  },
  {
    id: 6,
    name: "Aurora X13 Laptop",
    description: "13-inch ultralight laptop for mobility and productivity.",
    category: "Laptops",
    price: 999,
    brand: "Aurora",
    features: { cpu: "Intel i5", ram: "8GB", storage: "256GB SSD", weight: "1.1kg" },
  },
]

export const recommendations: Recommendation[] = [
  {
    product: products[0],
    score: 92,
    explanation:
      "Based on your preference for long battery life and bright displays, the Aurora X15 offers a balanced performance and strong portability.",
  },
  {
    product: products[1],
    score: 88,
    explanation:
      "These headphones align with your noise-sensitive environments and need for high-fidelity codecs like LDAC for better audio quality.",
  },
  {
    product: products[2],
    score: 90,
    explanation:
      "Given your interest in mobile photography and smooth displays, the Pixelon S Pro provides a top-tier camera and 120Hz screen.",
  },
  {
    product: products[3],
    score: 81,
    explanation:
      "Ideal for a crisp workspace with accurate colors and ergonomic adjustments that match your long work sessions.",
  },
  {
    product: products[4],
    score: 74,
    explanation: "A practical addition for multi-device charging with compact GaN tech to keep your desk travel-ready.",
  },
  {
    product: products[5],
    score: 85,
    explanation:
      "Great for on-the-go work thanks to its lightweight design while maintaining solid productivity performance.",
  },
]
