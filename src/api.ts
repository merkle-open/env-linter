import chalk from 'chalk';
import { getCwd } from './get-cwd';
import { getVersionCheckers } from './version-checker';
import { getSaveExactChecker } from './save-exact';
import { IOptions, ILogMessage } from './const';
import { getHooksInstalledChecker } from './hooks-installed';

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
		const checkers: Promise<ILogMessage>[] = [];
		if (options.versions) {
			checkers.push(...(await getVersionCheckers(options.versions)));
		}
		if (options.hooksInstalled && process.env.NODE_ENV?.toLowerCase() !== 'ci') {
			checkers.push(getHooksInstalledChecker());
		}
		if (options.saveExact) {
			checkers.push(getSaveExactChecker());
		}

		const results = await Promise.all(checkers);
		const hasErrors = results.reduce((acc, result) => {
			console.info(result.text);
			return acc || result.error;
		}, false);
		if (hasErrors) {
			console.error(chalk.red('Stopping any further processes! process.exit(1)'));
			process.exit(1);
		}
	} catch (err) {
		console.error(chalk.red(err));
		process.exit(1);
	}
}
