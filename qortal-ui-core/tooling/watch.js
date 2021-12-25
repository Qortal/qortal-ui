const rollup = require('rollup')

async function watch(options, outputs, outputOptions, inputOptions) {

    const watchOptions = {
        ...inputOptions,
        output: outputs.map(option => {
            return {
                ...outputOptions,
                ...option
            }
        }),
        watch: {
            // chokidar,
            // clearScreen,
            // exclude,
            // include
        }
    }
    const watcher = rollup.watch(watchOptions)

    watcher.on('event', event => {
        // ...
    })
}

async function writeBundle(bundle, outputOptions) {

    await bundle.generate(outputOptions)

    await bundle.write(outputOptions)
    console.log('WATCH CORE ==> Write Bundle : Done 🎉');
}

async function buildInline(conf) {
    const bundle = await rollup.rollup(conf.inputOptions).catch(err => {
        throw err
    })

    await writeBundle(bundle, conf.outputOptions)
}

module.exports = watch
