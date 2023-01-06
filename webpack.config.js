const path = require('path');
const os = require("os");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = (env) => {
	return {
		mode: 'production',
		target: 'node',
		node: {
			__dirname: false,
			__filename: false
		},
		resolve: {
			extensions: ['.js', '.ts'],
			alias: {
				// override any-observable in listr because it uses require in runtime
				'any-observable': path.resolve('./src/observable.js'),
			},
		},
		output: {
			filename: 'index.js',
			library: {
				name: 'env-linter',
				type: 'umd',
				umdNamedDefine: true
			},
			path: path.resolve(__dirname, "dist"),
			clean: true
		},
		cache: {
			type: 'filesystem',
			cacheDirectory: path.resolve(__dirname, '../.cache-loader')
		},
		module: {
			rules: [
				{
					// .ts, .tsx, .d.ts
					test: /\.(tsx?|d.ts)$/,
					use: [
						{
							// run compilation threaded
							loader: require.resolve('thread-loader'),
							options: {
								// there should be 1 cpu for the fork-ts-checker-webpack-plugin
								workers: os.cpus().length - 1,
							},
						},
						{
							// main typescript compilation loader
							loader: require.resolve('ts-loader'),
							options: {
								/**
								 * Increase build speed by disabling typechecking for the
								 * main process and is required to be used with thread-loader
								 * @see https://github.com/TypeStrong/ts-loader/blob/master/examples/thread-loader/webpack.config.js
								 * Requires to use the ForkTsCheckerWebpack Plugin
								 */
								happyPackMode: true,
								// Set the tsconfig.json path
								configFile: path.resolve(__dirname, 'tsconfig.json')
							},
						},
					],
				}
			],
		},
		plugins: [
			// Multi threading typescript loader configuration with caching for .ts and .tsx files
			// see https://github.com/merkle-open/webpack-config-plugins/tree/master/packages/ts-config-webpack-plugin/config
			new ForkTsCheckerWebpackPlugin({
				// block webpack's emit to wait for type checker/linter and to add errors to the webpack's compilation
				// also required for the the overlay functionality of webpack-dev-server
				async: env !== 'production',
				typescript: {
					diagnosticOptions: {
						semantic: true,
						syntactic: true,
					},
					configFile: path.resolve(__dirname, 'tsconfig.json'),
				},
			}),
		],
	}
};
