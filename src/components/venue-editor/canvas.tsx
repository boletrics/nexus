"use client"

import type React from "react"

import { useRef, useEffect, useCallback, useState } from "react"
import { useEditor } from "./editor-context"
import { SeatRowElement, StandingAreaElement, BoxElement, TableElement } from "./canvas-elements"
import type { VenueElement, Position, ElementType } from "@/lib/types"
import { generateId } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function EditorCanvas() {
  const {
    venue,
    mode,
    selectedElement,
    selectedTier,
    zoom,
    pan,
    setPan,
    activeTool,
    showGrid,
    setSelectedElement,
    updateElement,
    addElement,
    assignTierToElement,
    setIsDragging,
  } = useEditor()

  const containerRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [dragStart, setDragStart] = useState<Position | null>(null)
  const [elementDragStart, setElementDragStart] = useState<{ id: string; startPos: Position } | null>(null)
  const [isDraggingElement, setIsDraggingElement] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        const { setZoom, zoom } = useEditor.getState?.() || { setZoom: () => {}, zoom: 1 }
      } else if (e.shiftKey) {
        e.preventDefault()
        setPan((prev) => ({ x: prev.x - e.deltaY, y: prev.y }))
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [setPan])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElement) {
        const { deleteElement } = useEditor.getState?.() || {}
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedElement])

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      const target = e.target as HTMLElement | SVGElement
      const isCanvasBackground =
        target === e.currentTarget ||
        target.tagName === "svg" ||
        (target.tagName === "rect" && target.getAttribute("fill")?.includes("url(#grid"))

      if (isCanvasBackground && !isDraggingElement) {
        setIsPanning(true)
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
        setSelectedElement(null)
      }
    },
    [pan, setSelectedElement, isDraggingElement],
  )

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (elementDragStart && isDraggingElement) {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return

        const newX = (e.clientX - rect.left - pan.x) / zoom - 50
        const newY = (e.clientY - rect.top - pan.y) / zoom - 50

        updateElement(elementDragStart.id, {
          position: { x: Math.max(0, newX), y: Math.max(0, newY) },
        })
        return
      }

      if (isPanning && dragStart && !isDraggingElement) {
        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [isPanning, dragStart, elementDragStart, isDraggingElement, pan, zoom, setPan, updateElement],
  )

  const handleCanvasMouseUp = useCallback(() => {
    setIsPanning(false)
    setDragStart(null)
    setElementDragStart(null)
    setIsDraggingElement(false)
    setIsDragging(false)
  }, [setIsDragging])

  const handleElementClick = useCallback(
    (element: VenueElement) => {
      if (mode === "tier-assignment") {
        assignTierToElement(element.id, selectedTier)
      } else {
        setSelectedElement(element.id)
      }
    },
    [mode, selectedTier, assignTierToElement, setSelectedElement],
  )

  const handleElementDragStart = useCallback(
    (e: React.MouseEvent, element: VenueElement) => {
      e.preventDefault()
      e.stopPropagation()

      if (mode === "edit" && activeTool === "select") {
        setIsDraggingElement(true)
        setElementDragStart({
          id: element.id,
          startPos: element.position,
        })
        setIsDragging(true)
        setSelectedElement(element.id)
      }
    },
    [mode, activeTool, setIsDragging, setSelectedElement],
  )

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (mode === "edit" && activeTool !== "select" && activeTool !== "pan") {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = (e.clientX - rect.left - pan.x) / zoom
        const y = (e.clientY - rect.top - pan.y) / zoom

        const newElement = createNewElement(activeTool as ElementType, { x, y })
        if (newElement) {
          addElement(newElement)
        }
      }
    },
    [mode, activeTool, pan, zoom, addElement],
  )

  const createNewElement = (type: ElementType, position: Position): VenueElement | null => {
    switch (type) {
      case "seat-row":
        return {
          id: generateId(),
          type: "seat-row",
          position,
          seats: 10,
          rowLabel: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
          curved: false,
          curveAngle: 0,
          spacing: 32,
          tier: null,
        }
      case "standing":
        return {
          id: generateId(),
          type: "standing",
          position,
          dimensions: { width: 200, height: 100 },
          capacity: 100,
          label: "Standing Area",
          tier: null,
        }
      case "box":
        return {
          id: generateId(),
          type: "box",
          position,
          dimensions: { width: 100, height: 80 },
          capacity: 6,
          label: "Box",
          amenities: [],
          tier: null,
        }
      case "table":
        return {
          id: generateId(),
          type: "table",
          position,
          seats: 6,
          shape: "round",
          label: "T" + Math.floor(Math.random() * 100),
          tier: null,
        }
      default:
        return null
    }
  }

  const renderElement = (element: VenueElement) => {
    const isSelected = selectedElement === element.id
    const props = {
      element,
      isSelected,
      onClick: () => handleElementClick(element),
      onDragStart: (e: React.MouseEvent) => handleElementDragStart(e, element),
    }

    switch (element.type) {
      case "seat-row":
        return <SeatRowElement key={element.id} {...props} />
      case "standing":
        return <StandingAreaElement key={element.id} {...props} />
      case "box":
        return <BoxElement key={element.id} {...props} />
      case "table":
        return <TableElement key={element.id} {...props} />
      default:
        return null
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex-1 overflow-hidden bg-canvas editor-scrollbar",
        "select-none",
        !isDraggingElement && "cursor-grab",
        isPanning && !isDraggingElement && "cursor-grabbing",
      )}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
      onClick={handleCanvasClick}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {showGrid && (
          <>
            <defs>
              <pattern id="grid-small" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-canvas-grid" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid-large" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#grid-small)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" className="stroke-canvas-grid" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={venue.dimensions.width + 400} height={venue.dimensions.height + 200} fill="url(#grid-large)" />
          </>
        )}

        {venue.stage && (
          <g transform={`translate(${venue.stage.position.x}, ${venue.stage.position.y})`}>
            <rect
              width={venue.stage.dimensions.width}
              height={venue.stage.dimensions.height}
              rx={8}
              className="fill-foreground/90"
            />
            <text
              x={venue.stage.dimensions.width / 2}
              y={venue.stage.dimensions.height / 2 + 5}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-background text-lg font-bold tracking-wider"
            >
              {venue.stage.label}
            </text>
          </g>
        )}

        {venue.elements.map(renderElement)}
      </svg>

      {venue.elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Start building your venue</p>
            <p className="text-sm">Select a tool from the toolbar and click to add elements</p>
          </div>
        </div>
      )}
    </div>
  )
}
