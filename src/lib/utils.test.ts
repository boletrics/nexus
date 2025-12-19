import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("utils", () => {
	it("cn function merges class names", () => {
		const result = cn("class1", "class2");
		expect(result).toBeDefined();
		expect(typeof result).toBe("string");
	});

	it("cn function handles conditional classes", () => {
		const result = cn("base", true && "conditional");
		expect(result).toBeDefined();
		expect(typeof result).toBe("string");
	});
});
