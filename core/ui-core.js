
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
			return require('./tooling/build.js')
        case WATCH:
			return require('./tooling/watch.js')
        case WATCH_INLINE:
			return require('./tooling/watch-inlines.js')
        case DEFAULT_CONFIG:
			return require('./config/config.js')
        case GENERATE_BUILD_CONFIG:
			return require('./tooling/generateBuildConfig.js')
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

