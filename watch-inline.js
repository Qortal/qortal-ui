const path = require('path')
const uiCore = require('./core/ui-core.js')
const config = require('./config/config.js')
const pluginsController = require('./plugins/default-plugins.js')

const generateBuildConfig = uiCore('generate_build_config')
const watchInlines = uiCore('watch_inline')
const watchDefaultPlugins = pluginsController('watch')

let srcConfig = {
	...config.build,
	options: {
		...config.build.options,
		outputDir: path.join(__dirname, '/builtWWW'),
		sassOutputDir: path.join(__dirname, '/builtWWW/styles.bundle.css')
	}
}

const { inlineConfigs } = generateBuildConfig(srcConfig)

module.exports = () => {
	watchInlines(inlineConfigs)
	watchDefaultPlugins()
}