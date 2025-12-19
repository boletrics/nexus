"use client"

import { useEditor } from "./editor-context"
import { TIERS } from "@/lib/types"
import { Users, Armchair, Square, CircleDollarSign } from "lucide-react"

export function StatsBar() {
  const { venue } = useEditor()

  // Calculate stats
  const totalSeats = venue.elements.reduce((acc, el) => {
    if (el.type === "seat-row") return acc + el.seats
    if (el.type === "table") return acc + el.seats
    if (el.type === "box") return acc + el.capacity
    return acc
  }, 0)

  const standingCapacity = venue.elements
    .filter((el) => el.type === "standing")
    .reduce((acc, el) => acc + (el as any).capacity, 0)

  const totalCapacity = totalSeats + standingCapacity

  // Calculate revenue potential
  const revenuePotential = venue.elements.reduce((acc, el) => {
    const tier = TIERS.find((t) => t.id === el.tier)
    if (!tier) return acc

    let seats = 0
    if (el.type === "seat-row") seats = el.seats
    if (el.type === "table") seats = el.seats
    if (el.type === "box") seats = el.capacity
    if (el.type === "standing") seats = el.capacity

    return acc + seats * tier.price
  }, 0)

  return (
    <div className="flex h-10 items-center justify-between border-t border-border bg-card px-4">
      <div className="flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Armchair className="h-3.5 w-3.5" />
          <span>
            Seats: <span className="font-medium text-foreground">{totalSeats}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>
            Standing: <span className="font-medium text-foreground">{standingCapacity}</span>
          </span>
        </div>
        <div className="hidden items-center gap-2 text-muted-foreground sm:flex">
          <Square className="h-3.5 w-3.5" />
          <span>
            Total: <span className="font-medium text-foreground">{totalCapacity}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <CircleDollarSign className="h-3.5 w-3.5" />
        <span>
          Max Revenue: <span className="font-medium text-foreground">${revenuePotential.toLocaleString()}</span>
        </span>
      </div>
    </div>
  )
}
