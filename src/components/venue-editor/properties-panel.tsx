"use client";

import { useEditor } from "./editor-context";
import type {
	SeatRow,
	StandingArea,
	Box,
	Table,
	VenueElement,
} from "@/lib/types";
import { TIERS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Armchair,
	Users,
	Square,
	Circle,
	X,
	Copy,
	Trash2,
	ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PropertiesPanel() {
	const {
		venue,
		selectedElement,
		setSelectedElement,
		updateElement,
		deleteElement,
		duplicateElement,
	} = useEditor();

	const element = venue.elements.find((el) => el.id === selectedElement);

	if (!element) {
		return null;
	}

	const getElementIcon = () => {
		switch (element.type) {
			case "seat-row":
				return <Armchair className="h-4 w-4" />;
			case "standing":
				return <Users className="h-4 w-4" />;
			case "box":
				return <Square className="h-4 w-4" />;
			case "table":
				return <Circle className="h-4 w-4" />;
		}
	};

	const getElementTypeName = () => {
		switch (element.type) {
			case "seat-row":
				return "Seat Row";
			case "standing":
				return "Standing Area";
			case "box":
				return "Box";
			case "table":
				return "Table";
		}
	};

	return (
		<div className="hidden w-72 flex-col border-l border-border bg-card lg:flex">
			{/* Header */}
			<div className="flex h-12 items-center justify-between border-b border-border px-4">
				<div className="flex items-center gap-2">
					{getElementIcon()}
					<span className="text-sm font-medium">{getElementTypeName()}</span>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="h-7 w-7"
					onClick={() => setSelectedElement(null)}
				>
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</Button>
			</div>

			{/* Content */}
			<ScrollArea className="flex-1">
				<div className="space-y-6 p-4">
					{/* Position */}
					<div className="space-y-3">
						<Label className="text-xs font-medium text-muted-foreground">
							Position
						</Label>
						<div className="grid grid-cols-2 gap-2">
							<div>
								<Label htmlFor="pos-x" className="text-xs">
									X
								</Label>
								<Input
									id="pos-x"
									type="number"
									value={Math.round(element.position.x)}
									onChange={(e) =>
										updateElement(element.id, {
											position: {
												...element.position,
												x: Number.parseInt(e.target.value) || 0,
											},
										})
									}
									className="h-8"
								/>
							</div>
							<div>
								<Label htmlFor="pos-y" className="text-xs">
									Y
								</Label>
								<Input
									id="pos-y"
									type="number"
									value={Math.round(element.position.y)}
									onChange={(e) =>
										updateElement(element.id, {
											position: {
												...element.position,
												y: Number.parseInt(e.target.value) || 0,
											},
										})
									}
									className="h-8"
								/>
							</div>
						</div>
					</div>

					<Separator />

					{/* Element-specific properties */}
					{element.type === "seat-row" && (
						<SeatRowProperties
							element={element}
							updateElement={updateElement}
						/>
					)}
					{element.type === "standing" && (
						<StandingAreaProperties
							element={element}
							updateElement={updateElement}
						/>
					)}
					{element.type === "box" && (
						<BoxProperties element={element} updateElement={updateElement} />
					)}
					{element.type === "table" && (
						<TableProperties element={element} updateElement={updateElement} />
					)}

					<Separator />

					{/* Tier assignment */}
					<div className="space-y-3">
						<Label className="text-xs font-medium text-muted-foreground">
							Price Tier
						</Label>
						<Select
							value={element.tier || "none"}
							onValueChange={(value) =>
								updateElement(element.id, {
									tier:
										value === "none" ? null : (value as typeof element.tier),
								})
							}
						>
							<SelectTrigger className="h-8">
								<SelectValue placeholder="Select tier" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">No tier</SelectItem>
								{TIERS.map((tier) => (
									<SelectItem key={tier.id} value={tier.id!}>
										<div className="flex items-center gap-2">
											<div
												className={cn(
													"h-3 w-3 rounded-full",
													tier.id === "vip" && "bg-tier-vip",
													tier.id === "premium" && "bg-tier-premium",
													tier.id === "standard" && "bg-tier-standard",
													tier.id === "economy" && "bg-tier-economy",
												)}
											/>
											{tier.name} - ${tier.price}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</ScrollArea>

			{/* Actions */}
			<div className="border-t border-border p-3">
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						className="flex-1 bg-transparent"
						onClick={() => duplicateElement(element.id)}
					>
						<Copy className="mr-2 h-3.5 w-3.5" />
						Duplicate
					</Button>
					<Button
						variant="destructive"
						size="sm"
						className="flex-1"
						onClick={() => deleteElement(element.id)}
					>
						<Trash2 className="mr-2 h-3.5 w-3.5" />
						Delete
					</Button>
				</div>
			</div>
		</div>
	);
}

function SeatRowProperties({
	element,
	updateElement,
}: {
	element: SeatRow;
	updateElement: (id: string, updates: Partial<VenueElement>) => void;
}) {
	return (
		<div className="space-y-4">
			<div className="space-y-3">
				<Label className="text-xs font-medium text-muted-foreground">
					Row Settings
				</Label>

				<div className="space-y-2">
					<Label htmlFor="row-label" className="text-xs">
						Row Label
					</Label>
					<Input
						id="row-label"
						value={element.rowLabel}
						onChange={(e) =>
							updateElement(element.id, { rowLabel: e.target.value })
						}
						className="h-8"
						maxLength={3}
					/>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label htmlFor="seats" className="text-xs">
							Seats
						</Label>
						<span className="text-xs text-muted-foreground">
							{element.seats}
						</span>
					</div>
					<Slider
						id="seats"
						value={[element.seats]}
						min={1}
						max={50}
						step={1}
						onValueChange={([value]) =>
							updateElement(element.id, { seats: value })
						}
					/>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label htmlFor="spacing" className="text-xs">
							Seat Spacing
						</Label>
						<span className="text-xs text-muted-foreground">
							{element.spacing}px
						</span>
					</div>
					<Slider
						id="spacing"
						value={[element.spacing]}
						min={24}
						max={48}
						step={2}
						onValueChange={([value]) =>
							updateElement(element.id, { spacing: value })
						}
					/>
				</div>
			</div>

			<div className="space-y-3">
				<Label className="text-xs font-medium text-muted-foreground">
					Curved Row
				</Label>

				<div className="flex items-center justify-between">
					<Label htmlFor="curved" className="text-xs">
						Enable Curve
					</Label>
					<Switch
						id="curved"
						checked={element.curved}
						onCheckedChange={(checked) =>
							updateElement(element.id, { curved: checked })
						}
					/>
				</div>

				{element.curved && (
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="curve-angle" className="text-xs">
								Curve Angle
							</Label>
							<span className="text-xs text-muted-foreground">
								{element.curveAngle}°
							</span>
						</div>
						<Slider
							id="curve-angle"
							value={[element.curveAngle]}
							min={0}
							max={30}
							step={1}
							onValueChange={([value]) =>
								updateElement(element.id, { curveAngle: value })
							}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

function StandingAreaProperties({
	element,
	updateElement,
}: {
	element: StandingArea;
	updateElement: (id: string, updates: Partial<VenueElement>) => void;
}) {
	return (
		<div className="space-y-4">
			<div className="space-y-3">
				<Label className="text-xs font-medium text-muted-foreground">
					Area Settings
				</Label>

				<div className="space-y-2">
					<Label htmlFor="label" className="text-xs">
						Label
					</Label>
					<Input
						id="label"
						value={element.label}
						onChange={(e) =>
							updateElement(element.id, { label: e.target.value })
						}
						className="h-8"
					/>
				</div>

				<div className="grid grid-cols-2 gap-2">
					<div className="space-y-1">
						<Label htmlFor="width" className="text-xs">
							Width
						</Label>
						<Input
							id="width"
							type="number"
							value={element.dimensions.width}
							onChange={(e) =>
								updateElement(element.id, {
									dimensions: {
										...element.dimensions,
										width: Number.parseInt(e.target.value) || 100,
									},
								})
							}
							className="h-8"
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="height" className="text-xs">
							Height
						</Label>
						<Input
							id="height"
							type="number"
							value={element.dimensions.height}
							onChange={(e) =>
								updateElement(element.id, {
									dimensions: {
										...element.dimensions,
										height: Number.parseInt(e.target.value) || 100,
									},
								})
							}
							className="h-8"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="capacity" className="text-xs">
						Capacity
					</Label>
					<Input
						id="capacity"
						type="number"
						value={element.capacity}
						onChange={(e) =>
							updateElement(element.id, {
								capacity: Number.parseInt(e.target.value) || 0,
							})
						}
						className="h-8"
					/>
				</div>
			</div>
		</div>
	);
}

function BoxProperties({
	element,
	updateElement,
}: {
	element: Box;
	updateElement: (id: string, updates: Partial<VenueElement>) => void;
}) {
	return (
		<div className="space-y-4">
			<div className="space-y-3">
				<Label className="text-xs font-medium text-muted-foreground">
					Box Settings
				</Label>

				<div className="space-y-2">
					<Label htmlFor="label" className="text-xs">
						Label
					</Label>
					<Input
						id="label"
						value={element.label}
						onChange={(e) =>
							updateElement(element.id, { label: e.target.value })
						}
						className="h-8"
					/>
				</div>

				<div className="grid grid-cols-2 gap-2">
					<div className="space-y-1">
						<Label htmlFor="width" className="text-xs">
							Width
						</Label>
						<Input
							id="width"
							type="number"
							value={element.dimensions.width}
							onChange={(e) =>
								updateElement(element.id, {
									dimensions: {
										...element.dimensions,
										width: Number.parseInt(e.target.value) || 100,
									},
								})
							}
							className="h-8"
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="height" className="text-xs">
							Height
						</Label>
						<Input
							id="height"
							type="number"
							value={element.dimensions.height}
							onChange={(e) =>
								updateElement(element.id, {
									dimensions: {
										...element.dimensions,
										height: Number.parseInt(e.target.value) || 100,
									},
								})
							}
							className="h-8"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="capacity" className="text-xs">
						Seating Capacity
					</Label>
					<Input
						id="capacity"
						type="number"
						value={element.capacity}
						onChange={(e) =>
							updateElement(element.id, {
								capacity: Number.parseInt(e.target.value) || 0,
							})
						}
						className="h-8"
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-xs">Amenities</Label>
					<div className="flex flex-wrap gap-1">
						{["Private Bar", "Catering", "VIP Entrance", "TV Screen"].map(
							(amenity) => (
								<Button
									key={amenity}
									variant={
										element.amenities.includes(amenity) ? "default" : "outline"
									}
									size="sm"
									className="h-6 px-2 text-xs"
									onClick={() => {
										const newAmenities = element.amenities.includes(amenity)
											? element.amenities.filter((a) => a !== amenity)
											: [...element.amenities, amenity];
										updateElement(element.id, { amenities: newAmenities });
									}}
								>
									{amenity}
								</Button>
							),
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function TableProperties({
	element,
	updateElement,
}: {
	element: Table;
	updateElement: (id: string, updates: Partial<VenueElement>) => void;
}) {
	return (
		<div className="space-y-4">
			<div className="space-y-3">
				<Label className="text-xs font-medium text-muted-foreground">
					Table Settings
				</Label>

				<div className="space-y-2">
					<Label htmlFor="label" className="text-xs">
						Label
					</Label>
					<Input
						id="label"
						value={element.label}
						onChange={(e) =>
							updateElement(element.id, { label: e.target.value })
						}
						className="h-8"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="shape" className="text-xs">
						Shape
					</Label>
					<Select
						value={element.shape}
						onValueChange={(value) =>
							updateElement(element.id, {
								shape: value as "round" | "rectangular",
							})
						}
					>
						<SelectTrigger id="shape" className="h-8">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="round">Round</SelectItem>
							<SelectItem value="rectangular">Rectangular</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label htmlFor="seats" className="text-xs">
							Seats
						</Label>
						<span className="text-xs text-muted-foreground">
							{element.seats}
						</span>
					</div>
					<Slider
						id="seats"
						value={[element.seats]}
						min={2}
						max={12}
						step={1}
						onValueChange={([value]) =>
							updateElement(element.id, { seats: value })
						}
					/>
				</div>
			</div>
		</div>
	);
}
