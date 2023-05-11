const Path = require('path')
const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')

function serverFactory(routes, address, port, tls) {
    this.server = new Hapi.Server({
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '../')
            }
        },
        address: address,
        port: port,
        tls: tls
    })

    this.startServer = async () => {
        try {
            await this.server.register([Inert])

            this.server.route(routes)

            await this.server.start()

            delete this.startServer
            return this.server
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}

module.exports = serverFactory
