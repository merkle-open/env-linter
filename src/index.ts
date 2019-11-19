import chalk from 'chalk';
import { api } from './api';
import { fetchOptions } from './fetch-options';

export async function execute() {
	try {
		const options = await fetchOptions();
		await api(options);
	} catch (err) {
		console.error(chalk.red(err));
		process.exit(1);
	}
}

export * from './api';
