/* eslint complexity: 0 */
import chalk from 'chalk';
import { getCwd } from './get-cwd';
import { checkVersions } from './version-checker';
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
		console.log('options', options);
		checkVersions(options.versions);
		// TODO: rethink control-flow
		// call check-function for each apiOption (e. g. versions, save-exact, ...)
		// collect promises of those check-functions and wait with Promise.all
		// console.error all rejected promises and process.exit(1)
		// if all promise resolve, console.log all success messages
	} catch (err) {
		console.error(chalk.red(err));
		process.exit(1);
	}
}
