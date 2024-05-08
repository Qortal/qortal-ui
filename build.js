const path = require('path')
const uiCore = require('./core/ui-core.js')
const config = require('./config/config.js')
const pluginsController = require('./plugins/default-plugins.js')
const generateBuildConfig = uiCore('generate_build_config')
const build = uiCore('build')
const buildDefalutPlugins = pluginsController('build')

srcConfig = {
	...config.build,
	options: {
		...config.build.options,
		outputDir: path.join(__dirname, '/builtWWW'),
		sassOutputDir: path.join(__dirname, '/builtWWW/styles.bundle.css')
	}
}

const { buildConfig, inlineConfigs } = generateBuildConfig(srcConfig)

build(buildConfig.options, buildConfig.outputs, buildConfig.outputOptions, buildConfig.inputOptions, inlineConfigs).then(() => {
	console.log("Building and Bundling Plugins")
	buildDefalutPlugins()
})