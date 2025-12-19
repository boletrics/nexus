import { describe, it, expect } from "vitest";
import { createMockVenue, generateId } from "./mock-data";

describe("mock-data", () => {
	it("creates mock venue", () => {
		const venue = createMockVenue();
		expect(venue).toBeDefined();
		expect(venue.id).toBeDefined();
		expect(venue.name).toBeDefined();
		expect(venue.dimensions).toBeDefined();
		expect(venue.elements).toBeDefined();
		expect(Array.isArray(venue.elements)).toBe(true);
	});

	it("generates unique IDs", () => {
		const id1 = generateId();
		const id2 = generateId();
		expect(id1).toBeDefined();
		expect(id2).toBeDefined();
		expect(id1).not.toBe(id2);
	});
});
