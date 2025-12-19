import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { VenueMapEditor } from "./index";

describe("VenueMapEditor", () => {
	it("renders without crashing", () => {
		const { container } = render(<VenueMapEditor />);
		expect(container).toBeTruthy();
	});
});
