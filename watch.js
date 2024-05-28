const path = require('path')
const uiCore = require('./core/ui-core.js')
const generateBuildConfig = uiCore('generate_build_config')
const watch = uiCore('watch')
const config = require('./config/config.js')
const pluginsController = require('./plugins/default-plugins.js')
const watchInline = require('./watch-inline.js')

const watchPlugins = pluginsController('watch')

let srcConfig = {
	...config.build,
	options: {
		...config.build.options,
		outputDir: path.join(__dirname, '/builtWWW'),
		sassOutputDir: path.join(__dirname, '/builtWWW/styles.bundle.css')
	}
}

const { buildConfig, inlineConfigs } = generateBuildConfig(srcConfig)

watch(buildConfig.options, buildConfig.outputs, buildConfig.outputOptions, buildConfig.inputOptions)
watchInline()
watchPlugins()