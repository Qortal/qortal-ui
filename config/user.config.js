const user = require('./default.config.js').user
module.exports = {
	node: 0, // set to mainnet
	server: {
		primary: {
			port: 12388, // set as default UI port
			address: '0.0.0.0', // can specify an IP for a fixed bind
		},
	},
}
