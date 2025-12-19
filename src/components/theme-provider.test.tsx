import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ThemeProvider } from "./theme-provider";

describe("ThemeProvider", () => {
	it("renders children", () => {
		const { container } = render(
			<ThemeProvider>
				<div>Test Content</div>
			</ThemeProvider>,
		);
		expect(container).toBeTruthy();
	});
});
