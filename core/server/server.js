const ServerFactory = require('./ServerFactory.js')

const createPrimaryRoutes = require('./routes/createPrimaryRoutes.js')

const createServer = (config, plugins) => {
    this.start = async function () {
        const primaryServer = new ServerFactory(createPrimaryRoutes(config, plugins), config.user.server.primary.host, config.user.server.primary.port, config.user.tls.enabled ? config.user.tls.options : void 0)
        primaryServer.startServer()
            .then(server => {
                console.log(`Qortal UI Server started at ${server.info.uri} and listening on ${server.info.address}`)
            })
            .catch(e => {
                console.error(e)
            })
    }
    return this
}


const serverExports = {
    createServer
}

module.exports = serverExports
