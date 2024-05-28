const path = require('path')

const user = {
	node: 0,
	nodeSettings: {
		pingInterval: 30 * 1000
	},
	server: {
		writeHosts: {
			enabled: true
		},
		relativeTo: path.join(__dirname, '../'),
		primary: {
			domain: '0.0.0.0',
			address: '0.0.0.0',
			port: 12388,
			directory: './src/',
			page404: './src/404.html',
			host: '0.0.0.0'
		}
	},
	tls: {
		enabled: false,
		options: {
			key: '',
			cert: ''
		}
	},
	constants: {
		pollingInterval: 30 * 1000, // How long between checking for new unconfirmed transactions and new blocks (in milliseconds).
		workerURL: '/build/worker.js'
	},

	// Notification Settings (All defaults to true)
	notifications: {
		q_chat: {
			playSound: true,
			showNotification: true
		}
	}
}

module.exports = user