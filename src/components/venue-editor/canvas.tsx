"use client";

import type React from "react";

import { useRef, useEffect, useCallback, useState } from "react";
import { useEditor } from "./editor-context";
import {
	SeatRowElement,
	StandingAreaElement,
	BoxElement,
	TableElement,
} from "./canvas-elements";
import type { VenueElement, Position, ElementType } from "@/lib/types";
import { generateId } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const GRID_BASE_SIZE = 24;

const getCanvasGridStyle = (
	pan: { x: number; y: number },
	zoom: number,
): React.CSSProperties => {
	const safeZoom = Math.max(zoom, 0.1);
	const gridSize = GRID_BASE_SIZE * safeZoom;
	const backgroundSize = `${gridSize}px ${gridSize}px`;
	const backgroundPosition = `${pan.x}px ${pan.y}px`;

	return {
		backgroundSize,
		backgroundPosition,
	};
};

export function EditorCanvas() {
	const {
		venue,
		mode,
		selectedElements: rawSelectedElements,
		selectedTier,
		zoom,
		pan,
		setPan,
		setZoom,
		activeTool,
		setActiveTool,
		showGrid,
		isPanModeLocked,
		setSelectedElements,
		updateElement,
		addElement,
		deleteElement,
		assignTierToElement,
		setIsDragging,
		isPanCalculated,
	} = useEditor();

	// Ensure selectedElements is always an array
	const selectedElements = Array.isArray(rawSelectedElements)
		? rawSelectedElements
		: [];

	const containerRef = useRef<HTMLDivElement>(null);
	const [isPanning, setIsPanning] = useState(false);
	const [dragStart, setDragStart] = useState<Position | null>(null);
	const [elementDragStart, setElementDragStart] = useState<{
		id: string;
		startPos: Position;
	} | null>(null);
	const [isDraggingElement, setIsDraggingElement] = useState(false);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleWheel = (e: WheelEvent) => {
			if (e.ctrlKey) {
				e.preventDefault();
				const delta = e.deltaY > 0 ? -0.1 : 0.1;
				setZoom(zoom + delta);
			} else if (e.shiftKey) {
				e.preventDefault();
				setPan({ x: pan.x - e.deltaY, y: pan.y });
			}
		};

		container.addEventListener("wheel", handleWheel, { passive: false });
		return () => container.removeEventListener("wheel", handleWheel);
	}, [setPan, setZoom, zoom]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				(e.key === "Delete" || e.key === "Backspace") &&
				selectedElements.length > 0
			) {
				selectedElements.forEach((id) => deleteElement(id));
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedElements, deleteElement]);

	const handleCanvasMouseDown = useCallback(
		(e: React.MouseEvent) => {
			// Don't prevent default if clicking on an element
			const target = e.target as HTMLElement | SVGElement;
			const isElement = target.closest(".venue-element");
			if (isElement) {
				// Let element handle the click
				return;
			}

			e.preventDefault();

			const isCanvasBackground =
				target === e.currentTarget ||
				target.tagName === "svg" ||
				target.tagName === "g" ||
				(target.tagName === "rect" &&
					target.getAttribute("fill")?.includes("url(#grid"));

			if (isCanvasBackground && !isDraggingElement) {
				if (isPanModeLocked || activeTool === "pan") {
					setIsPanning(true);
					setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
				} else if (activeTool === "select") {
					// Clear selection only if not holding shift (like workflow)
					if (!e.shiftKey) {
						setSelectedElements([]);
					}
				}
			}
		},
		[pan, setSelectedElements, isDraggingElement, isPanModeLocked, activeTool],
	);

	const handleCanvasMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (elementDragStart && isDraggingElement) {
				const rect = containerRef.current?.getBoundingClientRect();
				if (!rect) return;

				const newX = (e.clientX - rect.left - pan.x) / zoom - 50;
				const newY = (e.clientY - rect.top - pan.y) / zoom - 50;

				updateElement(elementDragStart.id, {
					position: { x: Math.max(0, newX), y: Math.max(0, newY) },
				});
				return;
			}

			if (isPanning && dragStart && !isDraggingElement) {
				setPan({
					x: e.clientX - dragStart.x,
					y: e.clientY - dragStart.y,
				});
			}
		},
		[
			isPanning,
			dragStart,
			elementDragStart,
			isDraggingElement,
			pan,
			zoom,
			setPan,
			updateElement,
		],
	);

	const handleCanvasMouseUp = useCallback(() => {
		setIsPanning(false);
		setDragStart(null);
		setElementDragStart(null);
		setIsDraggingElement(false);
		setIsDragging(false);
	}, [setIsDragging]);

	const handleElementClick = useCallback(
		(element: VenueElement, e?: React.MouseEvent) => {
			if (mode === "tier-assignment") {
				assignTierToElement(element.id, selectedTier);
				return;
			}

			// Ensure we're in select mode
			if (activeTool !== "select") return;

			const shiftKey = e?.shiftKey || false;
			const currentSelection = Array.isArray(selectedElements)
				? selectedElements
				: [];

			// Handle multi-selection with shift key (like workflow)
			let elementsToSelect: string[];
			if (shiftKey) {
				// Toggle element in selection
				if (currentSelection.includes(element.id)) {
					elementsToSelect = currentSelection.filter((id) => id !== element.id);
				} else {
					elementsToSelect = [...currentSelection, element.id];
				}
			} else {
				// If clicking on an element that's already selected, keep all selected elements
				// Otherwise, replace selection with just this element
				if (currentSelection.includes(element.id)) {
					// Keep all selected elements - don't change selection
					// This allows dragging all selected elements together
					elementsToSelect = currentSelection;
				} else {
					// Replace selection with just this element
					elementsToSelect = [element.id];
				}
			}
			setSelectedElements(elementsToSelect);
		},
		[
			mode,
			selectedTier,
			assignTierToElement,
			setSelectedElements,
			activeTool,
			selectedElements,
		],
	);

	const handleElementDragStart = useCallback(
		(e: React.MouseEvent, element: VenueElement) => {
			e.preventDefault();
			e.stopPropagation();

			if (mode === "edit" && activeTool === "select") {
				const currentSelection = Array.isArray(selectedElements)
					? selectedElements
					: [];
				const shiftKey = e.shiftKey || false;

				// Handle selection like workflow
				let elementsToSelect: string[];
				if (shiftKey) {
					// Toggle element in selection
					if (currentSelection.includes(element.id)) {
						elementsToSelect = currentSelection.filter(
							(id) => id !== element.id,
						);
					} else {
						elementsToSelect = [...currentSelection, element.id];
					}
				} else {
					// If clicking on an element that's already selected, keep all selected elements
					if (currentSelection.includes(element.id)) {
						elementsToSelect = currentSelection;
					} else {
						elementsToSelect = [element.id];
					}
				}
				setSelectedElements(elementsToSelect);

				// Only start dragging if the element is still in selection
				if (elementsToSelect.includes(element.id)) {
					setIsDraggingElement(true);
					setElementDragStart({
						id: element.id,
						startPos: element.position,
					});
					setIsDragging(true);
				}
			}
		},
		[mode, activeTool, setIsDragging, selectedElements, setSelectedElements],
	);

	const handleCanvasClick = useCallback(
		(e: React.MouseEvent) => {
			// Only create element if clicking on canvas background (not on an element)
			const target = e.target as HTMLElement | SVGElement;
			const isElement = target.closest(".venue-element");
			if (isElement) return;

			if (mode === "edit" && activeTool !== "select" && activeTool !== "pan") {
				const rect = containerRef.current?.getBoundingClientRect();
				if (!rect) return;

				const x = (e.clientX - rect.left - pan.x) / zoom;
				const y = (e.clientY - rect.top - pan.y) / zoom;

				const newElement = createNewElement(activeTool as ElementType, {
					x,
					y,
				});
				if (newElement) {
					addElement(newElement);
					// After creating element, switch back to select tool (like workflow)
					setActiveTool("select");
				}
			}
		},
		[mode, activeTool, pan, zoom, addElement, setActiveTool],
	);

	const createNewElement = (
		type: ElementType,
		position: Position,
	): VenueElement | null => {
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
				};
			case "standing":
				return {
					id: generateId(),
					type: "standing",
					position,
					dimensions: { width: 200, height: 100 },
					capacity: 100,
					label: "Standing Area",
					tier: null,
				};
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
				};
			case "table":
				return {
					id: generateId(),
					type: "table",
					position,
					seats: 6,
					shape: "round",
					label: "T" + Math.floor(Math.random() * 100),
					tier: null,
				};
			default:
				return null;
		}
	};

	const renderElement = (element: VenueElement) => {
		const isSelected = selectedElements.includes(element.id);
		const props = {
			element,
			isSelected,
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				handleElementClick(element, e);
			},
			onDragStart: (e: React.MouseEvent) => handleElementDragStart(e, element),
		};

		switch (element.type) {
			case "seat-row":
				return <SeatRowElement key={element.id} {...props} />;
			case "standing":
				return <StandingAreaElement key={element.id} {...props} />;
			case "box":
				return <BoxElement key={element.id} {...props} />;
			case "table":
				return <TableElement key={element.id} {...props} />;
			default:
				return null;
		}
	};

	const getCursorStyle = () => {
		if (isDraggingElement) return "cursor-grabbing";
		if (isPanning || isPanModeLocked || activeTool === "pan") {
			return isPanning ? "cursor-grabbing" : "cursor-grab";
		}
		return "cursor-default";
	};

	return (
		<div
			ref={containerRef}
			className={cn(
				"relative flex-1 overflow-hidden bg-canvas editor-scrollbar",
				"select-none canvas-grid",
				getCursorStyle(),
				!isPanCalculated && "opacity-0",
			)}
			style={{
				...getCanvasGridStyle(pan, zoom),
				transition: isPanCalculated ? "opacity 0.1s ease-in" : "none",
			}}
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
					pointerEvents: "none",
				}}
			>
				<g style={{ pointerEvents: "all" }}>
					{venue.stage && (
						<g
							transform={`translate(${venue.stage.position.x}, ${venue.stage.position.y})`}
						>
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
				</g>
			</svg>

			{venue.elements.length === 0 && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-center text-muted-foreground">
						<p className="text-lg font-medium">Start building your venue</p>
						<p className="text-sm">
							Select a tool from the toolbar and click to add elements
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
