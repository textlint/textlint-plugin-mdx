import type { TxtDocumentNode } from "@textlint/ast-node-types";
import { ASTNodeTypes } from "@textlint/ast-node-types";
import debug0 from "debug";
import traverse from "traverse";
import { SyntaxMap } from "./mapping/markdown-syntax-map";

import { unified } from "unified";

//import footnotes from "remark-footnotes";
import frontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import type { Node } from "unist";

export const parseMarkdown = (text: string): Node => {
	const remark = unified()
		.use(remarkParse)
		.use(frontmatter, ["yaml"])
		.use(remarkGfm)
		.use(remarkMdx)
		.use(remarkMath);
	/*.use(footnotes, {
      inlineNotes: true
    });*/
	return remark.parse(text);
};

const debug = debug0("@textlint/markdown-to-ast");

export { ASTNodeTypes as Syntax };

/**
 * parse Markdown text and return ast mapped location info.
 * @param {string} text
 */
export function parse(text: string): TxtDocumentNode {
	// remark-parse's AST does not consider BOM
	// AST's position does not +1 by BOM
	// So, just trim BOM and parse it for `raw` property
	// textlint's SourceCode also take same approach - trim BOM and check the position
	// This means that the loading side need to consider BOM position - for example fs.readFile and text slice script.
	// https://github.com/micromark/micromark/blob/0f19c1ac25964872a160d8b536878b125ddfe393/lib/preprocess.mjs#L29-L31
	const hasBOM = text.charCodeAt(0) === 0xfeff;
	const textWithoutBOM = hasBOM ? text.slice(1) : text;
	const ast = parseMarkdown(textWithoutBOM);
	// biome-ignore lint/complexity/noForEach: traverse cannot use for...of syntax.
	traverse(ast).forEach(function (node) {
		const isMdx =
			node &&
			Object.prototype.hasOwnProperty.call(node, "type") &&
			/^(mdxJsxFlowElement|mdxJsxTextElement|mdxjsEsm|mdxFlowExpression|mdxTextExpression)$/.test(
				node.type,
			);
		if (this.notLeaf) {
			// MDX support
			if (isMdx) {
				if (node.type === "mdxJsxFlowElement") {
					node.type = ASTNodeTypes.Html;
				} else if (node.type === "mdxJsxTextElement") {
					node.type = ASTNodeTypes.Paragraph;
				} else if (
					node.type === "mdxjsEsm" ||
					node.type === "mdxFlowExpression" ||
					node.type === "mdxTextExpression"
				) {
					if (
						Object.prototype.hasOwnProperty.call(node, "value") &&
						/^(\/\*(.|\s)*\*\/)$/.test(node.value)
					) {
						node.type = ASTNodeTypes.Comment;
						node.value = node.value.replace(/^(\/\*)/, "").replace(/\*\/$/, "");
					} else {
						node.type =
							node.type === "mdxTextExpression"
								? ASTNodeTypes.Code
								: ASTNodeTypes.CodeBlock;
					}
				}
				if (Object.prototype.hasOwnProperty.call(node, "attributes")) {
					node.attributes = undefined;
				}
				if (Object.prototype.hasOwnProperty.call(node, "name")) {
					node.name = undefined;
				}
				if (Object.prototype.hasOwnProperty.call(node, "data")) {
					node.data = undefined;
				}
			} else if (node.type) {
				const replacedType = SyntaxMap[node.type as keyof typeof SyntaxMap];
				if (!replacedType) {
					debug(`replacedType : ${replacedType} , node.type: ${node.type}`);
				} else {
					node.type = replacedType;
				}
			}
			// map `range`, `loc` and `raw` to node
			if (node.position) {
				const position = node.position;
				// line start with 1
				// column start with 0
				const positionCompensated = {
					start: {
						line: position.start.line,
						column: Math.max(position.start.column - 1, 0),
					},
					end: {
						line: position.end.line,
						column: Math.max(position.end.column - 1, 0),
					},
				};
				const range = [position.start.offset, position.end.offset] as const;
				node.loc = positionCompensated;
				node.range = range;
				node.raw = textWithoutBOM.slice(range[0], range[1]);
				// Compatible for https://github.com/syntax-tree/unist, but it is hidden
				Object.defineProperty(node, "position", {
					enumerable: false,
					configurable: false,
					writable: false,
					value: position,
				});
			}
		}
	});
	return ast as TxtDocumentNode;
}
