import semver from 'semver';
import { INodeVersion, ILogMessage } from './const';
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
		return { error: false, text: nodeList.text };
	}
	return isNPMandNodeMatching(JSON.parse(nodeList.text), usedNodeVersion, usedNPMVersion)
		? { error: false, text: logMessages.success.nodeVersionWorksWithNPMVersion(usedNodeVersion, usedNPMVersion) }
		: { error: true, text: logMessages.error.wrongNPMVersionError(usedNodeVersion) };
};

export const getValidVersionLog = async (program: string, usedVersion: string, expectedVersion: string) => {
	return semver.satisfies(usedVersion, expectedVersion)
		? { error: false, text: logMessages.success.programVersionSatisfies(program, usedVersion, expectedVersion) }
		: { error: true, text: logMessages.error.wrongProgramVersionError(program, usedVersion, expectedVersion) };
};

export const getValidNodeVersionLog = async (usedNodeVersion: ILogMessage) => {
	const nodeVersionFromFile = await getNodeVersionFromFile('.node-version');
	return nodeVersionFromFile.error
		? nodeVersionFromFile
		: getValidVersionLog('node', usedNodeVersion.text, nodeVersionFromFile.text);
};

export const processVersionArgument = async (versionArgument: string) => {
	const [program, expectedVersionCli] = versionArgument.split('=').map((item) => item.trim());
	const usedVersion = await getInstalledVersion(program);
	if (program === 'node' && !expectedVersionCli) {
		return getValidNodeVersionLog(usedVersion);
	}
	if (usedVersion.error) {
		return usedVersion;
	}
	if (!expectedVersionCli) {
		return { error: false, text: logMessages.warning.specifyProgramVersion(program, usedVersion.text) };
	}
	return getValidVersionLog(program, usedVersion.text, expectedVersionCli);
};

export const getVersionCheckers = async (versionArguments: string[]) => {
	const versionChecks: Promise<ILogMessage>[] = versionArguments.map(async (versionArgument) =>
		processVersionArgument(versionArgument)
	);
	const usedNodeVersion: ILogMessage = await getInstalledVersion('node');
	const usedNPMVersion: ILogMessage = await getInstalledVersion('npm');
	if (usedNodeVersion.error || usedNPMVersion.error) {
		const usedVersionError: ILogMessage = usedNodeVersion.error
			? { error: true, text: usedNodeVersion.text }
			: { error: true, text: usedNPMVersion.text };
		versionChecks.push(Promise.resolve(usedVersionError));
		return versionChecks;
	}
	versionChecks.push(getNPMmatchesNodeLog(usedNodeVersion.text, usedNPMVersion.text));
	return versionChecks;
};
