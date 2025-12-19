"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactNode,
} from "react";
import type {
	EditorMode,
	VenueElement,
	VenueMap,
	TierType,
	Position,
	ElementType,
} from "@/lib/types";
import { createMockVenue, generateId } from "@/lib/mock-data";

interface EditorState {
	venue: VenueMap;
	mode: EditorMode;
	selectedElement: string | null;
	selectedTier: TierType;
	zoom: number;
	pan: Position;
	activeTool: ElementType | "select" | "pan";
	isDragging: boolean;
	showGrid: boolean;
}

interface EditorContextType extends EditorState {
	setMode: (mode: EditorMode) => void;
	setSelectedElement: (id: string | null) => void;
	setSelectedTier: (tier: TierType) => void;
	setZoom: (zoom: number) => void;
	setPan: (pan: Position) => void;
	setActiveTool: (tool: ElementType | "select" | "pan") => void;
	setIsDragging: (isDragging: boolean) => void;
	setShowGrid: (show: boolean) => void;
	updateElement: (id: string, updates: Partial<VenueElement>) => void;
	addElement: (element: VenueElement) => void;
	deleteElement: (id: string) => void;
	duplicateElement: (id: string) => void;
	assignTierToElement: (id: string, tier: TierType) => void;
	updateVenueName: (name: string) => void;
	zoomIn: () => void;
	zoomOut: () => void;
	resetZoom: () => void;
	fitToScreen: () => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<EditorState>({
		venue: createMockVenue(),
		mode: "edit",
		selectedElement: null,
		selectedTier: "standard",
		zoom: 1,
		pan: { x: 0, y: 0 },
		activeTool: "select",
		isDragging: false,
		showGrid: true,
	});

	const setMode = useCallback((mode: EditorMode) => {
		setState((prev) => ({ ...prev, mode, selectedElement: null }));
	}, []);

	const setSelectedElement = useCallback((id: string | null) => {
		setState((prev) => ({ ...prev, selectedElement: id }));
	}, []);

	const setSelectedTier = useCallback((tier: TierType) => {
		setState((prev) => ({ ...prev, selectedTier: tier }));
	}, []);

	const setZoom = useCallback((zoom: number) => {
		setState((prev) => ({ ...prev, zoom: Math.max(0.25, Math.min(3, zoom)) }));
	}, []);

	const setPan = useCallback((pan: Position) => {
		setState((prev) => ({ ...prev, pan }));
	}, []);

	const setActiveTool = useCallback((tool: ElementType | "select" | "pan") => {
		setState((prev) => ({ ...prev, activeTool: tool }));
	}, []);

	const setIsDragging = useCallback((isDragging: boolean) => {
		setState((prev) => ({ ...prev, isDragging }));
	}, []);

	const setShowGrid = useCallback((show: boolean) => {
		setState((prev) => ({ ...prev, showGrid: show }));
	}, []);

	const updateElement = useCallback(
		(id: string, updates: Partial<VenueElement>) => {
			setState((prev) => ({
				...prev,
				venue: {
					...prev.venue,
					elements: prev.venue.elements.map((el) =>
						el.id === id ? ({ ...el, ...updates } as VenueElement) : el,
					),
				},
			}));
		},
		[],
	);

	const addElement = useCallback((element: VenueElement) => {
		setState((prev) => ({
			...prev,
			venue: {
				...prev.venue,
				elements: [...prev.venue.elements, element],
			},
			selectedElement: element.id,
		}));
	}, []);

	const deleteElement = useCallback((id: string) => {
		setState((prev) => ({
			...prev,
			venue: {
				...prev.venue,
				elements: prev.venue.elements.filter((el) => el.id !== id),
			},
			selectedElement:
				prev.selectedElement === id ? null : prev.selectedElement,
		}));
	}, []);

	const duplicateElement = useCallback((id: string) => {
		setState((prev) => {
			const element = prev.venue.elements.find((el) => el.id === id);
			if (!element) return prev;

			const newElement = {
				...element,
				id: generateId(),
				position: {
					x: element.position.x + 40,
					y: element.position.y + 40,
				},
			} as VenueElement;

			return {
				...prev,
				venue: {
					...prev.venue,
					elements: [...prev.venue.elements, newElement],
				},
				selectedElement: newElement.id,
			};
		});
	}, []);

	const assignTierToElement = useCallback((id: string, tier: TierType) => {
		setState((prev) => ({
			...prev,
			venue: {
				...prev.venue,
				elements: prev.venue.elements.map((el) =>
					el.id === id ? ({ ...el, tier } as VenueElement) : el,
				),
			},
		}));
	}, []);

	const updateVenueName = useCallback((name: string) => {
		setState((prev) => ({
			...prev,
			venue: { ...prev.venue, name },
		}));
	}, []);

	const zoomIn = useCallback(() => {
		setState((prev) => ({ ...prev, zoom: Math.min(3, prev.zoom + 0.25) }));
	}, []);

	const zoomOut = useCallback(() => {
		setState((prev) => ({ ...prev, zoom: Math.max(0.25, prev.zoom - 0.25) }));
	}, []);

	const resetZoom = useCallback(() => {
		setState((prev) => ({ ...prev, zoom: 1, pan: { x: 0, y: 0 } }));
	}, []);

	const fitToScreen = useCallback(() => {
		setState((prev) => ({ ...prev, zoom: 0.8, pan: { x: 0, y: 0 } }));
	}, []);

	return (
		<EditorContext.Provider
			value={{
				...state,
				setMode,
				setSelectedElement,
				setSelectedTier,
				setZoom,
				setPan,
				setActiveTool,
				setIsDragging,
				setShowGrid,
				updateElement,
				addElement,
				deleteElement,
				duplicateElement,
				assignTierToElement,
				updateVenueName,
				zoomIn,
				zoomOut,
				resetZoom,
				fitToScreen,
			}}
		>
			{children}
		</EditorContext.Provider>
	);
}

export function useEditor() {
	const context = useContext(EditorContext);
	if (!context) {
		throw new Error("useEditor must be used within EditorProvider");
	}
	return context;
}
