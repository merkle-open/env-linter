import chalk from 'chalk';
import { isCI } from 'ci-info';
import { getCwd } from './get-cwd';
import { getVersionCheckers } from './version-checker';
import { getSaveExactChecker } from './save-exact';
import { IOptions, ILogMessage } from './const';
import { getHooksInstalledChecker } from './hooks-installed';
import { splitVersions } from './fetch-options';
import { getExactDependencyVersionsChecker } from './exact-dependency-versions';

export interface IApiOptions {
	cwd?: string;
	versions?: string[];
	hooksInstalled?: boolean;
	saveExact?: boolean;
	dependenciesExactVersion?: boolean;
}

export async function api(apiOptions: IApiOptions) {
	const cwd = await getCwd();
	const NOT_RUNNING_IN_CI = !isCI;
	const options: IOptions = {
		cwd,
		versions: splitVersions(apiOptions.versions),
		hooksInstalled: apiOptions.hooksInstalled,
		saveExact: apiOptions.saveExact,
		dependenciesExactVersion: apiOptions.dependenciesExactVersion,
	};

	try {
		const checkers: Promise<ILogMessage>[] = [];

		if (options.versions) {
			checkers.push(...(await getVersionCheckers(options.versions)));
		}

		if (options.hooksInstalled && NOT_RUNNING_IN_CI) {
			checkers.push(getHooksInstalledChecker());
		}

		if (options.saveExact && NOT_RUNNING_IN_CI) {
			checkers.push(getSaveExactChecker());
		}

		if (options.dependenciesExactVersion && NOT_RUNNING_IN_CI) {
			checkers.push(getExactDependencyVersionsChecker());
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
		process.exit(2);
	}
}
