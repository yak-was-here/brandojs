/// <reference types="node" />
// @vitest-environment node
import { describe, test, expect } from "vitest";
import * as fs from "fs";

describe("README.md", () => {
	test("exists and has content", () => {
		const content = fs.readFileSync("./README.md").toString();
		expect(content.length).toBeGreaterThan(500);
	});

	test("contains the quick-start code block", () => {
		const content = fs.readFileSync("./README.md").toString();
		expect(content).toContain("import { BRando");
		expect(content).toContain("BRandoHandle");
	});
});
