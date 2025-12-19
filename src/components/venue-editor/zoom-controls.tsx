"use client"

import { useEditor } from "./editor-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Minus, Plus, Maximize, RotateCcw } from "lucide-react"

export function ZoomControls() {
  const { zoom, setZoom, zoomIn, zoomOut, resetZoom, fitToScreen } = useEditor()

  return (
    <TooltipProvider delayDuration={300}>
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomOut} disabled={zoom <= 0.25}>
              <Minus className="h-4 w-4" />
              <span className="sr-only">Zoom out</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Zoom Out (Ctrl+Scroll)</TooltipContent>
        </Tooltip>

        <div className="hidden w-24 sm:block">
          <Slider
            value={[zoom]}
            min={0.25}
            max={3}
            step={0.05}
            onValueChange={([value]) => setZoom(value)}
            className="w-full"
          />
        </div>

        <span className="min-w-12 text-center text-xs font-medium tabular-nums text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomIn} disabled={zoom >= 3}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Zoom in</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Zoom In (Ctrl+Scroll)</TooltipContent>
        </Tooltip>

        <div className="mx-1 h-4 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fitToScreen}>
              <Maximize className="h-4 w-4" />
              <span className="sr-only">Fit to screen</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Fit to Screen</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetZoom}>
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Reset zoom</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Reset Zoom (100%)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
