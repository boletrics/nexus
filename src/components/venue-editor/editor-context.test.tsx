import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { EditorProvider, useEditor } from "./editor-context";

describe("EditorContext", () => {
	it("provides editor context", () => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<EditorProvider>{children}</EditorProvider>
		);

		const { result } = renderHook(() => useEditor(), { wrapper });

		expect(result.current.venue).toBeDefined();
		expect(result.current.mode).toBe("edit");
		expect(result.current.zoom).toBe(0.8);
		expect(result.current.setZoom).toBeDefined();
		expect(result.current.setMode).toBeDefined();
	});

	it("updates zoom correctly", () => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<EditorProvider>{children}</EditorProvider>
		);

		const { result } = renderHook(() => useEditor(), { wrapper });

		act(() => {
			result.current.setZoom(1.5);
		});

		expect(result.current.zoom).toBe(1.5);
	});

	it("updates mode correctly", () => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<EditorProvider>{children}</EditorProvider>
		);

		const { result } = renderHook(() => useEditor(), { wrapper });

		act(() => {
			result.current.setMode("tier-assignment");
		});

		expect(result.current.mode).toBe("tier-assignment");
	});
});
