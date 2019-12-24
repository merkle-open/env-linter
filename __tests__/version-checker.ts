/// <reference types="@types/jest" />

jest.mock('execa');
jest.mock('node-fetch');
jest.mock('fs-extra');

import execa from 'execa';
import fetch from 'node-fetch';
import { readFile } from 'fs-extra';

const { Response } = jest.requireActual('node-fetch');

import { logMessages } from '../src/log-messages';
import {
	isNPMandNodeMatching,
	getNPMmatchesNodeLog,
	getValidVersionLog,
	getVersionCheckers,
} from '../src/version-checker';

const exampleNodeList = [{ version: 'v12.14.0', date: '2019-12-16', npm: '6.13.4', security: true }];
const nodeVersionListURL = 'https://nodejs.org/dist/index.json';

describe('isNPMandNodeMatching', () => {
	it('should return true when node and npm version match', async () => {
		expect(isNPMandNodeMatching(exampleNodeList, '12.14.0', '6.13.4')).toBeTruthy();
	});
	it('should return false when node and npm version do not match', async () => {
		expect(isNPMandNodeMatching(exampleNodeList, '12.14.0', '6.12.1')).toBeFalsy();
	});
});

describe('getNPMmatchesNodeLog', () => {
	it('should return the correct success-text', async () => {
		(fetch as any).mockReturnValue(Promise.resolve(new Response(JSON.stringify(exampleNodeList))));
		expect(await getNPMmatchesNodeLog('12.14.0', '6.13.4')).toBe(
			logMessages.success.nodeVersionWorksWithNPMVersion('12.14.0', '6.13.4')
		);
	});
	it('should return error-text when node and npm versions do not match', async () => {
		(fetch as any).mockReturnValue(Promise.resolve(new Response(JSON.stringify(exampleNodeList))));
		expect(await getNPMmatchesNodeLog('12.14.0', '6.0.0')).toBe(logMessages.error.changeNPMVersion('12.14.0'));
	});
	it('should return error-text if we can not receive node-list', async () => {
		(fetch as any).mockReturnValue(Promise.reject());
		expect(await getNPMmatchesNodeLog('12.14.0', '6.0.0')).toBe(
			logMessages.warning.fetchNodeListError(nodeVersionListURL)
		);
	});
});

describe('getValidVersionLog', () => {
	it('should return the correct success-text', async () => {
		expect(await getValidVersionLog('node', '12.14.0', '12.x.x')).toBe(
			logMessages.success.programVersionSatiesfies('node', '12.14.0', '12.x.x')
		);
	});
	it('should return the correct error-text', async () => {
		expect(await getValidVersionLog('node', '12.14.0', '10.x.x')).toBe(
			logMessages.error.changeProgramVersion('node', '12.14.0', '10.x.x')
		);
	});
});

describe('getVersionCheckers', () => {
	it('should return an array of 2 promises', async () => {
		(execa as any).mockReturnValue(Promise.resolve({ stdout: '' }));
		expect(await getVersionCheckers(['test'])).toStrictEqual([Promise.resolve(), Promise.resolve()]);
	});
	it('should return an array 2 of promises', async () => {
		(execa as any).mockReturnValue(Promise.resolve({ stdout: '' }));
		expect(await getVersionCheckers(['node=12.1.4'])).toStrictEqual([Promise.resolve(), Promise.resolve()]);
	});
	it('should return an array 3 of promises', async () => {
		expect(await getVersionCheckers(['node=12.1.4', 'npm=5.6.1'])).toStrictEqual([
			Promise.resolve(),
			Promise.resolve(),
			Promise.resolve(),
		]);
	});
	it('should return an array 3 of promises 2', async () => {
		(readFile as any).mockReturnValue(Promise.reject());
		expect(await getVersionCheckers(['node'])).toStrictEqual([Promise.resolve(), Promise.resolve()]);
	});
});
