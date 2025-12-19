"use client";

import type React from "react";

import { useEditor } from "./editor-context";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TIERS } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
	Menu,
	MousePointer2,
	Hand,
	Armchair,
	Users,
	Square,
	Circle,
	Grid3X3,
	DollarSign,
} from "lucide-react";

export function MobileToolbar() {
	const {
		mode,
		activeTool,
		setActiveTool,
		showGrid,
		setShowGrid,
		selectedTier,
		setSelectedTier,
	} = useEditor();

	return (
		<div className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 lg:hidden">
			<Sheet>
				<SheetTrigger asChild>
					<Button size="lg" className="gap-2 rounded-full px-6 shadow-lg">
						<Menu className="h-5 w-5" />
						Tools
					</Button>
				</SheetTrigger>
				<SheetContent side="bottom" className="h-[50vh]">
					<SheetHeader>
						<SheetTitle>
							{mode === "edit" ? "Edit Tools" : "Tier Assignment"}
						</SheetTitle>
					</SheetHeader>
					<ScrollArea className="mt-4 h-full pb-8">
						{mode === "edit" ? (
							<div className="space-y-4">
								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										Selection
									</p>
									<div className="grid grid-cols-2 gap-2">
										<ToolButton
											active={activeTool === "select"}
											onClick={() => setActiveTool("select")}
											icon={<MousePointer2 className="h-5 w-5" />}
											label="Select"
										/>
										<ToolButton
											active={activeTool === "pan"}
											onClick={() => setActiveTool("pan")}
											icon={<Hand className="h-5 w-5" />}
											label="Pan"
										/>
									</div>
								</div>

								<Separator />

								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										Add Elements
									</p>
									<div className="grid grid-cols-2 gap-2">
										<ToolButton
											active={activeTool === "seat-row"}
											onClick={() => setActiveTool("seat-row")}
											icon={<Armchair className="h-5 w-5" />}
											label="Seat Row"
										/>
										<ToolButton
											active={activeTool === "standing"}
											onClick={() => setActiveTool("standing")}
											icon={<Users className="h-5 w-5" />}
											label="Standing"
										/>
										<ToolButton
											active={activeTool === "box"}
											onClick={() => setActiveTool("box")}
											icon={<Square className="h-5 w-5" />}
											label="Box"
										/>
										<ToolButton
											active={activeTool === "table"}
											onClick={() => setActiveTool("table")}
											icon={<Circle className="h-5 w-5" />}
											label="Table"
										/>
									</div>
								</div>

								<Separator />

								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										View
									</p>
									<ToolButton
										active={showGrid}
										onClick={() => setShowGrid(!showGrid)}
										icon={<Grid3X3 className="h-5 w-5" />}
										label={showGrid ? "Hide Grid" : "Show Grid"}
										fullWidth
									/>
								</div>
							</div>
						) : (
							<div className="space-y-4">
								<p className="text-sm text-muted-foreground">
									Select a tier and tap on elements to assign pricing
								</p>
								<div className="grid grid-cols-2 gap-3">
									{TIERS.map((tier) => (
										<button
											key={tier.id}
											onClick={() => setSelectedTier(tier.id)}
											className={cn(
												"flex flex-col items-center gap-2 rounded-lg border p-4 transition-all",
												selectedTier === tier.id
													? "border-primary bg-primary/10"
													: "border-border hover:bg-muted",
											)}
										>
											<div
												className={cn(
													"h-8 w-8 rounded-full",
													tier.id === "vip" && "bg-tier-vip",
													tier.id === "premium" && "bg-tier-premium",
													tier.id === "standard" && "bg-tier-standard",
													tier.id === "economy" && "bg-tier-economy",
												)}
											/>
											<span className="font-medium">{tier.name}</span>
											<span className="flex items-center text-sm text-muted-foreground">
												<DollarSign className="mr-0.5 h-3 w-3" />
												{tier.price}
											</span>
										</button>
									))}
								</div>
							</div>
						)}
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</div>
	);
}

function ToolButton({
	active,
	onClick,
	icon,
	label,
	fullWidth,
}: {
	active: boolean;
	onClick: () => void;
	icon: React.ReactNode;
	label: string;
	fullWidth?: boolean;
}) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"flex items-center gap-3 rounded-lg border p-3 transition-all",
				fullWidth && "col-span-2",
				active
					? "border-primary bg-primary/10 text-primary"
					: "border-border hover:bg-muted",
			)}
		>
			{icon}
			<span className="text-sm font-medium">{label}</span>
		</button>
	);
}
