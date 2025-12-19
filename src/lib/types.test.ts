import { describe, it, expect } from "vitest";
import { TIERS, TAILWIND_COLORS } from "./types";

describe("types", () => {
	it("exports TIERS constant", () => {
		expect(TIERS).toBeDefined();
		expect(Array.isArray(TIERS)).toBe(true);
		expect(TIERS.length).toBeGreaterThan(0);
	});

	it("exports TAILWIND_COLORS constant", () => {
		expect(TAILWIND_COLORS).toBeDefined();
		expect(Array.isArray(TAILWIND_COLORS)).toBe(true);
		expect(TAILWIND_COLORS.length).toBeGreaterThan(0);
	});

	it("TIERS have correct structure", () => {
		TIERS.forEach((tier) => {
			expect(tier).toHaveProperty("id");
			expect(tier).toHaveProperty("name");
			expect(tier).toHaveProperty("color");
			expect(tier).toHaveProperty("price");
			expect(typeof tier.price).toBe("number");
		});
	});
});
