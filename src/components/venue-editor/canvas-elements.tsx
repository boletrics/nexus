"use client"

import type React from "react"
import type { SeatRow, StandingArea, Box, Table, VenueElement, TierType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ElementProps {
  element: VenueElement
  isSelected: boolean
  onClick: () => void
  onDragStart: (e: React.MouseEvent) => void
}

const getTierColorClass = (tier: TierType) => {
  switch (tier) {
    case "vip":
      return "bg-tier-vip"
    case "premium":
      return "bg-tier-premium"
    case "standard":
      return "bg-tier-standard"
    case "economy":
      return "bg-tier-economy"
    default:
      return "bg-muted-foreground/50"
  }
}

export function SeatRowElement({ element, isSelected, onClick, onDragStart }: ElementProps) {
  const row = element as SeatRow
  const seatWidth = 24
  const spacing = row.spacing || 32

  return (
    <g
      transform={`translate(${row.position.x}, ${row.position.y})`}
      onClick={onClick}
      onMouseDown={onDragStart}
      className={cn("cursor-move", isSelected && "drop-shadow-lg")}
    >
      {/* Row label */}
      <text x={-20} y={seatWidth / 2 + 4} className="fill-foreground text-xs font-bold">
        {row.rowLabel}
      </text>

      {/* Seats */}
      {Array.from({ length: row.seats }).map((_, i) => {
        const angle = row.curved ? (i - row.seats / 2) * (row.curveAngle / row.seats) : 0
        const yOffset = row.curved ? Math.abs(angle) * 2 : 0

        return (
          <g key={i} transform={`translate(${i * spacing}, ${yOffset}) rotate(${angle})`}>
            <rect
              width={seatWidth}
              height={seatWidth}
              rx={4}
              className={cn("transition-colors", getTierColorClass(row.tier), isSelected && "stroke-2 stroke-primary")}
            />
            <text
              x={seatWidth / 2}
              y={seatWidth / 2 + 3}
              textAnchor="middle"
              className="fill-white text-[8px] font-medium"
            >
              {i + 1}
            </text>
          </g>
        )
      })}

      {/* Selection outline */}
      {isSelected && (
        <rect
          x={-5}
          y={-5}
          width={row.seats * spacing + 10}
          height={seatWidth + (row.curved ? 30 : 10)}
          rx={4}
          fill="none"
          className="stroke-primary stroke-2"
          strokeDasharray="4 2"
        />
      )}
    </g>
  )
}

export function StandingAreaElement({ element, isSelected, onClick, onDragStart }: ElementProps) {
  const area = element as StandingArea

  return (
    <g
      transform={`translate(${area.position.x}, ${area.position.y})`}
      onClick={onClick}
      onMouseDown={onDragStart}
      className="cursor-move"
    >
      <rect
        width={area.dimensions.width}
        height={area.dimensions.height}
        rx={8}
        className={cn(
          "transition-colors",
          getTierColorClass(area.tier),
          "opacity-60",
          isSelected && "stroke-2 stroke-primary",
        )}
      />
      {/* Pattern overlay */}
      <pattern id={`standing-pattern-${area.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="3" className="fill-white/30" />
      </pattern>
      <rect
        width={area.dimensions.width}
        height={area.dimensions.height}
        rx={8}
        fill={`url(#standing-pattern-${area.id})`}
      />
      {/* Label */}
      <text
        x={area.dimensions.width / 2}
        y={area.dimensions.height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white text-sm font-semibold"
      >
        {area.label}
      </text>
      <text
        x={area.dimensions.width / 2}
        y={area.dimensions.height / 2 + 16}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white/80 text-xs"
      >
        Cap: {area.capacity}
      </text>

      {isSelected && (
        <rect
          x={-4}
          y={-4}
          width={area.dimensions.width + 8}
          height={area.dimensions.height + 8}
          rx={10}
          fill="none"
          className="stroke-primary stroke-2"
          strokeDasharray="4 2"
        />
      )}
    </g>
  )
}

export function BoxElement({ element, isSelected, onClick, onDragStart }: ElementProps) {
  const box = element as Box

  return (
    <g
      transform={`translate(${box.position.x}, ${box.position.y})`}
      onClick={onClick}
      onMouseDown={onDragStart}
      className="cursor-move"
    >
      <rect
        width={box.dimensions.width}
        height={box.dimensions.height}
        rx={4}
        className={cn("transition-colors", getTierColorClass(box.tier), isSelected && "stroke-2 stroke-primary")}
      />
      {/* Inner border */}
      <rect
        x={4}
        y={4}
        width={box.dimensions.width - 8}
        height={box.dimensions.height - 8}
        rx={2}
        fill="none"
        className="stroke-white/30 stroke-1"
      />
      {/* Label */}
      <text
        x={box.dimensions.width / 2}
        y={box.dimensions.height / 2 - 8}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white text-sm font-bold"
      >
        {box.label}
      </text>
      <text
        x={box.dimensions.width / 2}
        y={box.dimensions.height / 2 + 8}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white/80 text-xs"
      >
        {box.capacity} seats
      </text>

      {isSelected && (
        <rect
          x={-4}
          y={-4}
          width={box.dimensions.width + 8}
          height={box.dimensions.height + 8}
          rx={6}
          fill="none"
          className="stroke-primary stroke-2"
          strokeDasharray="4 2"
        />
      )}
    </g>
  )
}

export function TableElement({ element, isSelected, onClick, onDragStart }: ElementProps) {
  const table = element as Table
  const size = 60

  return (
    <g
      transform={`translate(${table.position.x}, ${table.position.y})`}
      onClick={onClick}
      onMouseDown={onDragStart}
      className="cursor-move"
    >
      {table.shape === "round" ? (
        <>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2}
            className={cn("transition-colors", getTierColorClass(table.tier), isSelected && "stroke-2 stroke-primary")}
          />
          {/* Chairs around table */}
          {Array.from({ length: table.seats }).map((_, i) => {
            const angle = (i / table.seats) * Math.PI * 2 - Math.PI / 2
            const chairX = size / 2 + Math.cos(angle) * (size / 2 + 12)
            const chairY = size / 2 + Math.sin(angle) * (size / 2 + 12)
            return <circle key={i} cx={chairX} cy={chairY} r={8} className="fill-muted-foreground/60" />
          })}
        </>
      ) : (
        <rect
          width={size * 1.5}
          height={size}
          rx={4}
          className={cn("transition-colors", getTierColorClass(table.tier), isSelected && "stroke-2 stroke-primary")}
        />
      )}
      {/* Label */}
      <text
        x={table.shape === "round" ? size / 2 : (size * 1.5) / 2}
        y={size / 2 + 4}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white text-xs font-bold"
      >
        {table.label}
      </text>

      {isSelected && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 + 20}
          fill="none"
          className="stroke-primary stroke-2"
          strokeDasharray="4 2"
        />
      )}
    </g>
  )
}
