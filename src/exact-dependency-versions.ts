import findPackages from 'find-packages';
import { logMessages } from './log-messages';
import { getCwd } from './get-cwd';
import { PackageDependencyKeys, ILogMessage, IPackage, IProject } from './const';

export interface IVersionValidationResult {
	error: boolean;
	text?: string;
}

export interface IDetailedVersionValidationResult extends IVersionValidationResult {
	invalidDefinitions: IVersionValidationResult[];
}

export interface IPackageValidationResult {
	dependencies: IDetailedVersionValidationResult;
	devDependencies: IDetailedVersionValidationResult;
}

/**
 * Checks if a version definition is valid compared to our exact ruleset
 * @param {string} version The version as plain string extracted from the package, eg. ^1.2.0
 * @returns {IVersionValidationResult} Validation result
 */
const validateVersion = (version: string): IVersionValidationResult => {
	const [leadChar] = version;

	// Star wildcard is not allowed at all
	if (version === '*') {
		return {
			error: true,
			text: logMessages.error.versionDefinition.starWildcard(),
		};
	}

	// Approximate definitions are not allowed, eg. ^1.2.0 or ~9.2.72
	if (leadChar === '~' || leadChar === '^') {
		return {
			error: true,
			text: logMessages.error.versionDefinition.approximate(leadChar),
		};
	}

	// Tarball embedds are not allowed, eg. https://github.com/indexzero/forever/tarball/v0.5.6
	if (version.indexOf('http') > -1) {
		return {
			error: true,
			text: logMessages.error.versionDefinition.tarball(version),
		};
	}

	return { error: false };
};

/**
 * Checks a single dependency record and its entries against the definition rules
 * @param {string?} pkgName The package name
 * @param {PackageDependencyKeys} type Named dependency field type
 * @param {Record<string, string>} deps Dependency records
 * @returns {IVersionValidationResult} Validation result
 */
const validateDependenciesRecord = (
	pkgName = 'package',
	type: PackageDependencyKeys,
	deps: Record<string, string> = {}
): IDetailedVersionValidationResult => {
	const validationResults = Object.keys(deps).map((dep) => {
		const validationResult = validateVersion(deps[dep]);

		return {
			error: validationResult.error,
			text: validationResult.text ? `[${dep}] ${validationResult.text}` : undefined,
		};
	});

	// Aggregate combined results of all validations
	const invalidDefinitions = validationResults.filter((result) => result.error === true);
	const errorStack = invalidDefinitions.map((validation) => `\n\t- ${validation.text}`).join('');

	return invalidDefinitions.length === 0
		? { error: false, text: logMessages.success.allDependenciesExact(type), invalidDefinitions }
		: { error: true, text: logMessages.error.allDependenciesExact(type, pkgName, errorStack), invalidDefinitions };
};

/**
 * Wrapper to validate a complete package which calls other internal methods
 * @param {IPackage | IProject} pkgOrProject The package or project
 * @returns {IPackageValidationResult} The validation results
 */
export const validatePackage = (pkgOrProject: IPackage | IProject): IPackageValidationResult => {
	const pkg = 'manifest' in pkgOrProject ? pkgOrProject.manifest : pkgOrProject;

	return {
		dependencies: validateDependenciesRecord(pkg.name, 'dependencies', pkg.dependencies),
		devDependencies: validateDependenciesRecord(pkg.name, 'devDependencies', pkg.devDependencies),
	};
};

/**
 * Searches all package.json's from the passed CWD and validates them
 * @param {string} cwd The current working directory
 * @returns {IPackageValidationResult[]} The validation results
 */
export const validateDependenciesVersionsAreExact = async (cwd: string) => {
	const pkgs = await findPackages(cwd, {
		includeRoot: true,
		ignore: [],
	});

	return pkgs.map((pkg) => validatePackage(pkg));
};

export const getExactDependencyVersionsChecker = async (): Promise<ILogMessage> => {
	const cwd = await getCwd();
	const validations = await validateDependenciesVersionsAreExact(cwd);

	if (validations.length === 0) {
		return {
			error: true,
			text: logMessages.error.noPackagesFound(cwd),
		};
	}

	const aggregatedValidations = validations.map(({ dependencies, devDependencies }) => ({
		error: dependencies.error || devDependencies.error,
		text: [dependencies.text, devDependencies.text].filter(Boolean).join('\n'),
	}));
	const error = aggregatedValidations.some((validation) => validation.error === true);
	const text = aggregatedValidations
		.map((validation) => validation.text)
		.filter(Boolean)
		.join('\n');

	return {
		error,
		text,
	};
};
