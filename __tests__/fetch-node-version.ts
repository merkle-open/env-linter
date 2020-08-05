/// <reference types="@types/jest" />

jest.mock('node-fetch');
import fetch from 'node-fetch';

const { Response } = jest.requireActual('node-fetch');

import { logMessages } from '../src/log-messages';
import { getNodeList } from '../src/fetch-node-versions';

const exampleNodeList = [{ version: 'v12.14.0', date: '2019-12-16', npm: '6.13.4', security: true }];
const nodeVersionListURL = 'https://nodejs.org/dist/index.json';

describe('getNodeList', () => {
	it('should return fetched data', async () => {
		(fetch as any).mockReturnValue(Promise.resolve(new Response(JSON.stringify(exampleNodeList))));
		expect(await getNodeList('lts')).toMatchObject({ error: false, text: JSON.stringify(exampleNodeList) });
	});
	it('should return error-log if URL cannot be reached', async () => {
		(fetch as any).mockReturnValue(Promise.reject());
		expect(await getNodeList('lts')).toMatchObject({
			error: true,
			text: logMessages.warning.fetchNodeListErrorNodeLTS(nodeVersionListURL),
		});
	});
});
