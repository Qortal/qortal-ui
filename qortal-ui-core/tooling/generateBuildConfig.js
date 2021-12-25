const path = require('path')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const progress = require('rollup-plugin-progress')
const replace = require('@rollup/plugin-replace')
const globals = require('rollup-plugin-node-globals')
const commonjs = require('@rollup/plugin-commonjs')
const alias = require('@rollup/plugin-alias')
const { terser } = require('rollup-plugin-terser')
const scss = require('rollup-plugin-scss')
const generateES5BuildConfig = require('./generateES5BuildConfig')


const generateInputs = (tree, inputs = {}) => {

    for (const file of Object.values(tree)) {

        inputs[file.file.split('.')[0]] = file.source
        if (file.children) generateInputs(file.children, inputs)
    }
    return inputs
}

const generateBuildConfig = ({ elementComponents, functionalComponents, otherOutputs, apiComponents, aliases, options, inlineComponents }) => {
    const buildConfig = {
        outputs: [
            {
                dir: 'es6',
                format: 'esm'
            }
        ],
        outputOptions: {
            sourcemap: false
        },
        inputOptions: {
            onwarn: (warning, rollupWarn) => {
                if (warning.code !== 'CIRCULAR_DEPENDENCY') {
                    rollupWarn(warning)
                }
            },
            input: {
                main: options.inputFile,
                ...generateInputs(elementComponents)
            },
            plugins: [
                alias({
                    entries: Object.keys(aliases).map(find => {
                        return {
                            find,
                            replacement: aliases[find]
                        }
                    })
                }),
                nodeResolve({
                    preferBuiltins: false,
                    mainFields: ['module', 'browser']
                }),
                replace({
                    preventAssignment: true,
                    "process.env.NODE_ENV": JSON.stringify("production"),
                }),
                commonjs(),
                globals(),
                progress(),
                scss({
                    output: options.sassOutputDir
                }),
                terser({
                    compress: true,
                    output: {
                        comments: false
                    }
                })
            ],
	    preserveEntrySignatures: false,
            external: ['crypto'],
            context: 'window'
        },
        options: {
            outputDir: options.outputDir
        }
    }

    for (const output of buildConfig.outputs) {
        output.dir = path.join(options.outputDir, output.dir)
    }

    const inlineConfigs = generateES5BuildConfig(inlineComponents, {
        outputDir: options.outputDir,
        aliases
    })

    return {
        buildConfig,
        inlineConfigs
    }
}

module.exports = generateBuildConfig
