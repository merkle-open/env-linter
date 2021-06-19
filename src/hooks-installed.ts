import { sync } from 'glob';
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

export const areAllHooksInstalled = async (gitRootDirectory: string) => {
	const husky4HooksInstalled = await Promise.all([
		isHookInstalled(`${gitRootDirectory}/.git/hooks/commit-msg`),
		isHookInstalled(`${gitRootDirectory}/.git/hooks/pre-commit`),
	]);
	const husky6gitignorePath = `${gitRootDirectory}/${sync('**/.husky/.gitignore')}`;
	const husky6HooksInstalled = await isHookInstalled(husky6gitignorePath);
	return husky6HooksInstalled ||
		husky4HooksInstalled.every((hookInstalled) => hookInstalled);
};

export const getHooksInstalledChecker = async () => {
	const gitRootDirectory = await getGitRoot();
	if (gitRootDirectory.error) {
		return gitRootDirectory;
	}
	return await areAllHooksInstalled(gitRootDirectory.text)
		? { error: false, text: logMessages.success.gitHooksAreInstalled() }
		: { error: true, text: logMessages.error.gitHooksNotInstalledError() };
};
