/// <reference types="@types/jest" />

jest.mock('execa');
jest.mock('node-fetch');
jest.mock('fs-extra');

import execa from 'execa';
import fetch from 'node-fetch';
import { logMessages } from '../src/log-messages';
import { getNodeSecurityChecker } from '../src/security';

const { Response } = jest.requireActual('node-fetch');


const exampleNodeList = [
	{ version: 'v12.14.0', date: '2019-12-16', npm: '6.13.4', security: true, lts: 'Erbium' },
	{ version: 'v14.7.0', date: '2020-07-29', npm: '6.14.7', security: false, lts: false },
];
const nodeVersionListURL = 'https://nodejs.org/dist/index.json';

describe('getNodeSecurityChecker', () => {
	it('should return success-text if Security version is used', async () => {
		(execa as any).mockReturnValue(Promise.resolve({ stdout: '12.14.0' }));
		(fetch as any).mockReturnValue(Promise.resolve(new Response(JSON.stringify(exampleNodeList))));
		expect(await getNodeSecurityChecker()).toMatchObject({
			error: false,
			text: logMessages.success.nodeVersionSecurity('12.14.0'),
		});
	});
	it('should return error-text if none Security version is used', async () => {
		(execa as any).mockReturnValue(Promise.resolve({ stdout: '14.7.0' }));
		(fetch as any).mockReturnValue(Promise.resolve(new Response(JSON.stringify(exampleNodeList))));
		expect(await getNodeSecurityChecker()).toMatchObject({
			error: true,
			text: logMessages.error.nodeVersionNotSecurityError('14.7.0'),
		});
	});
	it('should return warning-text if we can not receive node-list', async () => {
		(fetch as any).mockReturnValue(Promise.reject());
		expect(await getNodeSecurityChecker()).toMatchObject({
			error: false,
			text: logMessages.warning.fetchNodeListErrorNodeSecurity(nodeVersionListURL),
		});
	});
	it('should return error-text if we can not receive installed node version', async () => {
		(execa as any).mockReturnValue(Promise.reject());
		expect(await getNodeSecurityChecker()).toMatchObject({
			error: true,
			text: logMessages.error.readProgramVersionError('node'),
		});
	});
});
