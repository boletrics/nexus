"use client";

import { Fragment } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

type ShortcutDefinition = {
	label: string;
	mac: string[];
	win: string[];
	description?: string;
	category?: string;
};

const KEYBOARD_SHORTCUTS: ShortcutDefinition[] = [
	// Barra superior - Acciones principales
	{
		label: "Guardar layout",
		mac: ["⌘", "S"],
		win: ["Ctrl", "S"],
		category: "Barra superior",
	},
	{
		label: "Publicar",
		mac: ["⌘", "⇧", "P"],
		win: ["Ctrl", "⇧", "P"],
		category: "Barra superior",
	},
	{
		label: "Exportar JSON",
		mac: ["⌘", "E"],
		win: ["Ctrl", "E"],
		category: "Barra superior",
	},
	{
		label: "Importar JSON",
		mac: ["⌘", "I"],
		win: ["Ctrl", "I"],
		category: "Barra superior",
	},
	// Barra inferior - Herramientas de canvas
	{
		label: "Herramienta de pan (mano)",
		mac: ["Space"],
		win: ["Space"],
		category: "Barra inferior",
	},
	{
		label: "Herramienta de selección",
		mac: ["V"],
		win: ["V"],
		category: "Barra inferior",
	},
	{
		label: "Deshacer",
		mac: ["⌘", "Z"],
		win: ["Ctrl", "Z"],
		category: "Barra inferior",
	},
	{
		label: "Rehacer",
		mac: ["⌘", "Y"],
		win: ["Ctrl", "Y"],
		category: "Barra inferior",
	},
	{
		label: "Copiar selección",
		mac: ["⌘", "C"],
		win: ["Ctrl", "C"],
		category: "Barra inferior",
	},
	{
		label: "Pegar selección",
		mac: ["⌘", "V"],
		win: ["Ctrl", "V"],
		category: "Barra inferior",
	},
	{
		label: "Acercar (Zoom +)",
		mac: ["2"],
		win: ["2"],
		category: "Barra inferior",
	},
	{
		label: "Alejar (Zoom -)",
		mac: ["1"],
		win: ["1"],
		category: "Barra inferior",
	},
	{
		label: "Ajustar a la vista",
		mac: ["F"],
		win: ["F"],
		category: "Barra inferior",
	},
	// Herramientas - Acciones adicionales
	{
		label: "Agregar Fila de Asientos",
		mac: ["S"],
		win: ["S"],
		category: "Herramientas",
	},
	{
		label: "Agregar Área de Pie",
		mac: ["A"],
		win: ["A"],
		category: "Herramientas",
	},
	{
		label: "Agregar Box",
		mac: ["B"],
		win: ["B"],
		category: "Herramientas",
	},
	{
		label: "Agregar Mesa",
		mac: ["T"],
		win: ["T"],
		category: "Herramientas",
	},
	{
		label: "Eliminar elemento",
		mac: ["Delete"],
		win: ["Delete"],
		category: "Herramientas",
	},
];

interface KeyboardShortcutsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsModal({
	open,
	onOpenChange,
}: KeyboardShortcutsModalProps) {
	const normalizeKeys = (keys: string[]) =>
		keys.map((k) => (k === "Shift" ? "⇧" : k));

	const renderShortcutRow = (shortcut: ShortcutDefinition) => {
		const macNormalized = normalizeKeys(shortcut.mac);
		const winNormalized = normalizeKeys(shortcut.win);
		const areIdentical =
			JSON.stringify(macNormalized) === JSON.stringify(winNormalized);
		const macRest = macNormalized.slice(1);
		const canMerge =
			!areIdentical &&
			macNormalized[0] === "⌘" &&
			winNormalized[0] === "Ctrl" &&
			JSON.stringify(macRest) === JSON.stringify(winNormalized.slice(1));

		return (
			<div
				key={shortcut.label}
				className="flex items-center justify-between gap-6 py-1.5"
			>
				<span className="min-w-[160px] flex-shrink-0 text-sm text-foreground/90">
					{shortcut.label}
				</span>
				<div className="flex flex-shrink-0 items-center gap-1.5">
					{areIdentical ? (
						<ShortcutKeys keys={macNormalized} />
					) : canMerge ? (
						<>
							<kbd className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md border border-border/40 bg-muted/80 px-2.5 text-xs font-semibold text-foreground shadow-sm">
								⌘
							</kbd>
							<span className="mx-1 text-xs text-muted-foreground/60">/</span>
							<span className="text-xs font-medium text-foreground/90">
								Ctrl
							</span>
							{macRest.length > 0 && (
								<>
									<span className="mx-1 text-xs text-muted-foreground/60">
										+
									</span>
									<ShortcutKeys keys={macRest} />
								</>
							)}
						</>
					) : (
						<>
							<ShortcutKeys keys={macNormalized} />
							<span className="mx-1 text-xs text-muted-foreground/50">/</span>
							<ShortcutKeys keys={winNormalized} />
						</>
					)}
				</div>
			</div>
		);
	};

	const barraSuperior = KEYBOARD_SHORTCUTS.filter(
		(shortcut) => shortcut.category === "Barra superior",
	);
	const barraInferior = KEYBOARD_SHORTCUTS.filter(
		(shortcut) => shortcut.category === "Barra inferior",
	);
	const herramientas = KEYBOARD_SHORTCUTS.filter(
		(shortcut) => shortcut.category === "Herramientas",
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="!max-w-[1400px] h-auto max-h-none flex w-[90vw] flex-col gap-0 p-0 sm:!max-w-[1400px]">
				<DialogHeader className="flex-shrink-0 border-b px-8 pb-4 pt-5">
					<DialogTitle className="flex items-center gap-2 text-lg">
						<Keyboard className="h-5 w-5" />
						Atajos de teclado
					</DialogTitle>
				</DialogHeader>

				<div className="px-10 py-6">
					<div className="grid grid-cols-3 gap-x-12 gap-y-0">
						{/* Columna 1: Barra Superior */}
						<div className="flex flex-col gap-1.5">
							<h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								BARRA SUPERIOR
							</h3>
							{barraSuperior.map(renderShortcutRow)}
						</div>

						{/* Columna 2: Barra Inferior */}
						<div className="flex flex-col gap-1.5">
							<h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								BARRA INFERIOR
							</h3>
							{barraInferior.map(renderShortcutRow)}
						</div>

						{/* Columna 3: Herramientas */}
						<div className="flex flex-col gap-1.5">
							<h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								HERRAMIENTAS
							</h3>
							{herramientas.map(renderShortcutRow)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function ShortcutKeys({ keys }: { keys: string[] }) {
	return (
		<div className="flex items-center gap-1">
			{keys.map((key, index) => (
				<Fragment key={`${key}-${index}`}>
					<kbd className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md border border-border/40 bg-muted/80 px-2.5 text-xs font-semibold text-foreground shadow-sm">
						{key}
					</kbd>
					{index < keys.length - 1 && (
						<span className="mx-0.5 text-xs text-muted-foreground/60">+</span>
					)}
				</Fragment>
			))}
		</div>
	);
}
