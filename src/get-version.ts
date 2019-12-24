import execa from 'execa';
import { logMessages } from './log-messages';

export const getInstalledVersion = async (program: string) => {
	const version = await execa(program, ['--version']);
	return version.stdout
		? { error: false, text: version.stdout.replace(/v/, '').trim() }
		: { error: true, text: logMessages.error.readProgramVersionError(program) };
};
