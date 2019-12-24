import fetch from 'node-fetch';
import { logMessages } from './log-messages';

export const getNodeList = async () => {
	const nodeVersionListURL = `https://nodejs.org/dist/index.json`;
	try {
		const data = await fetch(nodeVersionListURL);
		return { error: false, text: await data.text() };
	} catch (err) {
		return { error: true, text: logMessages.warning.fetchNodeListError(nodeVersionListURL) };
	}
};
