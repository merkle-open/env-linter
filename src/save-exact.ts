import execa from 'execa';
import { logMessages } from './log-messages';

export const getSaveExact = async () => {
	try {
		const saveExact = await execa.command('npm config get save-exact');
		return saveExact.stdout
			? { error: false, text: saveExact.stdout.replace(/v/, '').trim() }
			: { error: true, text: logMessages.error.readProgramVersionError('npm/node') };
	} catch (err) {
		return { error: true, text: logMessages.error.readProgramVersionError('npm/node') };
	}
};

export const getSaveExactChecker = async () => {
	const isSaveExact = getSaveExact();
	return (await isSaveExact).text === 'true'
		? { error: false, text: logMessages.success.saveExactIsOn() }
		: { error: true, text: logMessages.error.saveExactIsOffError() };
};
