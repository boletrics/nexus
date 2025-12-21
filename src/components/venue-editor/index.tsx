"use client";

import { EditorProvider, useEditor } from "./editor-context";
import { ThemeProvider } from "./theme-provider";
import { EditorHeader } from "./header";
import { EditorToolbar } from "./toolbar";
import { TierPalette } from "./tier-palette";
import { ZoomControls } from "./zoom-controls";
import { EditorCanvas } from "./canvas";
import { PropertiesPanel } from "./properties-panel";
import { MobileToolbar } from "./mobile-toolbar";
import { StatsBar } from "./stats-bar";

function VenueMapEditorContent() {
	const { selectedElement } = useEditor();

	return (
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
				{selectedElement && <PropertiesPanel />}
			</div>
			<StatsBar />
		</div>
	);
}

export function VenueMapEditor() {
	return (
		<ThemeProvider>
			<EditorProvider>
				<VenueMapEditorContent />
			</EditorProvider>
		</ThemeProvider>
	);
}
