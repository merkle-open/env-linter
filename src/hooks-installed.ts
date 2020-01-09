import { getFileData } from './get-file-data';
import { logMessages } from './log-messages';

export const isHookInstalled = async (pathName: string) => {
	try {
		const fileData = await getFileData(pathName);
		return typeof fileData === 'string';
	} catch (err) {
		return false;
	}
};

export const getHooksInstalledChecker = async () => {
	const hooksInstalled = await Promise.all([
		isHookInstalled('.git/hooks/commit-msg'),
		isHookInstalled('.git/hooks/pre-commit'),
	]);
	const areAllHooksInstalled = hooksInstalled.every((hookInstalled) => hookInstalled);
	return areAllHooksInstalled
		? { error: false, text: logMessages.success.gitHooksAreInstalled() }
		: { error: true, text: logMessages.error.gitHooksNotInstalledError() };
};
