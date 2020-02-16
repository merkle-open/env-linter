// define cli api by using commander
export interface IOptions {
	cwd: string;
	versions?: string[];
	hooksInstalled?: boolean;
	saveExact?: boolean;
	dependenciesExactVersion?: boolean;
}

export interface IProgram {
	cwd?: string;
	versions?: string;
	hooksInstalled?: boolean;
	saveExact?: boolean;
	dependenciesExactVersion?: boolean;
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

export interface ILogMessage {
	error: boolean;
	text: string;
}

export interface IPackage {
	name: string;
	version: string;
	scripts?: Record<string, string>;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
}

export type PackageDependencyKeys = 'dependencies' | 'devDependencies';
