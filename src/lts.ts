import { INodeVersion, ILogMessage } from './const';
import { getNodeList } from './fetch-node-versions';
import { getInstalledVersion } from './get-version';
import { logMessages } from './log-messages';

export const isNodeVersionLTS = (nodeList: INodeVersion[], usedNodeVersion: string) => {
	return nodeList.some((nodeVersion) => {
		return nodeVersion.version.slice(1) === usedNodeVersion && nodeVersion.lts !== false;
	});
};

export const getLTSNodeLog = async (usedNodeVersion: string) => {
	const nodeList = await getNodeList('lts');
	if (nodeList.error) {
		return { error: false, text: nodeList.text };
	}

	return isNodeVersionLTS(JSON.parse(nodeList.text), usedNodeVersion)
		? { error: false, text: logMessages.success.nodeVersionLTS(usedNodeVersion) }
		: { error: true, text: logMessages.error.nodeVersionNotLTSError(usedNodeVersion) };
};

export const getNodeLTSChecker = async () => {
	const usedNodeVersion: ILogMessage = await getInstalledVersion('node');
	return usedNodeVersion.error ? usedNodeVersion : getLTSNodeLog(usedNodeVersion.text);
};
