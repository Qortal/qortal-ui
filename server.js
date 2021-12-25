const path = require("path")

const uiCore = require('qortal-ui-core')
const createServer = uiCore('server')

const config = require('./config/config.js')

const pluginsController = require('qortal-ui-plugins')
const qortalPlugins = pluginsController('plugins')

const plugins = [
    ...qortalPlugins
]

const rootDir = process.env.NODE_ENV === 'production' ? __dirname : __dirname


const conf = {
    ...config,
    build: {
        ...config.build,
        options: {
            ...config.build.options,
            outputDir: path.join(rootDir, '/builtWWW')
        }
    }
}

const server = createServer(conf, plugins)
server.start()
