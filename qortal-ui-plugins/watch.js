const rollup = require('rollup')

const configs = require('./build-config.js')()

const watch = () => {
    configs.forEach(async file => {
        const watchOptions = {
            ...file.inputOptions,
            output: [file.outputOptions],
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
    })
    console.log('WATCH PLUGINS ==> Write Bundle : Done 🎉');
}

module.exports = watch
