"use client";

import type React from "react";

import { useEditor } from "./editor-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	MousePointer2,
	Hand,
	Armchair,
	Users,
	Square,
	Circle,
	Grid3X3,
	Trash2,
	Copy,
} from "lucide-react";
import type { ElementType } from "@/lib/types";
import { cn } from "@/lib/utils";

const editTools: {
	id: ElementType | "select" | "pan";
	icon: React.ReactNode;
	label: string;
	shortcut?: string;
}[] = [
	{
		id: "select",
		icon: <MousePointer2 className="h-4 w-4" />,
		label: "Select",
		shortcut: "V",
	},
	{
		id: "pan",
		icon: <Hand className="h-4 w-4" />,
		label: "Pan",
		shortcut: "H",
	},
	{
		id: "seat-row",
		icon: <Armchair className="h-4 w-4" />,
		label: "Add Seat Row",
		shortcut: "S",
	},
	{
		id: "standing",
		icon: <Users className="h-4 w-4" />,
		label: "Add Standing Area",
		shortcut: "A",
	},
	{
		id: "box",
		icon: <Square className="h-4 w-4" />,
		label: "Add Box",
		shortcut: "B",
	},
	{
		id: "table",
		icon: <Circle className="h-4 w-4" />,
		label: "Add Table",
		shortcut: "T",
	},
];

export function EditorToolbar() {
	const {
		mode,
		activeTool,
		setActiveTool,
		showGrid,
		setShowGrid,
		selectedElement,
		deleteElement,
		duplicateElement,
	} = useEditor();

	if (mode !== "edit") return null;

	return (
		<TooltipProvider delayDuration={300}>
			<div className="absolute left-4 top-4 z-10 flex flex-col gap-1 rounded-lg border border-border bg-card p-1.5 shadow-lg">
				{editTools.map((tool, index) => (
					<div key={tool.id}>
						{index === 2 && <Separator className="my-1" />}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant={activeTool === tool.id ? "default" : "ghost"}
									size="icon"
									className={cn(
										"h-9 w-9",
										activeTool === tool.id &&
											"bg-primary text-primary-foreground",
									)}
									onClick={() => setActiveTool(tool.id)}
								>
									{tool.icon}
									<span className="sr-only">{tool.label}</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right" className="flex items-center gap-2">
								{tool.label}
								{tool.shortcut && (
									<kbd className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
										{tool.shortcut}
									</kbd>
								)}
							</TooltipContent>
						</Tooltip>
					</div>
				))}

				<Separator className="my-1" />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant={showGrid ? "secondary" : "ghost"}
							size="icon"
							className="h-9 w-9"
							onClick={() => setShowGrid(!showGrid)}
						>
							<Grid3X3 className="h-4 w-4" />
							<span className="sr-only">Toggle Grid</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right">
						{showGrid ? "Hide Grid" : "Show Grid"}
					</TooltipContent>
				</Tooltip>

				{selectedElement && (
					<>
						<Separator className="my-1" />
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-9 w-9"
									onClick={() => duplicateElement(selectedElement)}
								>
									<Copy className="h-4 w-4" />
									<span className="sr-only">Duplicate</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">Duplicate Element</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
									onClick={() => deleteElement(selectedElement)}
								>
									<Trash2 className="h-4 w-4" />
									<span className="sr-only">Delete</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">Delete Element</TooltipContent>
						</Tooltip>
					</>
				)}
			</div>
		</TooltipProvider>
	);
}
