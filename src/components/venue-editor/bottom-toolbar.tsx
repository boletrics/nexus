"use client";

import { useState, useEffect } from "react";
import { useEditor } from "./editor-context";
import { Button } from "@/components/ui/button";
import {
	Hand,
	MousePointer2,
	Undo,
	Redo,
	Copy,
	Clipboard,
	ZoomIn,
	ZoomOut,
	Maximize,
	Check,
	Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomToolbar() {
	const {
		zoom,
		setZoom,
		activeTool,
		setActiveTool,
		isPanModeLocked,
		setIsPanModeLocked,
		undo,
		redo,
		canUndo,
		canRedo,
		copySelection,
		pasteSelection,
		hasCopiedData,
		selectedElements,
		deleteElement,
		fitToScreen,
	} = useEditor();

	const [justCopied, setJustCopied] = useState(false);
	const isHandToolActive = isPanModeLocked || activeTool === "pan";

	useEffect(() => {
		if (justCopied) {
			const timer = setTimeout(() => {
				setJustCopied(false);
			}, 1500);
			return () => clearTimeout(timer);
		}
	}, [justCopied]);

	const handlePanToggle = () => {
		const next = !isPanModeLocked;
		setIsPanModeLocked(next);
		if (!next) {
			setActiveTool("select");
		} else {
			setActiveTool("pan");
		}
	};

	const activateSelectionMode = () => {
		setIsPanModeLocked(false);
		setActiveTool("select");
	};

	const handleCopy = () => {
		if (selectedElements.length > 0) {
			copySelection();
			setJustCopied(true);
		}
	};

	const handleZoomIn = () => {
		setZoom(Math.min(2, zoom + 0.1));
	};

	const handleZoomOut = () => {
		setZoom(Math.max(0.1, zoom - 0.1));
	};

	return (
		<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
			{/* Indicador de zoom */}
			<div className="rounded bg-card/90 px-3 py-1 text-sm text-muted-foreground shadow-lg">
				{Math.round(zoom * 100)}%
			</div>

			{/* Herramientas y controles */}
			<div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/95 px-2 py-1.5 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/90">
				{/* Herramientas */}
				<Button
					size="icon"
					variant="ghost"
					className={cn(
						"h-8 w-8 transition-colors",
						isHandToolActive &&
							"border border-primary/30 bg-primary/10 text-primary shadow-inner ring-1 ring-primary/30",
					)}
					title="Herramienta de pan (mano)"
					aria-label="Herramienta de pan (mano)"
					aria-pressed={isHandToolActive}
					data-state={isHandToolActive ? "active" : "inactive"}
					onClick={handlePanToggle}
				>
					<Hand className={cn("h-4 w-4", isHandToolActive && "text-primary")} />
				</Button>
				<Button
					size="icon"
					variant="ghost"
					className={cn(
						"h-8 w-8 transition-colors",
						!isHandToolActive &&
							"border border-primary/30 bg-primary/10 text-primary shadow-inner ring-1 ring-primary/30",
					)}
					title="Herramienta de selección (puntero)"
					aria-label="Herramienta de selección (puntero)"
					aria-pressed={!isHandToolActive}
					data-state={!isHandToolActive ? "active" : "inactive"}
					onClick={activateSelectionMode}
				>
					<MousePointer2
						className={cn("h-4 w-4", !isHandToolActive && "text-primary")}
					/>
				</Button>
				<div className="mx-1 h-6 w-px bg-border" />
				<Button
					size="icon"
					variant="ghost"
					className="h-8 w-8"
					title="Deshacer (Ctrl+Z / Cmd+Z)"
					disabled={!canUndo}
					aria-disabled={!canUndo}
					onClick={undo}
				>
					<Undo className="h-4 w-4" />
				</Button>
				<Button
					size="icon"
					variant="ghost"
					className="h-8 w-8"
					title="Rehacer (Ctrl+Y / Cmd+Y)"
					disabled={!canRedo}
					aria-disabled={!canRedo}
					onClick={redo}
				>
					<Redo className="h-4 w-4" />
				</Button>
				<div className="mx-1 h-6 w-px bg-border" />
				<Button
					size="icon"
					variant="ghost"
					className={cn(
						"h-8 w-8 transition-colors",
						justCopied &&
							"border border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
					)}
					title={justCopied ? "¡Copiado!" : "Copiar (Ctrl/Cmd+C)"}
					disabled={selectedElements.length === 0}
					onClick={handleCopy}
				>
					{justCopied ? (
						<Check className="h-4 w-4" />
					) : (
						<Copy className="h-4 w-4" />
					)}
				</Button>
				<Button
					size="icon"
					variant="ghost"
					className="h-8 w-8"
					title="Pegar (Ctrl/Cmd+V)"
					disabled={!hasCopiedData}
					onClick={pasteSelection}
				>
					<Clipboard className="h-4 w-4" />
				</Button>
				{selectedElements.length > 0 && (
					<>
						<div className="mx-1 h-6 w-px bg-border" />
						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
							title="Eliminar elemento(s) (Delete)"
							onClick={() =>
								selectedElements.forEach((id) => deleteElement(id))
							}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</>
				)}
				<div className="mx-1 h-6 w-px bg-border" />
				{/* Controles de zoom */}
				<Button
					size="icon"
					variant="ghost"
					className="h-8 w-8"
					onClick={handleZoomIn}
					title="Acercar"
				>
					<ZoomIn className="h-4 w-4" />
				</Button>
				<Button
					size="icon"
					variant="ghost"
					className="h-8 w-8"
					onClick={handleZoomOut}
					title="Alejar"
				>
					<ZoomOut className="h-4 w-4" />
				</Button>
				<Button
					size="icon"
					variant="ghost"
					className="h-8 w-8"
					onClick={fitToScreen}
					title="Ajustar a vista (F)"
				>
					<Maximize className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
