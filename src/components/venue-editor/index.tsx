"use client";

import { useEffect, useRef } from "react";
import { EditorProvider, useEditor } from "./editor-context";
import { ThemeProvider } from "./theme-provider";
import dynamic from "next/dynamic";

// Make all components that use Radix UI client-only to prevent hydration errors
const EditorHeader = dynamic(
	() => import("./header").then((mod) => ({ default: mod.EditorHeader })),
	{
		ssr: false,
	},
);

const ElementPalette = dynamic(
	() =>
		import("./element-palette").then((mod) => ({
			default: mod.ElementPalette,
		})),
	{
		ssr: false,
	},
);

const TierPalette = dynamic(
	() => import("./tier-palette").then((mod) => ({ default: mod.TierPalette })),
	{
		ssr: false,
	},
);

const BottomToolbar = dynamic(
	() =>
		import("./bottom-toolbar").then((mod) => ({ default: mod.BottomToolbar })),
	{
		ssr: false,
	},
);

const PropertiesPanel = dynamic(
	() =>
		import("./properties-panel").then((mod) => ({
			default: mod.PropertiesPanel,
		})),
	{
		ssr: false,
	},
);

const MobileToolbar = dynamic(
	() =>
		import("./mobile-toolbar").then((mod) => ({ default: mod.MobileToolbar })),
	{
		ssr: false,
	},
);

const StatsBar = dynamic(
	() => import("./stats-bar").then((mod) => ({ default: mod.StatsBar })),
	{
		ssr: false,
	},
);

import { EditorCanvas } from "./canvas";

function KeyboardShortcutsHandler() {
	const {
		setActiveTool,
		setIsPanModeLocked,
		isPanModeLocked,
		activeTool,
		undo,
		redo,
		canUndo,
		canRedo,
		copySelection,
		pasteSelection,
		hasCopiedData,
		selectedElements,
		zoomIn,
		zoomOut,
		fitToScreen,
		setZoom,
		zoom,
	} = useEditor();

	const spacePressedRef = useRef(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Check if user is typing in an input/textarea
			const activeElement = document.activeElement;
			const isInputActive =
				activeElement &&
				(activeElement.tagName === "INPUT" ||
					activeElement.tagName === "TEXTAREA" ||
					activeElement.getAttribute("contenteditable") === "true");

			if (isInputActive) {
				return;
			}

			const isCtrlLikePressed = e.ctrlKey || e.metaKey;
			const key = e.key.toLowerCase();
			const hasShift = e.shiftKey;

			// Tool shortcuts
			if (!isCtrlLikePressed && !hasShift) {
				switch (key) {
					case "v":
						e.preventDefault();
						setIsPanModeLocked(false);
						setActiveTool("select");
						return;
					case "h":
						e.preventDefault();
						setIsPanModeLocked(true);
						setActiveTool("pan");
						return;
					case " ": // Space - temporary pan mode
						if (!isPanModeLocked && !spacePressedRef.current) {
							e.preventDefault();
							spacePressedRef.current = true;
							setIsPanModeLocked(true);
							setActiveTool("pan");
						}
						return;
					case "s":
						e.preventDefault();
						setActiveTool("seat-row");
						return;
					case "a":
						e.preventDefault();
						setActiveTool("standing");
						return;
					case "b":
						e.preventDefault();
						setActiveTool("box");
						return;
					case "t":
						e.preventDefault();
						setActiveTool("table");
						return;
					case "f":
						e.preventDefault();
						fitToScreen();
						return;
					case "1":
						e.preventDefault();
						setZoom(Math.max(0.1, zoom - 0.1));
						return;
					case "2":
						e.preventDefault();
						setZoom(Math.min(2, zoom + 0.1));
						return;
				}
			}

			// Ctrl/Cmd shortcuts
			if (isCtrlLikePressed && !hasShift) {
				switch (key) {
					case "z":
						e.preventDefault();
						if (canUndo) undo();
						return;
					case "y":
						e.preventDefault();
						if (canRedo) redo();
						return;
					case "c":
						e.preventDefault();
						if (selectedElements.length > 0) copySelection();
						return;
					case "v":
						e.preventDefault();
						if (hasCopiedData) pasteSelection();
						return;
					case "s":
						e.preventDefault();
						// Save handled by header
						return;
					case "e":
						e.preventDefault();
						// Export handled by header
						return;
					case "i":
						e.preventDefault();
						// Import handled by header
						return;
				}
			}

			// Ctrl/Cmd + Shift shortcuts
			if (isCtrlLikePressed && hasShift) {
				switch (key) {
					case "p":
						e.preventDefault();
						// Publish handled by header
						return;
				}
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			// Reset pan mode when space is released (only if it was temporary)
			if (e.key === " " && spacePressedRef.current) {
				spacePressedRef.current = false;
				setIsPanModeLocked(false);
				setActiveTool("select");
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [
		setActiveTool,
		setIsPanModeLocked,
		isPanModeLocked,
		activeTool,
		undo,
		redo,
		canUndo,
		canRedo,
		copySelection,
		pasteSelection,
		hasCopiedData,
		selectedElements,
		zoomIn,
		zoomOut,
		fitToScreen,
		setZoom,
		zoom,
	]);

	return null;
}

function VenueMapEditorContent() {
	const { selectedElements } = useEditor();

	return (
		<>
			<KeyboardShortcutsHandler />
			<div className="flex h-screen flex-col overflow-hidden bg-background">
				<EditorHeader />
				<div className="flex flex-1 overflow-hidden">
					<div className="relative flex flex-1 flex-col overflow-hidden">
						<ElementPalette />
						<TierPalette />
						<EditorCanvas />
						<BottomToolbar />
						<MobileToolbar />
					</div>
					{selectedElements.length > 0 && <PropertiesPanel />}
				</div>
				<StatsBar />
			</div>
		</>
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
