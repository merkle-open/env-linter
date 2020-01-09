/// <reference types="@types/jest" />

jest.mock('execa');
import execa from 'execa';

import { getSaveExact, getSaveExactChecker } from '../src/save-exact';
import { logMessages } from '../src/log-messages';

describe('getSaveExact', () => {
	it('should return true if save-exact is set to true', async () => {
		(execa.command as any).mockReturnValue(Promise.resolve({ stdout: 'true' }));
		expect(await getSaveExact()).toMatchObject({ error: false, text: 'true' });
	});
	it('should return false if save-exact is set to false', async () => {
		(execa.command as any).mockReturnValue(Promise.resolve({ stdout: 'false' }));
		expect(await getSaveExact()).toMatchObject({ error: false, text: 'false' });
	});
	it('should return false if save-exact is set to false', async () => {
		(execa.command as any).mockReturnValue(Promise.resolve({ stdout: '' }));
		expect(await getSaveExact()).toMatchObject({
			error: true,
			text: logMessages.error.readProgramVersionError('npm/node'),
		});
	});
	it('should return the error message that npm/node is not installed', async () => {
		(execa.command as any).mockReturnValue(Promise.reject());
		expect(await getSaveExact()).toMatchObject({
			error: true,
			text: logMessages.error.readProgramVersionError('npm/node'),
		});
	});
});

describe('getSaveExactChecker', () => {
	it('should return success-log message when save-exact is set to true', async () => {
		(execa.command as any).mockReturnValue(Promise.resolve({ stdout: 'true' }));
		expect(await getSaveExactChecker()).toMatchObject({ error: false, text: logMessages.success.saveExactIsOn() });
	});
	it('should return error-log message when save-exact is set to false', async () => {
		(execa.command as any).mockReturnValue(Promise.resolve({ stdout: 'false' }));
		expect(await getSaveExactChecker()).toMatchObject({
			error: true,
			text: logMessages.error.saveExactIsOffError(),
		});
	});
});
