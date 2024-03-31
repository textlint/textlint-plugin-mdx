import type { TxtNode } from "@textlint/ast-node-types";
import type { TextlintPluginOptions } from "@textlint/types";
import { parse } from "./parse";

export class MdxProcessor {
	config: TextlintPluginOptions;
	extensions: Array<string>;
	constructor(config = {}) {
		this.config = config;
		this.extensions = this.config.extensions ? this.config.extensions : [];
	}

	availableExtensions() {
		return [".mdx"].concat(this.extensions);
	}

	processor(_ext: string) {
		return {
			preProcess(text: string, _filePath?: string): TxtNode {
				return parse(text);
			},
			// biome-ignore lint/suspicious/noExplicitAny: Allowing 'any' type for messages as the exact structure is not known.
			postProcess(messages: any[], filePath?: string) {
				return {
					messages,
					filePath: filePath ? filePath : "<mdx>",
				};
			},
		};
	}
}
