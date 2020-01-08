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
	getNPMmatchesNodeLog,
	getValidVersionLog,
	getVersionCheckers,
	isNPMandNodeMatching,
	processVersionArgument,
} from '../src/version-checker';
import { ILogMessage } from '../src/const';

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
		expect(await getNPMmatchesNodeLog('12.14.0', '6.13.4')).toMatchObject({
			error: false,
			text: logMessages.success.nodeVersionWorksWithNPMVersion('12.14.0', '6.13.4'),
		});
	});
	it('should return error-text when node and npm versions do not match', async () => {
		(fetch as any).mockReturnValue(Promise.resolve(new Response(JSON.stringify(exampleNodeList))));
		expect(await getNPMmatchesNodeLog('12.14.0', '6.0.0')).toMatchObject({
			error: true,
			text: logMessages.error.changeNPMVersion('12.14.0'),
		});
	});
	it('should return error-text if we can not receive node-list', async () => {
		(fetch as any).mockReturnValue(Promise.reject());
		expect(await getNPMmatchesNodeLog('12.14.0', '6.0.0')).toMatchObject({
			error: false,
			text: logMessages.warning.fetchNodeListError(nodeVersionListURL),
		});
	});
});

describe('getValidVersionLog', () => {
	it('should return the correct success-text', async () => {
		expect(await getValidVersionLog('node', '12.14.0', '12.x.x')).toMatchObject({
			error: false,
			text: logMessages.success.programVersionSatisfies('node', '12.14.0', '12.x.x'),
		});
	});
	it('should return the correct error-text', async () => {
		expect(await getValidVersionLog('node', '12.14.0', '10.x.x')).toMatchObject({
			error: true,
			text: logMessages.error.changeProgramVersion('node', '12.14.0', '10.x.x'),
		});
	});
});

describe('processVersionArgument', () => {
	it('should return the node version', async () => {
		(execa as any).mockReturnValue(Promise.resolve({ stdout: '12.14.0' }));
		expect(await processVersionArgument('node=12.14.0')).toMatchObject({
			error: false,
			text: logMessages.success.programVersionSatisfies('node', '12.14.0', '12.14.0'),
		});
	});
	it('should return the node version from .node-version file', async () => {
		(readFile as any).mockReturnValue(Promise.resolve('10.0.0'));
		(execa as any).mockReturnValue(Promise.resolve({ stdout: '10.0.0' }));
		expect(await processVersionArgument('node')).toMatchObject({
			error: false,
			text: logMessages.success.programVersionSatisfies('node', '10.0.0', '10.0.0'),
		});
	});
	it('should return the yo version', async () => {
		(execa as any).mockReturnValue(Promise.resolve({ stdout: '3.0.0' }));
		expect(await processVersionArgument('yo=3.x.x')).toMatchObject({
			error: false,
			text: logMessages.success.programVersionSatisfies('yo', '3.0.0', '3.x.x'),
		});
	});
	it('should return a warning for not specifying a yo version', async () => {
		(execa as any).mockReturnValue(Promise.resolve({ stdout: '3.0.0' }));
		expect(await processVersionArgument('yo')).toMatchObject({
			error: false,
			text: logMessages.warning.specifyProgramVersion('yo', '3.0.0'),
		});
	});
});

describe('getVersionCheckers', () => {
	it('should resolve two checker promises (specify yo version and npm works with node).', async () => {
		(fetch as any).mockReturnValue(
			Promise.resolve(new Response(JSON.stringify([{ version: 'v3.0.0', npm: '3.0.0' }])))
		);
		(execa as any).mockReturnValue(Promise.resolve({ stdout: '3.0.0' }));
		(readFile as any).mockReturnValue(Promise.resolve('3.0.0'));
		const expectedLogMessages: ILogMessage[] = [
			{ error: false, text: logMessages.warning.specifyProgramVersion('yo', '3.0.0') },
			{ error: false, text: logMessages.success.nodeVersionWorksWithNPMVersion('3.0.0', '3.0.0') },
		];
		const checkers = await getVersionCheckers(['yo']);
		expect(await Promise.all(checkers)).toMatchObject(expectedLogMessages);
	});
	it('should resolve two checker promises (node version ok and npm works with node)', async () => {
		(fetch as any).mockReturnValue(
			Promise.resolve(new Response(JSON.stringify([{ version: 'v3.0.0', npm: '3.0.0' }])))
		);
		(execa as any).mockReturnValue(Promise.resolve({ stdout: '3.0.0' }));
		const expectedLogMessages: ILogMessage[] = [
			{ error: false, text: logMessages.success.programVersionSatisfies('node', '3.0.0', '3.x.x') },
			{ error: false, text: logMessages.success.programVersionSatisfies('npm', '3.0.0', '3.x.x') },
			{ error: false, text: logMessages.success.nodeVersionWorksWithNPMVersion('3.0.0', '3.0.0') },
		];
		const checkers = await getVersionCheckers(['node=3.x.x', 'npm=3.x.x']);
		expect(await Promise.all(checkers)).toMatchObject(expectedLogMessages);
	});
});
