/// <reference types="@types/jest" />

jest.mock('fs-extra');
import { readFile } from 'fs-extra';

import { getHooksInstalledChecker, isHookInstalled } from '../src/hooks-installed';
import { logMessages } from '../src/log-messages';

describe('isHookInstalled', () => {
	it('should return true if hook is installed', async () => {
		(readFile as any).mockReturnValue(Promise.resolve('githook file content'));
		expect(await isHookInstalled('file')).toBeTruthy();
	});
	it('should return false if hook is not installed', async () => {
		(readFile as any).mockReturnValue(Promise.reject());
		expect(await isHookInstalled('file')).toBeFalsy();
	});
});

describe('getHooksInstalledChecker', () => {
	it('should return success-log if hooks are installed', async () => {
		(readFile as any).mockReturnValue(Promise.resolve('githook file content'));
		expect(await getHooksInstalledChecker()).toMatchObject({
			error: false,
			text: logMessages.success.gitHooksAreInstalled(),
		});
	});
	it('should return error-log if hooks are not installed', async () => {
		(readFile as any).mockReturnValue(Promise.reject());
		expect(await getHooksInstalledChecker()).toMatchObject({
			error: true,
			text: logMessages.error.gitHooksNotInstalledError(),
		});
	});
});
