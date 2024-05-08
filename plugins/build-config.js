require('events').EventEmitter.defaultMaxListeners = 0

const path = require('path')
const progress = require('rollup-plugin-progress')
const replace = require('@rollup/plugin-replace')
const globals = require('rollup-plugin-node-globals')
const commonjs = require('@rollup/plugin-commonjs')
const alias = require('@rollup/plugin-alias')
const terser = require('@rollup/plugin-terser')
const babel = require('@rollup/plugin-babel')
const webWorkerLoader = require('@qortal/rollup-plugin-web-worker-loader')
const { nodeResolve } = require('@rollup/plugin-node-resolve')

const aliases = {}

const generateRollupConfig = (inputFile, outputFile) => {
	return {
		inputOptions: {
			onwarn: (warning, rollupWarn) => {
				if (warning.code !== 'CIRCULAR_DEPENDENCY') {
					rollupWarn(warning)
				}
			},
			input: inputFile,
			plugins: [
				alias({
					entries: Object.keys(aliases).map((find) => {
						return {
							find,
							replacement: aliases[find]
						}
					}),
				}),
				nodeResolve({
					preferBuiltins: false,
					mainFields: ['module', 'browser']
				}),
				replace({
					preventAssignment: true,
					'process.env.NODE_ENV': JSON.stringify('production')
				}),
				commonjs(),
				globals(),
				progress(),
				webWorkerLoader(),
				babel.babel({
					babelHelpers: 'bundled',
					exclude: 'node_modules/**'
				}),
				terser({
					compress: true,
					output: {
						comments: false
					},
				}),
			],
		},
		outputOptions: {
			file: outputFile,
			format: 'umd'
		}
	}
}

const generateForPlugins = () => {
	return [
		{
			in: 'plugins/core/main.src.js',
			out: 'plugins/core/main.js'
		},
		{
			in: 'plugins/core/become-minter/become-minter.src.js',
			out: 'plugins/core/become-minter/become-minter.js'
		},
		{
			in: 'plugins/core/data-management/data-management.src.js',
			out: 'plugins/core/data-management/data-management.js'
		},
		{
			in: 'plugins/core/group-management/group-management.src.js',
			out: 'plugins/core/group-management/group-management.js'
		},
		{
			in: 'plugins/core/minting-info/minting-info.src.js',
			out: 'plugins/core/minting-info/minting-info.js'
		},
		{
			in: 'plugins/core/name-registration/name-registration.src.js',
			out: 'plugins/core/name-registration/name-registration.js'
		},
		{
			in: 'plugins/core/names-market/names-market.src.js',
			out: 'plugins/core/names-market/names-market.js'
		},
		{
			in: 'plugins/core/node-management/node-management.src.js',
			out: 'plugins/core/node-management/node-management.js'
		},
		{
			in: 'plugins/core/overview-page/overview-page.src.js',
			out: 'plugins/core/overview-page/overview-page.js'
		},
		{
			in: 'plugins/core/puzzles/puzzles.src.js',
			out: 'plugins/core/puzzles/puzzles.js'
		},
		{
			in: 'plugins/core/q-app/q-apps.src.js',
			out: 'plugins/core/q-app/q-apps.js'
		},
		{
			in: 'plugins/core/q-chat/q-chat.src.js',
			out: 'plugins/core/q-chat/q-chat.js'
		},
		{
			in: 'plugins/core/qdn/browser/browser.src.js',
			out: 'plugins/core/qdn/browser/browser.js'
		},
		{
			in: 'plugins/core/qdn/publish/publish.src.js',
			out: 'plugins/core/qdn/publish/publish.js'
		},
		{
			in: 'plugins/core/qortal-lottery/qortal-lottery.src.js',
			out: 'plugins/core/qortal-lottery/qortal-lottery.js'
		},
		{
			in: 'plugins/core/q-website/q-websites.src.js',
			out: 'plugins/core/q-website/q-websites.js'
		},
		{
			in: 'plugins/core/reward-share/reward-share.src.js',
			out: 'plugins/core/reward-share/reward-share.js'
		},
		{
			in: 'plugins/core/sponsorship-list/sponsorship-list.src.js',
			out: 'plugins/core/sponsorship-list/sponsorship-list.js'
		},
		{
			in: 'plugins/core/trade-bot/trade-bot-portal.src.js',
			out: 'plugins/core/trade-bot/trade-bot-portal.js'
		},
		{
			in: 'plugins/core/trade-portal/trade-portal.src.js',
			out: 'plugins/core/trade-portal/trade-portal.js'
		},
		{
			in: 'plugins/core/wallet/wallet-app.src.js',
			out: 'plugins/core/wallet/wallet-app.js'
		}
	].map((file) => {
		return generateRollupConfig(
			path.join(__dirname, file.in),
			path.join(__dirname, file.out)
		)
	})
}

module.exports = generateForPlugins