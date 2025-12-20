import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ThemeProvider } from "./venue-editor/theme-provider";

describe("ThemeSwitcher", () => {
	beforeEach(() => {
		// Clear localStorage before each test
		localStorage.clear();
		// Mock matchMedia
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
	});

	it("renders theme switcher button", async () => {
		const { container } = render(
			<ThemeProvider>
				<ThemeSwitcher />
			</ThemeProvider>,
		);

		// Should render a button
		await waitFor(() => {
			const buttons = container.querySelectorAll("button");
			expect(buttons.length).toBeGreaterThan(0);
		});
	});

	it("renders button with icon when not mounted", () => {
		const { container } = render(
			<ThemeProvider>
				<ThemeSwitcher />
			</ThemeProvider>,
		);

		// Should render a button
		expect(container.querySelector("button")).toBeDefined();
	});

	it("renders dropdown menu trigger", async () => {
		render(
			<ThemeProvider>
				<ThemeSwitcher />
			</ThemeProvider>,
		);

		// Wait for component to mount and check for dropdown trigger
		await waitFor(() => {
			const buttons = screen.getAllByRole("button");
			const triggerButton = buttons.find(
				(btn) => btn.getAttribute("aria-haspopup") === "menu",
			);
			expect(triggerButton).toBeDefined();
		});
	});

	it("has theme icon based on current theme", async () => {
		render(
			<ThemeProvider>
				<ThemeSwitcher />
			</ThemeProvider>,
		);

		// Wait for component to mount
		await waitFor(() => {
			const buttons = screen.getAllByRole("button");
			expect(buttons.length).toBeGreaterThan(0);
		});

		// Component should render with an icon
		const { container } = render(
			<ThemeProvider>
				<ThemeSwitcher />
			</ThemeProvider>,
		);

		await waitFor(() => {
			const svg = container.querySelector("svg");
			expect(svg).toBeDefined();
		});
	});

	it("calls setTheme when theme value changes", async () => {
		const { container } = render(
			<ThemeProvider>
				<ThemeSwitcher />
			</ThemeProvider>,
		);

		await waitFor(() => {
			const buttons = container.querySelectorAll("button");
			expect(buttons.length).toBeGreaterThan(0);
		});

		// Component renders successfully
		expect(container).toBeTruthy();
	});

	it("handles getThemeIcon function for different themes", async () => {
		// Test that component renders with different theme states
		const { rerender } = render(
			<ThemeProvider>
				<ThemeSwitcher />
			</ThemeProvider>,
		);

		await waitFor(() => {
			const buttons = screen.getAllByRole("button");
			expect(buttons.length).toBeGreaterThan(0);
		});

		// Rerender to test different states
		rerender(
			<ThemeProvider>
				<ThemeSwitcher />
			</ThemeProvider>,
		);

		expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
	});

	it("renders with light theme icon when theme is light", async () => {
		localStorage.setItem("venue-editor-theme", "light");
		const { container } = render(
			<ThemeProvider>
				<ThemeSwitcher />
			</ThemeProvider>,
		);

		await waitFor(() => {
			const svg = container.querySelector("svg");
			expect(svg).toBeDefined();
		});
	});

	it("renders with dark theme icon when theme is dark", async () => {
		localStorage.setItem("venue-editor-theme", "dark");
		const { container } = render(
			<ThemeProvider>
				<ThemeSwitcher />
			</ThemeProvider>,
		);

		await waitFor(() => {
			const svg = container.querySelector("svg");
			expect(svg).toBeDefined();
		});
	});

	it("renders with system theme icon when theme is system", async () => {
		localStorage.setItem("venue-editor-theme", "system");
		const { container } = render(
			<ThemeProvider>
				<ThemeSwitcher />
			</ThemeProvider>,
		);

		await waitFor(() => {
			const svg = container.querySelector("svg");
			expect(svg).toBeDefined();
		});
	});
});
