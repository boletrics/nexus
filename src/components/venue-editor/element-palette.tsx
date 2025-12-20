"use client";

import { useEditor } from "./editor-context";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Armchair, Users, Square, Circle, Grid3X3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ElementType } from "@/lib/types";

const ELEMENT_TYPES: {
	id: ElementType;
	icon: React.ReactNode;
	label: string;
	shortcut?: string;
}[] = [
	{
		id: "seat-row",
		icon: <Armchair className="h-4 w-4" />,
		label: "Fila de Asientos",
		shortcut: "S",
	},
	{
		id: "standing",
		icon: <Users className="h-4 w-4" />,
		label: "Área de Pie",
		shortcut: "A",
	},
	{
		id: "box",
		icon: <Square className="h-4 w-4" />,
		label: "Box",
		shortcut: "B",
	},
	{
		id: "table",
		icon: <Circle className="h-4 w-4" />,
		label: "Mesa",
		shortcut: "T",
	},
];

export function ElementPalette() {
	const {
		activeTool,
		setActiveTool,
		mode,
		showGrid,
		setShowGrid,
		selectedElements,
		deleteElement,
	} = useEditor();

	if (mode !== "edit") return null;

	return (
		<TooltipProvider delayDuration={300}>
			<div className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-border/50 bg-card/95 px-3 py-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/90">
				{ELEMENT_TYPES.map((element) => {
					const isActive = activeTool === element.id;
					return (
						<Tooltip key={element.id}>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className={cn(
										"h-8 transition-colors",
										isActive &&
											"border border-primary/30 bg-primary/10 text-primary shadow-inner ring-1 ring-primary/30",
									)}
									onClick={() => setActiveTool(element.id)}
									title={element.label}
									aria-label={element.label}
									aria-pressed={isActive}
									data-state={isActive ? "active" : "inactive"}
								>
									{element.icon}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom" className="flex items-center gap-2">
								{element.label}
								{element.shortcut && (
									<kbd className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
										{element.shortcut}
									</kbd>
								)}
							</TooltipContent>
						</Tooltip>
					);
				})}

				<div className="mx-1 h-6 w-px bg-border" />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant={showGrid ? "secondary" : "ghost"}
							size="sm"
							className="h-8"
							onClick={() => setShowGrid(!showGrid)}
							title={showGrid ? "Ocultar Grid" : "Mostrar Grid"}
						>
							<Grid3X3 className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						{showGrid ? "Ocultar Grid" : "Mostrar Grid"}
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	);
}
