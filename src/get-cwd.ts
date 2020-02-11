import fs from 'fs-extra';

export async function getCwd() {
	return await fs.realpath(process.cwd());
}
