import semver from 'semver';
import { INodeVersion } from './const';
import { getNodeList } from './fetch-node-versions';
import { getNodeVersionFromFile } from './get-file-data';
import { getInstalledVersion } from './get-version';
import { logMessages } from './log-messages';

export const isNPMandNodeMatching = (nodeList: INodeVersion[], usedNodeVersion: string, usedNPMVersion: string) => {
	return nodeList.some((nodeVersion) => {
		return nodeVersion.version.slice(1) === usedNodeVersion && nodeVersion.npm === usedNPMVersion;
	});
};

export const getNPMmatchesNodeLog = async (usedNodeVersion: string, usedNPMVersion: string) => {
	const nodeList = await getNodeList();
	if (nodeList.error) {
		return nodeList.text;
	}
	return isNPMandNodeMatching(JSON.parse(nodeList.text), usedNodeVersion, usedNPMVersion)
		? logMessages.success.nodeVersionWorksWithNPMVersion(usedNodeVersion, usedNPMVersion)
		: logMessages.error.changeNPMVersion(usedNodeVersion);
};

export const getValidVersionLog = async (program: string, usedVersion: string, expectedVersion: string) => {
	return semver.satisfies(usedVersion, expectedVersion)
		? logMessages.success.programVersionSatiesfies(program, usedVersion, expectedVersion)
		: logMessages.error.changeProgramVersion(program, usedVersion, expectedVersion);
};

export const processVersionArgument = async (versionArgument: string) => {
	const [program, expectedVersionCli] = versionArgument.split('=').map((item) => item.trim());
	const expectedVersion =
		program === 'node' && !expectedVersionCli
			? await getNodeVersionFromFile('.node-version')
			: { error: false, text: expectedVersionCli };
	if (expectedVersion.error) {
		return expectedVersion.text;
	}
	const usedVersion = await getInstalledVersion(program);
	return usedVersion.error ? usedVersion.text : getValidVersionLog(program, usedVersion.text, expectedVersion.text);
};

export const getVersionCheckers = async (versionArguments: string[]) => {
	const versionChecks = versionArguments.map(async (versionArgument) => processVersionArgument(versionArgument));
	const usedNodeVersion = await getInstalledVersion('node');
	const usedNPMVersion = await getInstalledVersion('npm');
	if (usedNodeVersion.error || usedNPMVersion.error) {
		const usedVersionError = usedNodeVersion.error ? usedNodeVersion.text : usedNPMVersion.text;
		versionChecks.push(Promise.resolve(usedVersionError));
		return versionChecks;
	}
	versionChecks.push(getNPMmatchesNodeLog(usedNodeVersion.text, usedNPMVersion.text));
	return versionChecks;
};
