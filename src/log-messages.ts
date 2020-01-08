import chalk from 'chalk';
import logSymbols from 'log-symbols';

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
	},
	error: {
		changeNPMVersion: (usedNodeVersion: string) =>
			chalk.red(
				`${logSymbols.error} Change npm version! You are using node ${usedNodeVersion}, keep node and npm in sync!`
			),
		changeProgramVersion: (program: string, usedVersion: string, expectedVersion: string) =>
			chalk.red(
				`${logSymbols.error} Change ${program} version! You are using ${usedVersion} but your project requires ${expectedVersion}.`
			),
		readProgramVersionError: (program: string) =>
			chalk.red(`${logSymbols.error} Error when executing '${program} --version'. Is ${program} installed?`),
		readNodeVersionFileError: (file: string) =>
			chalk.red(`${logSymbols.error} Couldn't find ${file} file in your project root directory.`),
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
