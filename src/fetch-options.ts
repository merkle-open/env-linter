import { Command } from 'commander';
import { getCwd } from './get-cwd';
import { IProgram, IOptions } from './const';

async function transformAnswersToOptions({ versions, hooksInstalled, saveExact }: IProgram): Promise<IOptions> {
	const cwd = await getCwd();
	const hasVersionsArg = versions ? [] : undefined;
	return {
		cwd,
		versions: typeof versions === 'string' ? versions.split(',') : hasVersionsArg,
		hooksInstalled,
		saveExact,
	};
}

export async function fetchOptions(): Promise<IOptions> {
	// eslint-disable-next-line
	const packageData = require('../package.json');

	const pg = (new Command()
		.version(packageData.version)
		.option('-vs, --versions [string]', 'version of global packages eg. node, npm, ...')
		.option('-h, --hooksInstalled', 'check for hooks are installed, failes if not')
		.option('-s, --saveExact', 'check for npm save-exact enabled, failes if not')
		.parse(process.argv) as any) as IProgram;

	return await transformAnswersToOptions(pg);
}
