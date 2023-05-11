
const SERVER = 'server'
const BUILD = 'build'
const WATCH = 'watch'
const WATCH_INLINE = 'watch_inline'
const DEFAULT_CONFIG = 'default_config'
const GENERATE_BUILD_CONFIG = 'generate_build_config'

/**
 * @package UI Core Controller
 * @param type String
 */

const uiCoreController = (type) => {
    switch (type) {
        case SERVER:
            const { createServer } = require('./server/server.js')
            return createServer
        case BUILD:
            const build = require('./tooling/build.js')
            return build
        case WATCH:
            const watch = require('./tooling/watch.js')
            return watch
        case WATCH_INLINE:
            const watchInlines = require('./tooling/watch-inlines.js')
            return watchInlines
        case DEFAULT_CONFIG:
            const defaultConfig = require('./config/config.js')
            return defaultConfig
        case GENERATE_BUILD_CONFIG:
            const generateBuildConfig = require('./tooling/generateBuildConfig.js')
            return generateBuildConfig
        default:
            return
    }

}

module.exports = uiCoreController

/**
 * Performance update
 * Write a CSS ripple effect and replace all paper-ripple and mwc-ripple
 * Do something about the particles...
 */

//  TODO: notifications settings, do not show notification in an active chat, Fix double message rendering, right custom menu in chat

