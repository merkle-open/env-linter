/// <reference types="@types/jest" />
import { fetchOptions } from '../src/fetch-options';

describe('fetch-options', () => {
	it('default', async () => {
		global.process.argv = [
			'/usr/local/bin/node',
			'/usr/local/bin/env-linter',
			'--versions=node=12.13.0,npm=6.4.1',
			'--hooksInstalled',
			'--saveExact',
		];
		const options = await fetchOptions();
		delete options.cwd;
		expect(options).toEqual({
			versions: ['node=12.13.0', 'npm=6.4.1'],
			hooksInstalled: true,
			saveExact: true,
		});
	});
	it('with empty versions', async () => {
		global.process.argv = [
			'/usr/local/bin/node',
			'/usr/local/bin/env-linter',
			'--versions',
			'--hooksInstalled',
			'--saveExact',
		];
		const options = await fetchOptions();
		delete options.cwd;
		expect(options).toEqual({
			hooksInstalled: true,
			saveExact: true,
		});
	});
	it('without versions and hooksInstalled', async () => {
		global.process.argv = ['/usr/local/bin/node', '/usr/local/bin/env-linter', '--saveExact'];
		const options = await fetchOptions();
		delete options.cwd;
		expect(options).toEqual({
			saveExact: true,
		});
	});
});
