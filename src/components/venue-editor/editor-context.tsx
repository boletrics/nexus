"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	useRef,
	useEffect,
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

const MAX_HISTORY_LENGTH = 50;

type HistorySnapshot = {
	venue: VenueMap;
};

interface EditorState {
	venue: VenueMap;
	mode: EditorMode;
	selectedElements: string[]; // Changed to array for multi-selection
	selectedTier: TierType;
	zoom: number;
	pan: Position;
	activeTool: ElementType | "select" | "pan";
	isDragging: boolean;
	showGrid: boolean;
	version: string;
	isPanModeLocked: boolean;
}

interface EditorContextType extends EditorState {
	setMode: (mode: EditorMode) => void;
	setSelectedElements: (ids: string[]) => void;
	setSelectedTier: (tier: TierType) => void;
	setZoom: (zoom: number) => void;
	setPan: (pan: Position) => void;
	setActiveTool: (tool: ElementType | "select" | "pan") => void;
	setIsDragging: (isDragging: boolean) => void;
	setShowGrid: (show: boolean) => void;
	setIsPanModeLocked: (locked: boolean) => void;
	isPanCalculated: boolean;
	updateElement: (id: string, updates: Partial<VenueElement>) => void;
	addElement: (element: VenueElement) => void;
	deleteElement: (id: string) => void;
	duplicateElement: (id: string) => void;
	assignTierToElement: (id: string, tier: TierType) => void;
	updateVenueName: (name: string) => void;
	updateVersion: (version: string) => void;
	zoomIn: () => void;
	zoomOut: () => void;
	resetZoom: () => void;
	fitToScreen: () => void;
	// History
	undo: () => void;
	redo: () => void;
	canUndo: boolean;
	canRedo: boolean;
	commitHistory: () => void;
	// Clipboard
	copySelection: () => void;
	pasteSelection: () => void;
	hasCopiedData: boolean;
	// Reset
	resetVenue: () => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

function cloneDeep<T>(value: T): T {
	if (typeof structuredClone === "function") {
		return structuredClone(value);
	}
	return JSON.parse(JSON.stringify(value));
}

export function EditorProvider({ children }: { children: ReactNode }) {
	const initialVenue = createMockVenue();

	const createEmptyVenueState = (): EditorState => {
		const emptyVenue = createMockVenue();
		emptyVenue.elements = [];
		return {
			venue: emptyVenue,
			mode: "edit",
			selectedElements: [],
			selectedTier: "standard",
			zoom: 0.8,
			pan: { x: 0, y: 0 },
			activeTool: "select",
			isDragging: false,
			showGrid: true,
			version: "1.0.0",
			isPanModeLocked: false,
		};
	};

	const [state, setState] = useState<EditorState>({
		venue: initialVenue,
		mode: "edit",
		selectedElements: [],
		selectedTier: "standard",
		zoom: 0.8,
		pan: { x: 0, y: 0 }, // Will be calculated immediately on client
		activeTool: "select",
		isDragging: false,
		showGrid: true,
		version: "1.0.0",
		isPanModeLocked: false,
	});

	// Calculate initial pan immediately on client mount to prevent flash
	// Use requestAnimationFrame to ensure it runs before first paint
	useEffect(() => {
		if (typeof window === "undefined") return;

		const stage = state.venue.stage;
		if (!stage) return;

		// Calculate immediately using requestAnimationFrame for earliest possible execution
		const calculateInitialPan = () => {
			const viewportWidth = window.innerWidth;
			const toolbarCenterX = viewportWidth / 2;
			const headerHeight = 80; // Default header height
			const marginFromTop = 30;
			const targetStageTopY = headerHeight + marginFromTop;
			const zoom = 0.8;

			const stageCenterX = stage.position.x + stage.dimensions.width / 2;
			const stageTopY = stage.position.y;

			const initialPan = {
				x: toolbarCenterX - stageCenterX * zoom,
				y: targetStageTopY - stageTopY * zoom,
			};

			// Only set if pan is still at origin (hasn't been calculated yet)
			setState((prev) => {
				if (prev.pan.x === 0 && prev.pan.y === 0) {
					setIsPanCalculated(true); // Mark as calculated immediately
					return { ...prev, pan: initialPan };
				}
				return prev;
			});
		};

		// Execute immediately, synchronously if possible
		if (typeof window !== "undefined") {
			// Try to calculate synchronously first
			calculateInitialPan();
			// Then refine with requestAnimationFrame
			requestAnimationFrame(calculateInitialPan);
		}
	}, []); // Run only once on mount

	const [isInitialized, setIsInitialized] = useState(false);
	const [isPanCalculated, setIsPanCalculated] = useState(false);

	// Calculate initial pan to center the stage (only on client)
	useEffect(() => {
		const stage = state.venue.stage;
		if (!stage) {
			if (!isInitialized) setIsInitialized(true);
			setIsPanCalculated(true); // No stage, so we're done
			return;
		}

		// Only calculate if not initialized OR if we need to recalculate
		// This allows recalculation when venue changes
		if (isInitialized && state.pan.x !== 0 && state.pan.y !== 0) {
			// Already initialized and pan is set, skip
			setIsPanCalculated(true);
			return;
		}

		// Get actual viewport dimensions
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Get actual header height and center position by measuring the header element
		// Use requestAnimationFrame to ensure DOM is ready
		const calculatePan = () => {
			// Find header element - try multiple selectors
			const headerElement =
				(document.querySelector('[class*="border-b"]') as HTMLElement) ||
				(document.querySelector("header") as HTMLElement) ||
				(document
					.querySelector("[data-toolbar-center]")
					?.closest('[class*="border"]') as HTMLElement);

			if (!headerElement) {
				// Header not found, skip calculation
				return;
			}

			const headerHeight = headerElement.offsetHeight || 80;
			const headerRect = headerElement.getBoundingClientRect();

			// Use the center of the viewport as the toolbar center
			// The tabs are visually centered in the viewport using flexbox,
			// so the viewport center is the most accurate reference point
			const toolbarCenterX = viewportWidth / 2;

			// Calculate stage center in venue coordinates
			// Main Stage is now properly centered in the venue (x: 400 for width 1200 venue, stage width 400)
			const stageCenterX = stage.position.x + stage.dimensions.width / 2;
			const stageTopY = stage.position.y; // Top of stage

			// Center Main Stage horizontally and vertically with the toolbar/header
			const zoom = 0.8;
			const marginFromTop = 30; // Margin below header for better visual spacing
			const targetStageTopY = headerHeight + marginFromTop; // Position just below header (in screen coordinates)

			// Calculate pan to position Main Stage correctly
			// The SVG transform is: translate(pan.x, pan.y) scale(zoom)
			// So a point at venue coordinates (x, y) appears at screen coordinates:
			// screenX = x * zoom + pan.x
			// screenY = y * zoom + pan.y
			//
			// We want stage center (stageCenterX) to appear at toolbarCenterX (screen coordinates)
			// So: toolbarCenterX = stageCenterX * zoom + pan.x
			// Therefore: pan.x = toolbarCenterX - stageCenterX * zoom
			//
			// Similarly for Y: targetStageTopY = stageTopY * zoom + pan.y
			// Therefore: pan.y = targetStageTopY - stageTopY * zoom

			const initialPan = {
				x: toolbarCenterX - stageCenterX * zoom,
				y: targetStageTopY - stageTopY * zoom,
			};

			setState((prev) => ({ ...prev, pan: initialPan }));
			setIsInitialized(true);
		};

		// Try to get header height and center, with fallback
		// Use setTimeout to ensure DOM is fully rendered and layout is stable
		if (typeof window !== "undefined") {
			// Use a longer delay to ensure all elements are rendered and positioned
			// Also check multiple times to catch any layout shifts
			const timeoutId = setTimeout(() => {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						calculatePan();
						// Recalculate after a short delay to catch any late layout changes
						setTimeout(() => {
							calculatePan();
						}, 200);
					});
				});
			}, 200);

			return () => clearTimeout(timeoutId);
		} else {
			calculatePan();
		}
	}, [isInitialized, state.venue.stage, state.pan.x, state.pan.y]);

	// History state
	const [history, setHistory] = useState<HistorySnapshot[]>(() => [
		{ venue: cloneDeep(state.venue) },
	]);
	const [historyIndex, setHistoryIndex] = useState(0);

	// Clipboard state
	const clipboardRef = useRef<VenueElement[] | null>(null);
	const [hasCopiedData, setHasCopiedData] = useState(false);

	const createHistorySnapshot = useCallback(
		(venue: VenueMap): HistorySnapshot => ({
			venue: cloneDeep(venue),
		}),
		[],
	);

	const pushHistoryState = useCallback(
		(venue: VenueMap) => {
			setHistory((prevHistory) => {
				const baseHistory =
					historyIndex >= 0 && prevHistory.length > 0
						? prevHistory.slice(0, historyIndex + 1)
						: prevHistory.length > 0
							? [prevHistory[prevHistory.length - 1]]
							: [];

				const nextHistory = [...baseHistory, createHistorySnapshot(venue)];
				const trimmedHistory =
					nextHistory.length > MAX_HISTORY_LENGTH
						? nextHistory.slice(nextHistory.length - MAX_HISTORY_LENGTH)
						: nextHistory;

				setHistoryIndex(trimmedHistory.length - 1);
				return trimmedHistory;
			});
		},
		[historyIndex, createHistorySnapshot],
	);

	const canUndo = historyIndex > 0;
	const canRedo = historyIndex < history.length - 1;

	const undo = useCallback(() => {
		if (!canUndo) return;

		setHistoryIndex((prevIndex) => {
			const nextIndex = prevIndex - 1;
			const snapshot = history[nextIndex];
			if (snapshot) {
				setState((prev) => ({
					...prev,
					venue: cloneDeep(snapshot.venue),
					selectedElements: [],
				}));
			}
			return nextIndex;
		});
	}, [canUndo, history]);

	const redo = useCallback(() => {
		if (!canRedo) return;

		setHistoryIndex((prevIndex) => {
			const nextIndex = prevIndex + 1;
			const snapshot = history[nextIndex];
			if (snapshot) {
				setState((prev) => ({
					...prev,
					venue: cloneDeep(snapshot.venue),
					selectedElements: [],
				}));
			}
			return nextIndex;
		});
	}, [canRedo, history]);

	const commitHistory = useCallback(() => {
		pushHistoryState(state.venue);
	}, [state.venue, pushHistoryState]);

	const copySelection = useCallback(() => {
		if (state.selectedElements.length === 0) return;

		const elements = state.venue.elements.filter((el) =>
			state.selectedElements.includes(el.id),
		);
		if (elements.length > 0) {
			clipboardRef.current = elements.map(cloneDeep);
			setHasCopiedData(true);
		}
	}, [state.selectedElements, state.venue.elements]);

	const pasteSelection = useCallback(() => {
		if (!clipboardRef.current || clipboardRef.current.length === 0) return;

		setState((prev) => {
			const newElements = clipboardRef.current!.map((el) => ({
				...el,
				id: generateId(),
				position: {
					x: el.position.x + 40,
					y: el.position.y + 40,
				},
			}));

			const newVenue = {
				...prev.venue,
				elements: [...prev.venue.elements, ...newElements],
			};

			pushHistoryState(newVenue);

			return {
				...prev,
				venue: newVenue,
				selectedElements: newElements.map((el) => el.id),
			};
		});
	}, [pushHistoryState]);

	const setMode = useCallback((mode: EditorMode) => {
		setState((prev) => ({ ...prev, mode, selectedElements: [] }));
	}, []);

	const setSelectedElements = useCallback(
		(ids: string[] | ((prev: string[]) => string[])) => {
			setState((prev) => {
				const currentIds = Array.isArray(prev.selectedElements)
					? prev.selectedElements
					: [];
				const newIds = typeof ids === "function" ? ids(currentIds) : ids;
				return {
					...prev,
					selectedElements: Array.isArray(newIds) ? newIds : [],
				};
			});
		},
		[],
	);

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
			setState((prev) => {
				const newVenue = {
					...prev.venue,
					elements: prev.venue.elements.map((el) =>
						el.id === id ? ({ ...el, ...updates } as VenueElement) : el,
					),
				};
				pushHistoryState(newVenue);
				return {
					...prev,
					venue: newVenue,
				};
			});
		},
		[pushHistoryState],
	);

	const addElement = useCallback(
		(element: VenueElement) => {
			setState((prev) => {
				const newVenue = {
					...prev.venue,
					elements: [...prev.venue.elements, element],
				};
				pushHistoryState(newVenue);
				return {
					...prev,
					venue: newVenue,
					selectedElements: [element.id],
				};
			});
		},
		[pushHistoryState],
	);

	const deleteElement = useCallback(
		(id: string) => {
			setState((prev) => {
				const newVenue = {
					...prev.venue,
					elements: prev.venue.elements.filter((el) => el.id !== id),
				};
				pushHistoryState(newVenue);
				return {
					...prev,
					venue: newVenue,
					selectedElements: prev.selectedElements.filter((elId) => elId !== id),
				};
			});
		},
		[pushHistoryState],
	);

	const duplicateElement = useCallback(
		(id: string) => {
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

				const newVenue = {
					...prev.venue,
					elements: [...prev.venue.elements, newElement],
				};

				pushHistoryState(newVenue);

				return {
					...prev,
					venue: newVenue,
					selectedElements: [newElement.id],
				};
			});
		},
		[pushHistoryState],
	);

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

	const updateVersion = useCallback((version: string) => {
		setState((prev) => ({ ...prev, version }));
	}, []);

	const setIsPanModeLocked = useCallback((locked: boolean) => {
		setState((prev) => ({ ...prev, isPanModeLocked: locked }));
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

	// Reset function - reset to initial state
	const resetVenue = useCallback(() => {
		const resetState: EditorState = {
			venue: cloneDeep(initialVenue),
			mode: "edit",
			selectedElements: [],
			selectedTier: "standard",
			zoom: 0.8,
			pan: { x: 0, y: 0 },
			activeTool: "select",
			isDragging: false,
			showGrid: true,
			version: "1.0.0",
			isPanModeLocked: false,
		};
		setState(resetState);
		setHistory([{ venue: cloneDeep(resetState.venue) }]);
		setHistoryIndex(0);
		setHasCopiedData(false);
		clipboardRef.current = null;
		// Recalculate centering after reset
		setIsInitialized(false);
	}, [initialVenue]);

	return (
		<EditorContext.Provider
			value={{
				...state,
				setMode,
				setSelectedElements,
				setSelectedTier,
				setZoom,
				setPan,
				setActiveTool,
				setIsDragging,
				setShowGrid,
				setIsPanModeLocked,
				updateElement,
				addElement,
				deleteElement,
				duplicateElement,
				assignTierToElement,
				updateVenueName,
				updateVersion,
				zoomIn,
				zoomOut,
				resetZoom,
				fitToScreen,
				undo,
				redo,
				canUndo,
				canRedo,
				commitHistory,
				copySelection,
				pasteSelection,
				hasCopiedData,
				resetVenue,
				isPanCalculated,
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
