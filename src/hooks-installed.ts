import { getFileData } from './get-file-data';
import { logMessages } from './log-messages';
import { getGitRoot } from './get-git-root';

export const isHookInstalled = async (pathName: string) => {
	try {
		const fileData = await getFileData(pathName);
		return typeof fileData === 'string';
	} catch (err) {
		return false;
	}
};

export const getHooksInstalledChecker = async () => {
	const gitRootDirectory = await getGitRoot();
	if (gitRootDirectory.error) {
		return gitRootDirectory;
	}
	const husky4HooksInstalled = await Promise.all([
		isHookInstalled(`${gitRootDirectory.text}/.git/hooks/commit-msg`),
		isHookInstalled(`${gitRootDirectory.text}/.git/hooks/pre-commit`),
	]);
	const husky6HooksInstalled = await Promise.all([
		isHookInstalled(`${gitRootDirectory.text}/.husky/commit-msg`),
		isHookInstalled(`${gitRootDirectory.text}/.husky/pre-commit`),
	]);
	const areAllHooksInstalled =
		husky4HooksInstalled.every((hookInstalled) => hookInstalled) ||
		husky6HooksInstalled.every((hookInstalled) => hookInstalled);
	return areAllHooksInstalled
		? { error: false, text: logMessages.success.gitHooksAreInstalled() }
		: { error: true, text: logMessages.error.gitHooksNotInstalledError() };
};
