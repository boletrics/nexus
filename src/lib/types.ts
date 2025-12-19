// Venue Map Editor Types

export type EditorMode = "edit" | "tier-assignment"

export type ElementType = "seat-row" | "standing" | "box" | "table"

export type TierType = "vip" | "premium" | "standard" | "economy" | null

export interface Position {
  x: number
  y: number
}

export interface Dimensions {
  width: number
  height: number
}

export interface SeatRow {
  id: string
  type: "seat-row"
  position: Position
  seats: number
  rowLabel: string
  curved: boolean
  curveAngle: number
  spacing: number
  tier: TierType
}

export interface StandingArea {
  id: string
  type: "standing"
  position: Position
  dimensions: Dimensions
  capacity: number
  label: string
  tier: TierType
}

export interface Box {
  id: string
  type: "box"
  position: Position
  dimensions: Dimensions
  capacity: number
  label: string
  amenities: string[]
  tier: TierType
}

export interface Table {
  id: string
  type: "table"
  position: Position
  seats: number
  shape: "round" | "rectangular"
  label: string
  tier: TierType
}

export type VenueElement = SeatRow | StandingArea | Box | Table

export interface Stage {
  position: Position
  dimensions: Dimensions
  label: string
}

export interface VenueMap {
  id: string
  name: string
  dimensions: Dimensions
  elements: VenueElement[]
  stage: Stage | null
}

export interface Tier {
  id: TierType
  name: string
  color: string
  price: number
}

export const TIERS: Tier[] = [
  { id: "vip", name: "VIP", color: "bg-tier-vip", price: 250 },
  { id: "premium", name: "Premium", color: "bg-tier-premium", price: 150 },
  { id: "standard", name: "Standard", color: "bg-tier-standard", price: 85 },
  { id: "economy", name: "Economy", color: "bg-tier-economy", price: 45 },
]

export const TAILWIND_COLORS = [
  { name: "Slate", value: "slate" },
  { name: "Gray", value: "gray" },
  { name: "Zinc", value: "zinc" },
  { name: "Red", value: "red" },
  { name: "Orange", value: "orange" },
  { name: "Amber", value: "amber" },
  { name: "Yellow", value: "yellow" },
  { name: "Lime", value: "lime" },
  { name: "Green", value: "green" },
  { name: "Emerald", value: "emerald" },
  { name: "Teal", value: "teal" },
  { name: "Cyan", value: "cyan" },
  { name: "Sky", value: "sky" },
  { name: "Blue", value: "blue" },
  { name: "Indigo", value: "indigo" },
  { name: "Violet", value: "violet" },
  { name: "Purple", value: "purple" },
  { name: "Fuchsia", value: "fuchsia" },
  { name: "Pink", value: "pink" },
  { name: "Rose", value: "rose" },
]
