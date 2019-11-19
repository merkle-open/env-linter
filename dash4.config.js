/**
 *
 * 	DASH4 configuration
 *  https://github.com/smollweide/dash4
 *
 */
// https://github.com/smollweide/dash4/tree/master/plugins/plugin-dependencies
const { PluginDependencies } = require('@dash4/plugin-dependencies');
// https://github.com/smollweide/dash4/tree/master/plugins/plugin-readme
const { PluginReadme } = require('@dash4/plugin-readme');
// https://github.com/smollweide/dash4/tree/master/plugins/plugin-terminal
const { PluginTerminal, jestCommands } = require('@dash4/plugin-terminal');
// https://github.com/smollweide/dash4/tree/master/plugins/plugin-code-coverage
const { PluginCodeCoverage } = require('@dash4/plugin-code-coverage');
// https://github.com/smollweide/dash4/tree/master/plugins/plugin-npm-scripts
const { PluginNpmScripts } = require('@dash4/plugin-npm-scripts');
// https://github.com/smollweide/dash4/tree/master/plugins/plugin-actions
const { PluginActions } = require('@dash4/plugin-actions');

async function getConfig() {
	return {
		port: 4000,
		tabs: [
			{
				title: 'root',
				rows: [
					[
						new PluginReadme({ file: 'README.md', height: 400 }),
						new PluginActions({
							title: 'Links',
							actions: [
								{
									type: 'link',
									href: 'https://github.com/namics/env-linter',
									title: 'env-linter repository',
									image: 'https://github.githubassets.com/pinned-octocat.svg',
								},
								{
									type: 'link',
									href: 'https://github.com/tj/commander.js',
									title: 'commander.js',
									image: 'https://github.githubassets.com/pinned-octocat.svg',
								},
								{
									type: 'link',
									href: 'https://github.com/sindresorhus/ora',
									title: 'ora - elegant terminal spinner',
									image: 'https://github.githubassets.com/pinned-octocat.svg',
								},
								{
									type: 'link',
									href: 'https://github.com/chalk/chalk',
									title: 'chalk - terminal string styling done right',
									image: 'https://github.githubassets.com/pinned-octocat.svg',
								},
								{
									type: 'link',
									href: 'https://getkap.co/',
									title: 'kap - capture your screen',
									image: 'https://getkap.co/static/favicon/icon-128.png',
								},
							],
						}),
						new PluginNpmScripts({
							scripts: [
								{ title: 'install', cmd: 'npm i' },
								{ title: 'audit', cmd: 'npm audit' },
								{ title: 'build', cmd: 'npm run build' },
								{ title: 'test', cmd: 'npm run test' },
								{ title: 'lint', cmd: 'npm run lint' },
								{ title: 'prettier', cmd: 'npm run prettier' },
								{ title: 'sort-package', cmd: 'npm run sort-package' },
								{ title: 'release', cmd: 'npm run release' },
								{ title: 'clean', cmd: 'npm run clean' },
								{ title: 'reset last commit', cmd: 'git reset HEAD~1' },
							],
						}),
					],
					[
						new PluginTerminal({ autostart: true, cmd: 'npm run watch', width: [12, 6, 8] }),
						new PluginDependencies({
							width: [12, 6, 4],
							installProcess: {
								title: 'run install',
								cmd: 'npm i',
							},
						}),
					],
					[
						new PluginTerminal({
							autostart: true,
							cmd: 'npm run watch-test',
							allowedCommands: jestCommands,
							width: [12, 6, 8],
						}),
						new PluginCodeCoverage({ width: [12, 6, 4] }),
					],
				],
			},
		],
	};
}

module.exports = getConfig;
