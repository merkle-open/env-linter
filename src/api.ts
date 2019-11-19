/* eslint complexity: 0 */
import chalk from 'chalk';
import { getCwd } from './get-cwd';
import { IOptions } from './const';

export interface IApiOptions {
	cwd?: string;
	versions?: string[];
	hooksInstalled?: boolean;
	saveExact?: boolean;
}

export async function api(apiOptions: IApiOptions) {
	const cwd = await getCwd();
	const options: IOptions = {
		cwd,
		...apiOptions,
	};

	try {
		// do something
		console.log('options', options);
	} catch (err) {
		console.error(chalk.red(err));
		process.exit(1);
	}
}
