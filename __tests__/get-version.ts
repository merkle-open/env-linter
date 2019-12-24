/// <reference types="@types/jest" />

jest.mock('execa');
import execa from 'execa';

import { getInstalledVersion } from '../src/get-version';
import { logMessages } from '../src/log-messages';

describe('getInstalledVersion', () => {
	it('should return data from "node --version" which is "12.14.0"', async () => {
		(execa as any).mockReturnValue(Promise.resolve({ stdout: '12.14.0' }));
		expect(await getInstalledVersion('node')).toStrictEqual({ error: false, text: '12.14.0' });
	});
	it('should return data from "npm --version" which is "12.14.0"', async () => {
		(execa as any).mockReturnValue(Promise.resolve({ stdout: '6.1.0' }));
		expect(await getInstalledVersion('npm')).toStrictEqual({ error: false, text: '6.1.0' });
	});
	it('should return error-log if program is not installed', async () => {
		(execa as any).mockReturnValue(Promise.resolve({ stdout: '' }));
		expect(await getInstalledVersion('program')).toStrictEqual({
			error: true,
			text: logMessages.error.readProgramVersionError('program'),
		});
	});
});
