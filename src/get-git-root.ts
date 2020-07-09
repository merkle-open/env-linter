import execa from 'execa';
import { logMessages } from './log-messages';

export const getGitRoot = async () => {
	try {
		const gitRootDirectory = await execa('git', ['rev-parse', '--show-toplevel']);
		return gitRootDirectory.stdout
			? { error: false, text: gitRootDirectory.stdout.trim() }
			: { error: true, text: logMessages.error.readGitRootError() };
	} catch (err) {
		return { error: true, text: logMessages.error.readGitRootError() };
	}
};
