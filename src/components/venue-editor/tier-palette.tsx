"use client";

import { useEditor } from "./editor-context";
import { TIERS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";

export function TierPalette() {
	const { mode, selectedTier, setSelectedTier } = useEditor();

	if (mode !== "tier-assignment") return null;

	return (
		<div className="absolute left-4 top-4 z-10 flex flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-lg">
			<div className="mb-1 text-xs font-medium text-muted-foreground">
				Price Tiers
			</div>
			{TIERS.map((tier) => (
				<button
					key={tier.id}
					onClick={() => setSelectedTier(tier.id)}
					className={cn(
						"flex items-center gap-3 rounded-md px-3 py-2 text-left transition-all",
						"hover:bg-muted",
						selectedTier === tier.id &&
							"bg-muted ring-2 ring-primary ring-offset-1 ring-offset-background",
					)}
				>
					<div
						className={cn(
							"h-4 w-4 rounded-full",
							tier.id === "vip" && "bg-tier-vip",
							tier.id === "premium" && "bg-tier-premium",
							tier.id === "standard" && "bg-tier-standard",
							tier.id === "economy" && "bg-tier-economy",
						)}
					/>
					<div className="flex flex-col">
						<span className="text-sm font-medium">{tier.name}</span>
						<span className="flex items-center text-xs text-muted-foreground">
							<DollarSign className="mr-0.5 h-3 w-3" />
							{tier.price}
						</span>
					</div>
				</button>
			))}
			<div className="mt-2 border-t border-border pt-2">
				<p className="text-xs text-muted-foreground">
					Click on elements to assign the selected tier
				</p>
			</div>
		</div>
	);
}
