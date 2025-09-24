import fs from 'fs-extra';

import { getFileData, getNodeVersionFromFile } from '../src/get-file-data';
import { logMessages } from '../src/log-messages';

vi.mock('fs-extra');

describe('getFileData', () => {
	it('should return file content', async () => {
		vi.spyOn(fs, 'readFile').mockResolvedValue('12.14.0');
		expect(await getFileData('.node-version')).toBe('12.14.0');
	});
});

describe('getNodeVersionFromFile', () => {
	it('should return node-version (12.14.0) from .node-version file.', async () => {
		vi.spyOn(fs, 'readFile').mockResolvedValue('12.14.0');
		expect(await getNodeVersionFromFile('.node-version')).toStrictEqual({ error: false, text: '12.14.0' });
	});
	it('should return error-log because .not-existing file does not exist', async () => {
		vi.spyOn(fs, 'readFile').mockReturnValue(Promise.reject());
		expect(await getNodeVersionFromFile('.not-existing')).toStrictEqual({
			error: true,
			text: logMessages.error.readNodeVersionFileError('.not-existing'),
		});
	});
});
