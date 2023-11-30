module.exports = {
	extends: [
		'@merkle-open/eslint-config/configurations/typescript-node.js',
		'@merkle-open/eslint-config/configurations/typescript-node-disable-styles.js',
	].map(require.resolve),
	rules: {
		'no-console': 0,
		'no-await-in-loop': 0,
		complexity: 0,
	},
};
