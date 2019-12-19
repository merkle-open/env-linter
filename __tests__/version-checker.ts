/// <reference types="@types/jest" />

jest.mock('execa');
import execa from 'execa';
import {
	isValidVersion,
	getNodeVersionFromFile,
	getInstalledVersion,
	getFileData,
	checkNPMmatchesNode,
	isNPMandNodeMatching,
} from '../src/version-checker';

describe('isValidVersion', () => {
	it('should not be valid version if the major node version is different', () => {
		expect(isValidVersion('12', '8')).toBeFalsy();
	});
	it('should be valid version if the version matches exactly', () => {
		expect(isValidVersion('12.13.1', '12.13.1')).toBeTruthy();
	});
	it('should be valid version if the major node version matches and minor/patch are x', () => {
		expect(isValidVersion('12.13.1', '12.x.x')).toBeTruthy();
	});
	it('should be valid version if the required version is >=10', () => {
		expect(isValidVersion('12.13.1', '>=10')).toBeTruthy();
	});
});

describe('getNodeVersionFromFile', () => {
	it('should return data from .node-version which is "12.13.0"', async () => {
		expect(await getNodeVersionFromFile()).toBe('12.13.0');
	});
});

describe('getInstalledVersion', () => {
	it('should return data from "node --version" which is "12.13.0"', async () => {
		(execa as any).mockImplementation(async () => ({ stdout: '12.13.0' }));
		expect(await getInstalledVersion('node')).toBe('12.13.0');
	});
	// it('should return nothing if node is not installed', async () => {
	// 	// TODO: fix test
	// 	(execa as any).mockReturnValue(Promise.reject({stdout: 'command not found'}));
	// 	expect(await getInstalledVersion('program' as 'node')).toBe('command not found');
	// });
});

describe('isNPMandNodeMatching', () => {
	it('should return true when node and npm version match', async () => {
		expect(await isNPMandNodeMatching('12.13.0', '6.12.0')).toBeTruthy();
		expect(await isNPMandNodeMatching('10.16.3', '6.9.0')).toBeTruthy();
		expect(await isNPMandNodeMatching('8.16.2', '6.4.1')).toBeTruthy();
	});

	it('should return false when node and npm version do not match', async () => {
		expect(await isNPMandNodeMatching('12.13.0', '6.12.1')).toBeFalsy();
		expect(await isNPMandNodeMatching('10.16.3', '6.4.1')).toBeFalsy();
		expect(await isNPMandNodeMatching('8.16.2', '5.6.0')).toBeFalsy();
		expect(await isNPMandNodeMatching('8.16.2', '')).toBeFalsy();
		expect(await isNPMandNodeMatching('', '')).toBeFalsy();
	});
});
