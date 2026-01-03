// Gem cutting patterns and facet definitions
export interface Facet {
  id: string
  name: string
  angle: number // Cutting angle in degrees
  rotation: number // Rotation around gem axis
  depth: number // Cutting depth percentage
  order: number // Sequence order
}

export interface GemPattern {
  id: string
  name: string
  description: string
  gemType: string
  facets: Facet[]
  estimatedTime: number // In minutes
  difficulty: "beginner" | "intermediate" | "advanced"
}

export const GEM_PATTERNS: GemPattern[] = [
  {
    id: "round-brilliant",
    name: "Round Brilliant",
    description: "58 facets for maximum brilliance and fire",
    gemType: "Diamond",
    difficulty: "advanced",
    estimatedTime: 120,
    facets: [
      // Table
      { id: "table", name: "Table", angle: 0, rotation: 0, depth: 5, order: 1 },
      // Crown main facets (8 bezel facets)
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `bezel-${i}`,
        name: `Bezel ${i + 1}`,
        angle: 34,
        rotation: i * 45,
        depth: 15,
        order: i + 2,
      })),
      // Star facets
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `star-${i}`,
        name: `Star ${i + 1}`,
        angle: 28,
        rotation: i * 45 + 22.5,
        depth: 12,
        order: i + 10,
      })),
      // Upper girdle facets
      ...Array.from({ length: 16 }, (_, i) => ({
        id: `upper-girdle-${i}`,
        name: `Upper Girdle ${i + 1}`,
        angle: 42,
        rotation: i * 22.5,
        depth: 8,
        order: i + 18,
      })),
      // Pavilion main facets
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `pavilion-main-${i}`,
        name: `Pavilion Main ${i + 1}`,
        angle: 41,
        rotation: i * 45,
        depth: 43,
        order: i + 34,
      })),
      // Lower girdle facets
      ...Array.from({ length: 16 }, (_, i) => ({
        id: `lower-girdle-${i}`,
        name: `Lower Girdle ${i + 1}`,
        angle: 43,
        rotation: i * 22.5,
        depth: 38,
        order: i + 42,
      })),
      // Culet
      { id: "culet", name: "Culet", angle: 90, rotation: 0, depth: 100, order: 58 },
    ],
  },
  {
    id: "emerald-cut",
    name: "Emerald Cut",
    description: "Step-cut rectangular shape with 57 facets",
    gemType: "Emerald",
    difficulty: "intermediate",
    estimatedTime: 90,
    facets: [
      { id: "table", name: "Table", angle: 0, rotation: 0, depth: 5, order: 1 },
      ...Array.from({ length: 4 }, (_, i) => ({
        id: `corner-${i}`,
        name: `Corner ${i + 1}`,
        angle: 42,
        rotation: i * 90,
        depth: 15,
        order: i + 2,
      })),
      ...Array.from({ length: 24 }, (_, i) => ({
        id: `step-${i}`,
        name: `Step ${i + 1}`,
        angle: 38 + (i % 3) * 2,
        rotation: (i * 15) % 360,
        depth: 20 + (i % 3) * 10,
        order: i + 6,
      })),
    ],
  },
  {
    id: "princess-cut",
    name: "Princess Cut",
    description: "Square brilliant cut with 57-58 facets",
    gemType: "Diamond",
    difficulty: "advanced",
    estimatedTime: 110,
    facets: [
      { id: "table", name: "Table", angle: 0, rotation: 0, depth: 5, order: 1 },
      ...Array.from({ length: 4 }, (_, i) => ({
        id: `crown-main-${i}`,
        name: `Crown Main ${i + 1}`,
        angle: 36,
        rotation: i * 90,
        depth: 15,
        order: i + 2,
      })),
      ...Array.from({ length: 16 }, (_, i) => ({
        id: `crown-facet-${i}`,
        name: `Crown Facet ${i + 1}`,
        angle: 32 + (i % 4) * 2,
        rotation: i * 22.5,
        depth: 12,
        order: i + 6,
      })),
    ],
  },
  {
    id: "cushion-cut",
    name: "Cushion Cut",
    description: "Rounded square with 58 facets",
    gemType: "Sapphire",
    difficulty: "intermediate",
    estimatedTime: 95,
    facets: [
      { id: "table", name: "Table", angle: 0, rotation: 0, depth: 5, order: 1 },
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `main-${i}`,
        name: `Main ${i + 1}`,
        angle: 35,
        rotation: i * 45,
        depth: 16,
        order: i + 2,
      })),
    ],
  },
  {
    id: "oval-brilliant",
    name: "Oval Brilliant",
    description: "Elongated brilliant cut with 56 facets",
    gemType: "Ruby",
    difficulty: "intermediate",
    estimatedTime: 100,
    facets: [
      { id: "table", name: "Table", angle: 0, rotation: 0, depth: 5, order: 1 },
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `bezel-${i}`,
        name: `Bezel ${i + 1}`,
        angle: 34,
        rotation: i * 45,
        depth: 15,
        order: i + 2,
      })),
    ],
  },
]

export function getPatternById(id: string): GemPattern | undefined {
  return GEM_PATTERNS.find((p) => p.id === id)
}

export function calculateCuttingPath(pattern: GemPattern) {
  return pattern.facets
    .sort((a, b) => a.order - b.order)
    .map((facet) => ({
      facet,
      position: {
        angle: facet.angle,
        rotation: facet.rotation,
      },
    }))
}
