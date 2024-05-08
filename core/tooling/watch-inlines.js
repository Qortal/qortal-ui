const rollup = require('rollup')

async function watchInlines(inlineConfigs) {
	for (const conf of inlineConfigs) {
		const watchOptions = {
			...conf.inputOptions,
			output: [conf.outputOptions],
			watch: {
			}
		}
		const watcher = rollup.watch(watchOptions)
		watcher.on('event', event => {
		})
	}
}

module.exports = watchInlines