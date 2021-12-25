const babel = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');
const commonjs = require('@rollup/plugin-commonjs');
const progress = require('rollup-plugin-progress');
const { terser } = require("rollup-plugin-terser");
const path = require('path');
const alias = require('@rollup/plugin-alias');

const generateRollupConfig = (file, { outputDir, aliases }) => {

    return {
        inputOptions: {
            input: file.input,
            onwarn: (warning, rollupWarn) => {
                if (warning.code !== 'CIRCULAR_DEPENDENCY') {
                    rollupWarn(warning)
                }
            },
            plugins: [
                nodeResolve({
                    preferBuiltins: false,
                    mainFields: ['module', 'browser']
                }),
                replace({
                    preventAssignment: true,
                    "process.env.NODE_ENV": JSON.stringify("production"),
                }),
                alias({
                    entries: Object.keys(aliases).map(find => {
                        return {
                            find,
                            replacement: aliases[find]
                        }
                    })
                }),
                commonjs(),
                progress(),
                babel.babel({
                    babelHelpers: 'bundled',
                    exclude: 'node_modules/**'
                }),
                terser({
                    compress: true,
                    output: {
                        comments: false,
                    },
                })
            ],
	    preserveEntrySignatures: false,
            external: ['crypto']
        },
        outputOptions: {
            file: path.join(outputDir, file.output),
            format: 'umd',
            name: 'worker',
            sourcemap: false
        }
    }
}

const generateES5BuildConfig = (files, options) => {
    return files.map(file => generateRollupConfig(file, options))
}

module.exports = generateES5BuildConfig
