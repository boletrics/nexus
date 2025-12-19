"use client"

import { EditorProvider } from "./editor-context"
import { ThemeProvider } from "./theme-provider"
import { EditorHeader } from "./header"
import { EditorToolbar } from "./toolbar"
import { TierPalette } from "./tier-palette"
import { ZoomControls } from "./zoom-controls"
import { EditorCanvas } from "./canvas"
import { PropertiesPanel } from "./properties-panel"
import { MobileToolbar } from "./mobile-toolbar"
import { StatsBar } from "./stats-bar"

export function VenueMapEditor() {
  return (
    <ThemeProvider>
      <EditorProvider>
        <div className="flex h-screen flex-col overflow-hidden bg-background">
          <EditorHeader />
          <div className="flex flex-1 overflow-hidden">
            <div className="relative flex flex-1 flex-col overflow-hidden">
              <EditorToolbar />
              <TierPalette />
              <EditorCanvas />
              <ZoomControls />
              <MobileToolbar />
            </div>
            <PropertiesPanel />
          </div>
          <StatsBar />
        </div>
      </EditorProvider>
    </ThemeProvider>
  )
}
