import path from 'path';
import fs from 'fs-extra';
import execa from 'execa';
import semver from 'semver';
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import fetch from 'node-fetch';

interface INodeVersion {
	version: string;
	npm: string;
}

type TProgram = 'node' | 'npm';

const nodeVersionList = `https://nodejs.org/dist/index.json`;

export const isValidVersion = (usedVersion: string, expectedVersion: string): boolean => {
	return semver.satisfies(usedVersion, expectedVersion);
};

export const getInstalledVersion = async (program: TProgram): Promise<string | void> => {
	return await execa(program, ['--version'])
		.then((version) => version.stdout.replace(/v/, '').trim())
		.catch(() => {
			console.error(`${logSymbols.error} Error when asking for '${program} --version'. Is ${program} installed?`);
			process.exit(1);
		});
};

export const getFileData = async (filePath: string): Promise<string> => {
	const pathName = path.resolve(filePath);
	return (await fs.readFile(pathName, 'utf8')).trim();
};

export const getNodeVersionFromFile = async (): Promise<string | undefined | void> => {
	return getFileData('.node-version').catch(() => {
		console.error(
			chalk.red(`${logSymbols.error} Couldn't find .node-version file in your project root directory.`)
		);
		process.exit(1);
	});
};

export const parseVersionArgs = (versions: string[]): { node; npm } => {
	return versions.reduce(
		(acc, current) => {
			const programAndVersion = current.split('=');
			acc[programAndVersion[0].trim()] = programAndVersion[1].trim();
			return acc;
		},
		{ node: undefined, npm: undefined }
	);
};

export const getNodeList = async (): Promise<INodeVersion[] | void> => {
	return fetch(nodeVersionList)
		.then(async (result) => result.json())
		.catch(() =>
			console.warn(
				chalk.yellow(
					`${logSymbols.warning} Could not fetch node-list from ${nodeVersionList}. Your NPM version might not match your node version.`
				)
			)
		);
};

export const isNPMandNodeMatching = async (usedNodeVersion: string, usedNPMVersion: string): Promise<boolean> => {
	const nodeList = await getNodeList();
	return nodeList
		? nodeList.some(
				(nodeVersion) => nodeVersion.version.slice(1) === usedNodeVersion && nodeVersion.npm === usedNPMVersion
		  )
		: true;
};

export const checkNPMmatchesNode = async (usedNodeVersion: string, usedNPMVersion: string) => {
	if (isNPMandNodeMatching(usedNodeVersion, usedNPMVersion)) {
		console.info(
			`${logSymbols.success} Your node version ${usedNodeVersion} works with your npm version ${usedNPMVersion}`
		);
	} else {
		console.error(
			chalk.red(
				`${logSymbols.error} Change npm version! You are using node ${usedNodeVersion}, keep node and npm in sync!`
			)
		);
		process.exit(1);
	}
};

export const checkIsValidVersion = (program: TProgram, usedVersion: string, expectedVersion: string) => {
	if (isValidVersion(usedVersion, expectedVersion)) {
		console.info(
			`${logSymbols.success} Your ${program} version ${usedVersion} works with the expected version (${expectedVersion}) of your project.`
		);
	} else {
		console.error(
			chalk.red(
				`${logSymbols.error} Change ${program} version! You are using ${usedVersion} but your project requires ${expectedVersion}.`
			)
		);
		process.exit(1);
	}
};

export const checkVersions = async (versions: string[] | undefined) => {
	const cliExpectedVersions = versions ? parseVersionArgs(versions) : { node: undefined, npm: undefined };

	const usedNodeVersion = (await getInstalledVersion('node')) as string;
	const expectedNodeVersion = cliExpectedVersions.node || (await getNodeVersionFromFile());
	checkIsValidVersion('node', usedNodeVersion, expectedNodeVersion);

	const usedNPMVersion = (await getInstalledVersion('npm')) as string;
	if (cliExpectedVersions.npm) {
		const expectedNPMVersion = cliExpectedVersions.npm;
		checkIsValidVersion('npm', usedNPMVersion, expectedNPMVersion);
	}

	checkNPMmatchesNode(usedNodeVersion, usedNPMVersion);
};
