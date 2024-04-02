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
			return [
				{
					folder: path.join(__dirname, 'plugins/core'),
					name: 'core'
				}
			]
        case BUILD:
			return require('./build.js')
        case WATCH:
			return require('./watch.js')
        default:
            return
    }

}


module.exports = pluginsController
