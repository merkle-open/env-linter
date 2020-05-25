import chalk from 'chalk';
import logSymbols from 'log-symbols';
import { PackageDependencyKeys } from './const';

export const logMessages = {
	success: {
		nodeVersionWorksWithNPMVersion: (usedNodeVersion: string, usedNPMVersion: string) =>
			chalk.green(
				`${logSymbols.success} Your node version ${usedNodeVersion} works with your npm version ${usedNPMVersion}.`
			),
		programVersionSatisfies: (program: string, usedVersion: string, expectedVersion: string) =>
			chalk.green(
				`${logSymbols.success} Your ${program} version ${usedVersion} works with the required version (${expectedVersion}) of your project.`
			),
		saveExactIsOn: () => chalk.green(`${logSymbols.success} NPM save-exact config is set to true.`),
		gitHooksAreInstalled: () => chalk.green(`${logSymbols.success} Git hooks are installed.`),
		allDependenciesExact: (type: PackageDependencyKeys, pkgName: string) =>
			chalk.green(
				`${logSymbols.success} All ${type} in ${pkgName} have been installed by exact version definition.`
			),
	},
	error: {
		wrongNPMVersionError: (usedNodeVersion: string) =>
			chalk.red(
				`${logSymbols.error} Change npm version! You are using node ${usedNodeVersion}, keep node and npm in sync! https://nodejs.org/dist/index.json`
			),
		wrongProgramVersionError: (program: string, usedVersion: string, expectedVersion: string) =>
			chalk.red(
				`${logSymbols.error} Change ${program} version! You are using ${usedVersion} but your project requires ${expectedVersion}.`
			),
		readProgramVersionError: (program: string) =>
			chalk.red(`${logSymbols.error} Error when executing '${program} --version'. Is ${program} installed?`),
		readNodeVersionFileError: (file: string) =>
			chalk.red(`${logSymbols.error} Couldn't find ${file} file in your project root directory.`),
		saveExactIsOffError: () =>
			chalk.red(`${logSymbols.error} Set save-exact to true with "npm config set save-exact true".`),
		gitHooksNotInstalledError: () =>
			chalk.red(`${logSymbols.error} Git hooks are not installed. Install with "npm i -D husky".`),
		noPackagesFoundError: (cwd: string) => chalk.red(`${logSymbols.error} No packages in "${cwd}" found.`),
		notAllDependenciesExactError: (type: PackageDependencyKeys, pkgName: string, errorStack: string) =>
			chalk.red(
				`${logSymbols.error} Not all ${type} in ${pkgName} have been declared by exact version(s).${errorStack}`
			),
		starWildcardVersionError: () => 'Wildcard "*" is not allowed as version declaration.',
		approximateVersionError: (declaration: string) =>
			`Approximate version identifier "${declaration}" is not allowed.`,
		tarballVersionError: (url: string) => `Tarball dependencies are not allowed (${url}).`,
	},
	warning: {
		specifyProgramVersion: (program: string, usedVersion: string) =>
			chalk.yellow(
				`${logSymbols.warning} Specify ${program} version! You are using ${usedVersion} but you didn't specify a required version for ${program} in this project.`
			),
		fetchNodeListError: (nodeVersionListURL: string) =>
			chalk.yellow(
				`${logSymbols.warning} Could not fetch node-list from ${nodeVersionListURL}. Your NPM version might not match your node version.`
			),
	},
};
