import type { TxtNode } from "@textlint/ast-node-types";
import type { TextlintPluginOptions } from "@textlint/types";
import { parse } from "./parse";

export class MdxProcessor {
	config: TextlintPluginOptions;
	extensions: string[];
	constructor(config: TextlintPluginOptions = {}) {
		this.config = config;
		this.extensions = Array.isArray(this.config.extensions)
			? this.config.extensions.filter(
					(extension): extension is string => typeof extension === "string",
				)
			: [];
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
