/// <reference types="@types/jest" />

jest.mock('fs-extra');
import { readFile } from 'fs-extra';

import { getFileData, getNodeVersionFromFile } from '../src/get-file-data';
import { logMessages } from '../src/log-messages';

describe('getFileData', () => {
	it('should return file content', async () => {
		(readFile as any).mockReturnValue(Promise.resolve('12.14.0'));
		expect(await getFileData('.node-version')).toBe('12.14.0');
	});
});

describe('getNodeVersionFromFile', () => {
	it('should return node-version (12.14.0) from .node-version file.', async () => {
		(readFile as any).mockReturnValue(Promise.resolve('12.14.0'));
		expect(await getNodeVersionFromFile('.node-version')).toStrictEqual({ error: false, text: '12.14.0' });
	});
	it('should return error-log because .not-existing file does not exist', async () => {
		(readFile as any).mockReturnValue(Promise.reject());
		expect(await getNodeVersionFromFile('.not-existing')).toStrictEqual({
			error: true,
			text: logMessages.error.readNodeVersionFileError('.not-existing'),
		});
	});
});
