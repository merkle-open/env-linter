import chalk from 'chalk';
import { getCwd } from './get-cwd';
import { getVersionCheckers } from './version-checker';
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
		const linter: Promise<string>[] = [];
		if (options.versions) {
			linter.push(...(await getVersionCheckers(options.versions)));
		}
		if (options.hooksInstalled && process.env.NODE_ENV?.toLowerCase() !== 'ci') {
			// linter.push(checkHooksInstalledChecker());
		}
		if (options.saveExact) {
			// linter.push(getSaveExactChecker());
		}
		linter.forEach(async (lint) => console.log(await lint));
	} catch (err) {
		console.error(chalk.red(err));
		process.exit(1);
	}
}
