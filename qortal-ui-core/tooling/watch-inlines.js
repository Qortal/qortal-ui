const rollup = require('rollup')

async function watchInlines (inlineConfigs) {
    for (const conf of inlineConfigs) {
        const watchOptions = {
            ...conf.inputOptions,
            // output: [outputOptions],
            output: [conf.outputOptions],
            watch: {
                // chokidar,
                // clearScreen,
                // exclude,
                // include
            }
        }

        const watcher = rollup.watch(watchOptions)

        watcher.on('event', event => {
            // event.code can be one of:
            //   START        — the watcher is (re)starting
            //   BUNDLE_START — building an individual bundle
            //   BUNDLE_END   — finished building a bundle
            //   END          — finished building all bundles
            //   ERROR        — encountered an error while bundling
            //   FATAL        — encountered an unrecoverable error
        })

        // stop watching
        // watcher.close()
    }
    // console.log(bundle.watchFiles) // an array of file names this bundle depends on

    // console.log(bundle, conf.outputOptions)
    // await writeBundle(bundle, conf.outputOptions)
    // console.log('bundle written')
}

// build()

module.exports = watchInlines
