import { describe, it, expect } from "vitest";

class CodaBuzz {}

describe("codabuzz", () => {
	it("returns 1 for 1", () => {
		expect(CodaBuzz.convert(1))
			.toBe(1);
	});
});
