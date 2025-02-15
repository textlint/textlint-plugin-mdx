import fs from "node:fs";
import path from "node:path";
// parse all fixture and should has
import { test } from "@textlint/ast-tester";
import { describe, expect, it } from "vitest";
import { parse } from "../src/parse";

describe("parsing", () => {
	const fixtureDir = path.join(__dirname, "fixtures");
	for (const filePath of fs.readdirSync(fixtureDir)) {
		const dirName = path.basename(filePath);
		it(`${dirName} match AST`, () => {
			const input = fs.readFileSync(
				path.join(fixtureDir, filePath, "input.mdx"),
				"utf-8",
			);
			const AST = parse(input);
			test(AST);
			const output = JSON.parse(
				fs.readFileSync(
					path.join(fixtureDir, filePath, "output.json"),
					"utf-8",
				),
			);
			expect(AST).toEqual(output);
		});
	}
});
