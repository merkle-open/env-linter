<div align="center">
    <h1>Env Linter</h1>
    <p>Bunch of CLI helper for our projects. Check node version, hooks installed and more.</p>

[![npm](https://img.shields.io/npm/v/@namics/env-linter.svg)](https://www.npmjs.com/package/@namics/env-linter)
[![Travis](https://api.travis-ci.org/@namics/env-linter.svg?branch=master)](https://travis-ci.org/namics/env-linter)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](http://opensource.org/licenses/MIT)

</div>
<div style="max-width:640px;margin:0 auto;padding:20px 0 60px 0;">
    <img src="./env-linter.gif" alt="env-linter screencast">
</div>

## Usage

```shell
npx @namics/env-linter --versions="node=10.16.4,npm=6.4.1"
```

```shell
npx @namics/env-linter --hooksInstalled
```

```shell
npx @namics/env-linter --saveExact
```

```json
Usage:

Options:
  -vs, --versions [string]               versions of global packages eg. node, npm, ...
  -h, --hooksInstalled                  check for hooks are installed, failes if not
  -s, --saveExact                       check for npm save-exact enabled, failes if not
```

## API usage

```js
const { api } = require('@namics/env-linter');

await api({
	versions: 'node=10.16.4,npm=6.4.1',
	hooksInstalled: true,
	saveExact: true,
});
```

## License

[MIT License](./LICENSE)
