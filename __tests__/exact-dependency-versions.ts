/// <reference types="@types/jest" />

jest.mock('fs-extra');
import { readFile } from 'fs-extra';

import {
	validateDependenciesVersionsAreExact,
	getExactDependencyVersionsChecker,
} from '../src/exact-dependency-versions';
import { logMessages } from '../src/log-messages';

const fakeValidPackage = {
	dependencies: {
		react: '1.16.0',
	},
	devDependencies: {
		typescript: '3.7.0',
	},
};

const fakeInvalidPackage = {
	dependencies: {
		react: '^1.16.0',
		'react-dom': '~1.15.12',
	},
	devDependencies: {
		typescript: '~3.7.0',
		eslint: '^3.7.0',
	},
};

const fakeMixedPackage = {
	dependencies: {
		'core-js': '*',
		react: '1.16.0',
		'react-dom': '~1.15.12',
	},
	devDependencies: {
		typescript: '3.7.0',
		webpack: '~4',
		forever: 'https://github.com/indexzero/forever/tarball/v0.5.6',
	},
};

describe('exactDependencyVersions', () => {
	it('should return true if all (dev-)deps are installed by exact version', async () => {
		(readFile as any).mockReturnValue(Promise.resolve(JSON.stringify(fakeValidPackage)));
		const { dependencies, devDependencies } = await validateDependenciesVersionsAreExact();

		expect(dependencies.error).toEqual(false);
		expect(dependencies.text).toEqual(logMessages.success.allDependenciesExact('dependencies'));
		expect(devDependencies.error).toEqual(false);
		expect(devDependencies.text).toEqual(logMessages.success.allDependenciesExact('devDependencies'));
	});

	it('should return false and correct stack if all (dev-)deps are not installed by exact version', async () => {
		(readFile as any).mockReturnValue(Promise.resolve(JSON.stringify(fakeInvalidPackage)));
		const { dependencies, devDependencies } = await validateDependenciesVersionsAreExact();

		expect(dependencies.error).toEqual(true);
		expect(devDependencies.error).toEqual(true);

		expect(dependencies.invalidDefinitions).toHaveLength(2);
		expect(devDependencies.invalidDefinitions).toHaveLength(2);

		expect(dependencies.text).toContain('Not all dependencies have been declared by exact');
		expect(dependencies.invalidDefinitions[0].text).toEqual(
			'[react] Approximate version identifier "^" is not allowed'
		);
		expect(dependencies.invalidDefinitions[1].text).toEqual(
			'[react-dom] Approximate version identifier "~" is not allowed'
		);
		expect(devDependencies.text).toContain('Not all devDependencies have been declared by exact');
		expect(devDependencies.invalidDefinitions[0].text).toEqual(
			'[typescript] Approximate version identifier "~" is not allowed'
		);
		expect(devDependencies.invalidDefinitions[1].text).toEqual(
			'[eslint] Approximate version identifier "^" is not allowed'
		);
	});

	it('should return correct values for a mixed dependency versioning constellation', async () => {
		(readFile as any).mockReturnValue(Promise.resolve(JSON.stringify(fakeMixedPackage)));
		const { dependencies, devDependencies } = await validateDependenciesVersionsAreExact();

		expect(dependencies.error).toEqual(true);
		expect(devDependencies.error).toEqual(true);

		expect(dependencies.invalidDefinitions).toHaveLength(2);
		expect(devDependencies.invalidDefinitions).toHaveLength(2);

		expect(dependencies.invalidDefinitions[0].text).toEqual(
			'[core-js] Wildcard "*" is not allowed as version declaration'
		);
		expect(dependencies.invalidDefinitions[1].text).toEqual(
			'[react-dom] Approximate version identifier "~" is not allowed'
		);
		expect(devDependencies.invalidDefinitions[0].text).toEqual(
			'[webpack] Approximate version identifier "~" is not allowed'
		);
		expect(devDependencies.invalidDefinitions[1].text).toEqual(
			'[forever] Tarball dependencies are not allowed (https://github.com/indexzero/forever/tarball/v0.5.6)'
		);
	});

	describe('getExactDependencyVersionsChecker', () => {
		it('should output the correct data for empty package', async () => {
			(readFile as any).mockReturnValue(Promise.resolve('{}'));
			const { error, text } = await getExactDependencyVersionsChecker();

			expect(error).toEqual(false);
			expect(text).toEqual(
				[
					logMessages.success.allDependenciesExact('dependencies'),
					logMessages.success.allDependenciesExact('devDependencies'),
				].join('\n')
			);
		});

		it('should output the correct data for valid package', async () => {
			(readFile as any).mockReturnValue(Promise.resolve(JSON.stringify(fakeValidPackage)));
			const { error, text } = await getExactDependencyVersionsChecker();

			expect(error).toEqual(false);
			expect(text).toEqual(
				[
					logMessages.success.allDependenciesExact('dependencies'),
					logMessages.success.allDependenciesExact('devDependencies'),
				].join('\n')
			);
		});

		it('should output the correct data for invalid package', async () => {
			(readFile as any).mockReturnValue(Promise.resolve(JSON.stringify(fakeInvalidPackage)));
			const { error, text } = await getExactDependencyVersionsChecker();

			expect(error).toEqual(true);
			expect(text).toBeTruthy();
		});

		it('should output the correct data for mixed package', async () => {
			(readFile as any).mockReturnValue(Promise.resolve(JSON.stringify(fakeMixedPackage)));
			const { error, text } = await getExactDependencyVersionsChecker();

			expect(error).toEqual(true);
			expect(text).toBeTruthy();
		});
	});
});
