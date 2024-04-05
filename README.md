# textlint-plugin-mdx

[![NPM Version](https://img.shields.io/npm/v/textlint-plugin-mdx)](https://www.npmjs.com/package/textlint-plugin-mdx?activeTab=versions)
[![NPM Downloads](https://img.shields.io/npm/d18m/textlint-plugin-mdx)](https://www.npmjs.com/package/textlint-plugin-mdx)
[![NPM License](https://img.shields.io/npm/l/textlint-plugin-mdx)](https://github.com/textlint/textlint-plugin-mdx/blob/HEAD/LICENSE)
[![CI](https://github.com/textlint/textlint-plugin-mdx/actions/workflows/ci.yaml/badge.svg?branch=main&event=push)](https://github.com/textlint/textlint-plugin-mdx/actions/workflows/ci.yaml)

[textlint](https://github.com/textlint/textlint) plugin to lint [MDX](https://mdxjs.com/)

## Installation

```sh
# npm
npm install textlint-plugin-mdx

# Yarn
yarn add textlint-plugin-mdx

# pnpm
pnpm add textlint-plugin-mdx

# Bun
bun add textlint-plugin-mdx
```

## Usage

> [!CAUTION]
> If you have enabled the `.mdx` extension in [@textlint/textlint-plugin-markdown](https://www.npmjs.com/package/@textlint/textlint-plugin-markdown), please remove it.

```json
{
  "plugins": {
    "mdx": true
  }
}
```

## Options

- `extensions`: `string[]`
  - Additional file extensions for MDX

## Examples

### textlint-filter-rule-comments

Example of how to use [textlint-filter-rule-comments](https://www.npmjs.com/package/textlint-filter-rule-comments) is shown below. There is no need to use syntax such as `{/* <!-- textlint-disable --> */}`.

```mdx
This is error text.

{/* textlint-disable */}

This is ignored text by rule.
Disables all rules between comments

{/* textlint-enable */}

This is error text.
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Maintainers

- [@3w36zj6](https://github.com/3w36zj6)

## License

[MIT License](LICENSE)
