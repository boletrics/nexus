"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
	// Initialize theme from localStorage immediately to prevent flash
	const getInitialTheme = (): Theme => {
		if (typeof window === "undefined") return "system";
		const stored = localStorage.getItem("venue-editor-theme") as Theme | null;
		return stored || "system";
	};

	const getInitialResolvedTheme = (): "light" | "dark" => {
		if (typeof window === "undefined") return "dark";
		const theme = getInitialTheme();
		if (theme === "system") {
			return window.matchMedia("(prefers-color-scheme: light)").matches
				? "light"
				: "dark";
		}
		return theme;
	};

	const [theme, setTheme] = useState<Theme>(getInitialTheme);
	const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(
		getInitialResolvedTheme,
	);

	// Apply theme immediately on mount to prevent flash
	useEffect(() => {
		const root = document.documentElement;
		const resolved = getInitialResolvedTheme();
		root.classList.remove("light", "dark");
		root.classList.add(resolved);
	}, []);

	useEffect(() => {
		const getResolvedTheme = (): "light" | "dark" => {
			if (theme === "system") {
				return window.matchMedia("(prefers-color-scheme: light)").matches
					? "light"
					: "dark";
			}
			return theme;
		};

		const resolved = getResolvedTheme();
		setResolvedTheme(resolved);

		const root = document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(resolved);

		if (theme !== "system") {
			localStorage.setItem("venue-editor-theme", theme);
		}

		// Listen for system theme changes
		if (theme === "system") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
			const handleChange = () => {
				const newResolved = getResolvedTheme();
				setResolvedTheme(newResolved);
				root.classList.remove("light", "dark");
				root.classList.add(newResolved);
			};

			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		}
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
}
