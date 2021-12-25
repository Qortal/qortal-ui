
const PLUGINS = 'plugins'
const BUILD = 'build'
const WATCH = 'watch'


/**
 * @package Plugins Controller
 * @param { String } type
 */

const pluginsController = (type) => {
    switch (type) {
        case PLUGINS:
            const path = require('path')
            const plugins = [
                {
                    folder: path.join(__dirname, 'plugins/core'),
                    name: 'core'
                }
            ]
            return plugins
        case BUILD:
            const build = require('./build.js')
            return build
        case WATCH:
            const watch = require('./watch.js')
            return watch
        default:
            return
    }

}


module.exports = pluginsController
