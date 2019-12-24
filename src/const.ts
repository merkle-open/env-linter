// define cli api by using commander
export interface IOptions {
	cwd: string;
	versions?: string[];
	hooksInstalled?: boolean;
	saveExact?: boolean;
}

export interface IProgram {
	cwd?: string;
	versions?: string;
	hooksInstalled?: boolean;
	saveExact?: boolean;
	// commander
	rawArgs: string[];
	args: string[];
}

export interface INodeVersion {
	version: string;
	npm: string;
	date: string;
	security: boolean;
}

export interface ILogOutput {
	error: boolean;
	text: string;
}
