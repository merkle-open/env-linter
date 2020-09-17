<div align="center">
    <h1>env-linter</h1>
    <p>Ensures that all developers on your project use the same node version, install dependencies in an unambiguous manner and utilize githooks.</p>

[![npm](https://img.shields.io/npm/v/@namics/env-linter.svg)](https://www.npmjs.com/package/@namics/env-linter)
[![Travis](https://api.travis-ci.org/namics/env-linter.svg?branch=master)](https://travis-ci.org/namics/env-linter)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](http://opensource.org/licenses/MIT)

</div>

<div style="max-width:640px;margin:0 auto;padding:20px 0 60px 0;">
    <img src="./env-linter.gif" alt="env-linter screencast">
</div>

## Usage example

Feel free to use env-linter in a way that makes sense for your project. Here is an example of how env-linter could be applied as part of your `package.json`:

```json
{
	"postinstall": "env-linter -h -s -d -vs 'node=12.x.x,npm=6.x.x'",
	"prestart": "env-linter --versions 'node=12.x.x,npm=6.x.x'",
	"lint-staged": {
		"**/package.json": ["env-linter --saveExact --dependenciesExactVersion"]
	}
}
```

You can skip all env-linter checks by using the environment variable `ENV_LINTER_SKIP=true`. This could be useful on certain CI environments which are not automatically detected by env-linter.

## API usage

```js
const { api } = require('@namics/env-linter');

await api({
	versions: 'node=12.x.x,npm=6.x.x',
	hooksInstalled: true,
	saveExact: true,
	dependenciesExactVersion: true,
});
```

## Options

### -vs, --versions [string]

Checks the installed versions of global packages or programs like node, npm, yo, etc. against a required version.
For example calling `env-linter --versions 'node=12.x.x'` will ensure that version 12 of node is being used. Multiple versions can be checked by separating them with a comma (eg. `--versions 'node=12.x.x,npm=6.x.x,yo=3.x.x'`).
env-linter will stop any further process-execution if a package or program does not satisfy the required version.

Calling env-linter with `--versions` but without any arguments will compare the installed node-version with the node-version from the .node-version file.

In any case, the used node version is compared to the list of [official node-releases](https://nodejs.org/dist/index.json) and process-execution is stopped if the used npm version is older than the npm version that node comes with.

### -h, --hooksInstalled

Checks if git-hooks are installed (i.e. husky installed). env-linter will stop any further process-execution if git-hooks are not installed.

### -s, --saveExact

Checks if the npm option `save-exact` is enabled, either through a .npmrc file in the project or in the user-directory. env-linter will stop any further process-execution if save-exact is disabled.

### -d, --dependenciesExactVersion

Checks if the version definitions of the dependencies and devDependencies in the `package.json` (or in a monorepository all available packages) are fitting our standards, which means; no approximate versions eg. tilde `~` or caret `^`, no star `*` wildcard and no tarball embeds via `https://*`.

### -l, --lts

Checks if the used node version is a LTS version. Here is some more information [why it might be a good idea to use an LTS version](https://nodejs.org/en/about/releases/).

## License

[MIT License](./LICENSE)
