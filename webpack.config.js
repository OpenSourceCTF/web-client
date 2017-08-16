'use strict'

module.exports = {
	context: __dirname,
	target: 'web',
	resolve: {
		extensions: ['.js', '.json']
	},
	entry: './src/main.js',
	output: {
		filename: 'bundle.js',
		path: `${__dirname}/dist`,
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				use: [
					{
						loader: 'eslint-loader',
						options: {
							configFile: './.eslintrc',
							emitError: true,
							emitWarning: true
						}
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['babili']
					}
				},
				exclude: /node_modules/
			}
		]
	}
}
