/// <reference types="@types/jest" />

jest.mock('find-packages');
import findPackages from 'find-packages';

jest.mock('../src/get-cwd.ts');
import { getCwd } from '../src/get-cwd';

import {
	validateDependenciesVersionsAreExact,
	validatePackage,
	getExactDependencyVersionsChecker,
} from '../src/exact-dependency-versions';
import { logMessages } from '../src/log-messages';
import { IPackage } from '../src/const';

const TEST_CWD_VALUE = '/test-cwd/';
(getCwd as any).mockReturnValue(Promise.resolve(TEST_CWD_VALUE));

const fakePackageWithoutAnyDeps = ({
	name: 'fakeValidPackage',
} as any) as IPackage;

const fakeValidPackage = ({
	name: 'fakeValidPackage',
	dependencies: {
		react: '1.16.0',
	},
	devDependencies: {
		typescript: '3.7.0',
	},
} as any) as IPackage;

const fakeInvalidPackageWithoutName = ({
	dependencies: {
		react: '^1.16.0',
	},
	devDependencies: {
		typescript: '3.7.0',
	},
} as any) as IPackage;

const fakeInvalidPackage = ({
	name: 'fakeInvalidPackage',
	dependencies: {
		react: '^1.16.0',
		'react-dom': '~1.15.12',
	},
	devDependencies: {
		typescript: '~3.7.0',
		eslint: '^3.7.0',
	},
} as any) as IPackage;

const fakeMixedPackage = ({
	name: 'fakeMixedPackage',
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
} as any) as IPackage;

describe('exactDependencyVersions', () => {
	it('should return true if all (dev-)deps are installed by exact version', async () => {
		const { dependencies, devDependencies } = await validatePackage(fakeValidPackage);

		expect(dependencies.error).toEqual(false);
		expect(dependencies.text).toEqual(
			logMessages.success.allDependenciesExact('dependencies', fakeValidPackage.name)
		);
		expect(devDependencies.error).toEqual(false);
		expect(devDependencies.text).toEqual(
			logMessages.success.allDependenciesExact('devDependencies', fakeValidPackage.name)
		);
	});

	it('should return false and correct stack if all (dev-)deps are not installed by exact version', async () => {
		const { dependencies, devDependencies } = await validatePackage(fakeInvalidPackage);

		expect(dependencies.error).toEqual(true);
		expect(devDependencies.error).toEqual(true);

		expect(dependencies.invalidDefinitions).toHaveLength(2);
		expect(devDependencies.invalidDefinitions).toHaveLength(2);

		expect(dependencies.text).toContain('Not all dependencies in fakeInvalidPackage have been declared by exact');
		expect(dependencies.invalidDefinitions[0].text).toEqual(
			'[react] Approximate version identifier "^" is not allowed.'
		);
		expect(dependencies.invalidDefinitions[1].text).toEqual(
			'[react-dom] Approximate version identifier "~" is not allowed.'
		);
		expect(devDependencies.text).toContain(
			'Not all devDependencies in fakeInvalidPackage have been declared by exact'
		);
		expect(devDependencies.invalidDefinitions[0].text).toEqual(
			'[typescript] Approximate version identifier "~" is not allowed.'
		);
		expect(devDependencies.invalidDefinitions[1].text).toEqual(
			'[eslint] Approximate version identifier "^" is not allowed.'
		);
	});

	it('should return correct values for a mixed dependency versioning constellation', async () => {
		const { dependencies, devDependencies } = await validatePackage(fakeMixedPackage);

		expect(dependencies.error).toEqual(true);
		expect(devDependencies.error).toEqual(true);

		expect(dependencies.invalidDefinitions).toHaveLength(2);
		expect(devDependencies.invalidDefinitions).toHaveLength(2);

		expect(dependencies.invalidDefinitions[0].text).toEqual(
			'[core-js] Wildcard "*" is not allowed as version declaration.'
		);
		expect(dependencies.invalidDefinitions[1].text).toEqual(
			'[react-dom] Approximate version identifier "~" is not allowed.'
		);
		expect(devDependencies.invalidDefinitions[0].text).toEqual(
			'[webpack] Approximate version identifier "~" is not allowed.'
		);
		expect(devDependencies.invalidDefinitions[1].text).toEqual(
			'[forever] Tarball dependencies are not allowed (https://github.com/indexzero/forever/tarball/v0.5.6).'
		);
	});

	describe('validateDependenciesVersionsAreExact', () => {
		it('should work for a package without any deps', async () => {
			(findPackages as any).mockReturnValue(Promise.resolve([{ manifest: fakePackageWithoutAnyDeps }]));
			const res = await validateDependenciesVersionsAreExact('./');
			expect(res.length).toEqual(1);
			expect(res[0].dependencies.error).toBeFalsy();
			expect(res[0].devDependencies.error).toBeFalsy();
		});
		it('should work for one invalid package without name (using "package")', async () => {
			(findPackages as any).mockReturnValue(Promise.resolve([{ manifest: fakeInvalidPackageWithoutName }]));
			const res = await validateDependenciesVersionsAreExact('./');
			expect(res.length).toEqual(1);
			expect(res[0].dependencies.error).toBeTruthy();
			expect(res[0].devDependencies.error).toBeFalsy();
			expect(res[0].dependencies.text).toContain('package');
		});
		it('should work for one valid package (ordinary repo)', async () => {
			(findPackages as any).mockReturnValue(Promise.resolve([{ manifest: fakeValidPackage }]));
			const res = await validateDependenciesVersionsAreExact('./');
			expect(res.length).toEqual(1);
			expect(res[0].dependencies.error).toBeFalsy();
			expect(res[0].devDependencies.error).toBeFalsy();
		});
		it('should work for mixed multi packages (monorepo)', async () => {
			(findPackages as any).mockReturnValue(
				Promise.resolve([{ manifest: fakeValidPackage }, { manifest: fakeMixedPackage }])
			);
			const res = await validateDependenciesVersionsAreExact('./');
			expect(res.length).toEqual(2);
			expect(res[1].dependencies.error).toBeTruthy();
			expect(res[1].devDependencies.error).toBeTruthy();
		});
	});

	describe('getExactDependencyVersionsChecker', () => {
		it('should output the correct data for no packages', async () => {
			(findPackages as any).mockReturnValue(Promise.resolve([]));
			const { error, text } = await getExactDependencyVersionsChecker();

			expect(error).toEqual(true);
			expect(text).toEqual(logMessages.error.noPackagesFoundError(TEST_CWD_VALUE));
		});

		it('should output the correct data for valid package', async () => {
			(findPackages as any).mockReturnValue(Promise.resolve([{ manifest: fakeValidPackage }]));
			const { error, text } = await getExactDependencyVersionsChecker();

			expect(error).toEqual(false);
			expect(text).toEqual(
				[
					logMessages.success.allDependenciesExact('dependencies', fakeValidPackage.name),
					logMessages.success.allDependenciesExact('devDependencies', fakeValidPackage.name),
				].join('\n')
			);
		});

		it('should output the correct data for invalid package', async () => {
			(findPackages as any).mockReturnValue(Promise.resolve([{ manifest: fakeInvalidPackage }]));
			const { error, text } = await getExactDependencyVersionsChecker();

			expect(error).toEqual(true);
			expect(text).toBeTruthy();
		});

		it('should output the correct data for mixed package', async () => {
			(findPackages as any).mockReturnValue(Promise.resolve([{ manifest: fakeMixedPackage }]));
			const { error, text } = await getExactDependencyVersionsChecker();

			expect(error).toEqual(true);
			expect(text).toBeTruthy();
		});
	});
});
