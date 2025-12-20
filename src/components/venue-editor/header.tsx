"use client";

import { useState } from "react";
import { useEditor } from "./editor-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from "@/components/ui/menubar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Save,
	Upload,
	Download,
	HelpCircle,
	Trash2,
	Settings,
	MoreVertical,
	Pencil,
	ChevronRight,
	User,
	LogOut,
	Keyboard,
	Tag,
} from "lucide-react";
import { KeyboardShortcutsModal } from "./shortcuts-modal";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function EditorHeader() {
	const { venue, mode, setMode, updateVenueName, version, resetVenue } =
		useEditor();
	const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

	const displayVersion = (() => {
		const match = version.match(/(\d+)/);
		if (!match) return "v1";
		const parsed = Number.parseInt(match[1], 10);
		if (Number.isNaN(parsed) || parsed < 1) return "v1";
		const clamped = Math.min(parsed, 3);
		return `v${clamped}`;
	})();

	const handleSave = () => {
		console.log("Guardando layout:", venue);
		alert("✅ Layout guardado exitosamente");
	};

	const handleExportJSON = () => {
		const dataStr = JSON.stringify(venue, null, 2);
		const dataBlob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${venue.name || "venue"}.json`;
		link.click();
		URL.revokeObjectURL(url);
	};

	const handleImportJSON = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "application/json";
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (event) => {
					try {
						const data = JSON.parse(event.target?.result as string);
						console.log("Importando layout:", data);
						alert("✅ Layout importado exitosamente");
					} catch (error) {
						alert("❌ Error al importar el layout");
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	};

	const handleReset = () => {
		const confirmed = window.confirm(
			"¿Estás seguro de que deseas reiniciar el layout? Esta acción no se puede deshacer.",
		);
		if (confirmed) {
			resetVenue();
		}
	};

	return (
		<div className="relative z-50 border-b border-border bg-card/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/70">
			<div className="flex items-center gap-3">
				{/* Left section - Breadcrumbs */}
				<div className="min-w-0 flex-shrink-0">
					<div className="flex flex-wrap items-center gap-2">
						<div className="flex items-center gap-2">
							<span className="text-lg font-bold text-primary">V</span>
							<span className="text-base font-semibold text-foreground">
								Venue Editor
							</span>
						</div>
						<ChevronRight className="h-4 w-4 text-muted-foreground" />
						<div className="group flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1 hover:border-border/50 hover:bg-muted/30 transition-colors">
							<Input
								value={venue.name}
								onChange={(e) => updateVenueName(e.target.value)}
								className="h-auto min-w-[120px] border-transparent bg-transparent p-0 text-base font-semibold text-foreground shadow-none focus-visible:ring-0 focus-visible:outline-none"
								placeholder="Nombre del Venue"
							/>
							<Button
								variant="ghost"
								size="icon"
								className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
								title="Editar nombre del venue"
							>
								<Pencil className="h-3 w-3" />
							</Button>
						</div>
						{version && (
							<span className="rounded-full border border-border bg-muted/30 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-foreground/70">
								{displayVersion}
							</span>
						)}
					</div>
				</div>

				{/* Center section - Mode toggle */}
				<div
					className="flex flex-1 items-center justify-center"
					data-toolbar-center
				>
					<Tabs
						value={mode}
						onValueChange={(v) => setMode(v as "edit" | "tier-assignment")}
						key={mode}
					>
						<TabsList className="h-9 bg-muted" data-tabs-center>
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
				</div>

				{/* Right section */}
				<div className="flex flex-shrink-0 items-center justify-end gap-1 sm:gap-2">
					<Button
						variant="default"
						size="sm"
						onClick={handleSave}
						title="Guardar layout"
						className="gap-2 rounded-md px-3"
					>
						<Save className="h-4 w-4" />
						<span className="text-sm font-semibold">Save</span>
					</Button>

					<Menubar className="border-none bg-transparent">
						<MenubarMenu>
							<MenubarTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									title="Más opciones"
									className="rounded-md bg-muted/50"
								>
									<MoreVertical className="h-4 w-4 text-muted-foreground" />
								</Button>
							</MenubarTrigger>
							<MenubarContent align="end">
								<MenubarItem onClick={handleSave}>
									<Save className="mr-2 h-4 w-4" />
									Guardar como borrador
								</MenubarItem>
								<MenubarItem onClick={handleReset}>
									<Trash2 className="mr-2 h-4 w-4" />
									Reiniciar layout
								</MenubarItem>
								<MenubarItem onClick={handleExportJSON}>
									<Download className="mr-2 h-4 w-4" />
									Exportar Layout
								</MenubarItem>
								<MenubarItem onClick={handleImportJSON}>
									<Upload className="mr-2 h-4 w-4" />
									Importar Layout
								</MenubarItem>
								<MenubarItem>
									<Settings className="mr-2 h-4 w-4" />
									Propiedades del venue
								</MenubarItem>
								<MenubarItem>
									<HelpCircle className="mr-2 h-4 w-4" />
									Ayuda
								</MenubarItem>
								<MenubarSeparator />
								<MenubarItem
									onSelect={(e) => {
										e.preventDefault();
										setShortcutsModalOpen(true);
									}}
								>
									<Keyboard className="mr-2 h-4 w-4" />
									Atajos de teclado
								</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>

					<LanguageSelect />
					<ThemeSwitcher />
					<UserMenu />
				</div>
			</div>
			<KeyboardShortcutsModal
				open={shortcutsModalOpen}
				onOpenChange={setShortcutsModalOpen}
			/>
		</div>
	);
}

function LanguageSelect() {
	const [language, setLanguage] = useState<"es" | "en">("es");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="h-9 w-auto min-w-[40px] rounded-md border-purple-400/50 bg-background px-2 text-xs font-medium text-foreground hover:bg-accent hover:border-purple-400/70"
				>
					{language.toUpperCase()}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-auto min-w-[44px] p-0.5">
				<DropdownMenuRadioGroup
					value={language}
					onValueChange={(value) => setLanguage(value as "es" | "en")}
				>
					<DropdownMenuRadioItem
						value="en"
						className="cursor-pointer justify-center rounded-sm px-3 py-1.5 pl-3 pr-3 text-xs [&>span:first-child]:hidden data-[state=checked]:bg-accent/80 data-[state=checked]:text-foreground"
					>
						EN
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem
						value="es"
						className="cursor-pointer justify-center rounded-sm px-3 py-1.5 pl-3 pr-3 text-xs [&>span:first-child]:hidden data-[state=checked]:bg-accent/80 data-[state=checked]:text-foreground"
					>
						ES
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function UserMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-9 w-9 rounded-full border border-border/60 bg-muted/40"
					title="Menú de usuario"
				>
					<Avatar className="h-7 w-7">
						<AvatarImage src="https://api.dicebear.com/7.x/thumbs/svg?seed=nexus" />
						<AvatarFallback>NX</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<User className="mr-2 h-4 w-4" />
					Perfil
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings className="mr-2 h-4 w-4" />
					Preferencias
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<LogOut className="mr-2 h-4 w-4" />
					Cerrar sesión
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
