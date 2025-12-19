"use client";

import { useEditor } from "./editor-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sun,
	Moon,
	Save,
	Download,
	Upload,
	MoreHorizontal,
	Undo2,
	Redo2,
	Pencil,
	Tag,
} from "lucide-react";
import { useTheme } from "./theme-provider";

export function EditorHeader() {
	const { venue, mode, setMode, updateVenueName } = useEditor();
	const { theme, setTheme } = useTheme();

	return (
		<header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
			{/* Left section */}
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
						<span className="text-sm font-bold text-primary-foreground">V</span>
					</div>
					<span className="hidden text-sm font-semibold sm:inline">
						Venue Editor
					</span>
				</div>

				<div className="hidden h-6 w-px bg-border md:block" />

				<Input
					value={venue.name}
					onChange={(e) => updateVenueName(e.target.value)}
					className="hidden h-8 w-48 border-transparent bg-transparent px-2 text-sm font-medium hover:bg-muted focus:border-input focus:bg-background md:block"
				/>
			</div>

			{/* Center section - Mode toggle */}
			<Tabs
				value={mode}
				onValueChange={(v) => setMode(v as "edit" | "tier-assignment")}
				className="hidden sm:block"
			>
				<TabsList className="h-9 bg-muted">
					<TabsTrigger
						value="edit"
						className="gap-2 px-4 text-xs data-[state=active]:bg-background"
					>
						<Pencil className="h-3.5 w-3.5" />
						Edit Layout
					</TabsTrigger>
					<TabsTrigger
						value="tier-assignment"
						className="gap-2 px-4 text-xs data-[state=active]:bg-background"
					>
						<Tag className="h-3.5 w-3.5" />
						Assign Tiers
					</TabsTrigger>
				</TabsList>
			</Tabs>

			{/* Mobile mode toggle */}
			<div className="flex sm:hidden">
				<Button
					variant={mode === "edit" ? "default" : "ghost"}
					size="sm"
					onClick={() => setMode("edit")}
					className="rounded-r-none"
				>
					<Pencil className="h-4 w-4" />
				</Button>
				<Button
					variant={mode === "tier-assignment" ? "default" : "ghost"}
					size="sm"
					onClick={() => setMode("tier-assignment")}
					className="rounded-l-none"
				>
					<Tag className="h-4 w-4" />
				</Button>
			</div>

			{/* Right section */}
			<div className="flex items-center gap-2">
				<div className="hidden items-center gap-1 md:flex">
					<Button variant="ghost" size="icon" className="h-8 w-8">
						<Undo2 className="h-4 w-4" />
						<span className="sr-only">Undo</span>
					</Button>
					<Button variant="ghost" size="icon" className="h-8 w-8">
						<Redo2 className="h-4 w-4" />
						<span className="sr-only">Redo</span>
					</Button>
				</div>

				<div className="hidden h-6 w-px bg-border md:block" />

				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				>
					{theme === "dark" ? (
						<Sun className="h-4 w-4" />
					) : (
						<Moon className="h-4 w-4" />
					)}
					<span className="sr-only">Toggle theme</span>
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">More options</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<Upload className="mr-2 h-4 w-4" />
							Import Layout
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Download className="mr-2 h-4 w-4" />
							Export Layout
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Save className="mr-2 h-4 w-4" />
							Save as Template
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<Button size="sm" className="hidden h-8 gap-2 sm:flex">
					<Save className="h-3.5 w-3.5" />
					Save
				</Button>
			</div>
		</header>
	);
}
