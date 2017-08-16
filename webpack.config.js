'use strict'

const webpack = require('webpack')

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
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(true),
		new webpack.optimize.AggressiveMergingPlugin()
	],
	module: {
		rules: [
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
