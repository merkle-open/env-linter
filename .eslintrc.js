module.exports = {
	extends: [
		'@namics/eslint-config/configurations/typescript-node.js',
		'@namics/eslint-config/configurations/typescript-node-disable-styles.js',
	].map(require.resolve),
	rules: {
		'no-console': 0,
		'no-await-in-loop': 0,
		complexity: 0,
	},
};
