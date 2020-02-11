import { getFileData } from './get-file-data';
import { logMessages } from './log-messages';
import { IPackage, PackageDependencyKeys, ILogMessage } from './const';

export interface IVersionValidationResult {
	error: boolean;
	text?: string;
}

/**
 * Checks if a version definition is valid compared to our exact ruleset
 * @param {string} v					The version as plain string extracted from the package, eg. ^1.2.0
 * @returns {IVersionValidationResult}	Validation result
 */
const validateVersion = (v: string): IVersionValidationResult => {
	const [leadChar] = v;

	// Star wildcard is not allowed at all
	if (v === '*') {
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
	if (v.indexOf('http') > -1) {
		return {
			error: true,
			text: logMessages.error.versionDefinition.tarball(v),
		};
	}

	return { error: false };
};

/**
 * Checks a single dependency record and its entries against the definition rules
 * @param {PackageDependencyKeys} type 		Named dependency field type
 * @param {Record<string, string>} deps 	Dependency records
 * @returns {IVersionValidationResult} 		Validation result
 */
const validateDependenciesRecord = (type: PackageDependencyKeys, deps: Record<string, string> = {}) => {
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
		: { error: true, text: logMessages.error.allDependenciesExact(type, errorStack), invalidDefinitions };
};

/**
 * Checks if the package.json of the project only contains valid versions
 * @returns {{ dependencies: IVersionValidationResult, devDependencies: IVersionValidationResult }} The validation results
 */
export const validateDependenciesVersionsAreExact = async () => {
	const packageContents = await getFileData('package.json');
	const pkg: IPackage = JSON.parse(packageContents);

	return {
		dependencies: validateDependenciesRecord('dependencies', pkg.dependencies),
		devDependencies: validateDependenciesRecord('devDependencies', pkg.devDependencies),
	};
};

export const getExactDependencyVersionsChecker = async (): Promise<ILogMessage> => {
	const { dependencies, devDependencies } = await validateDependenciesVersionsAreExact();
	const error = dependencies.error || devDependencies.error;
	const text = [dependencies.text, devDependencies.text].filter(Boolean).join('\n');

	return {
		error,
		text,
	};
};
