import path from 'path';
import fs from 'fs-extra';
import { logMessages } from './log-messages';

export const getFileData = async (filePath: string) => {
	const pathName = path.resolve(filePath);
	return (await fs.readFile(pathName, 'utf8')).trim();
};

export const getNodeVersionFromFile = async (file: string) => {
	try {
		return { error: false, text: await getFileData(file) };
	} catch (err) {
		return { error: true, text: logMessages.error.readNodeVersionFileError(file) };
	}
};
